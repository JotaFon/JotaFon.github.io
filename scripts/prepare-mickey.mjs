import fs from 'node:fs';
import path from 'node:path';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';

// Preserve the original Alembic motion with interpolated samples at 7.5 fps.
// Topology-changing meshes retain their original frames at 15 fps.
const source = path.resolve(process.argv[2] ?? '../mickey');
const destination = path.resolve('public/models/mickey');
const gltf = JSON.parse(fs.readFileSync(path.join(source, 'scene.gltf'), 'utf8'));
const binary = fs.readFileSync(path.join(source, 'scene.bin'));
const sampleFrames = Array.from({ length: 81 }, (_, index) => index * 4);
const animation = gltf.animations[0];
const removedNodes = new Set();
const frameNodes = [];
const newAccessors = [];
const newViews = [];
const chunks = [];
let compressedOffset = 0;
let decodedOffset = 0;

await Promise.all([MeshoptEncoder.ready, MeshoptSimplifier.ready]);

function readAccessor(index) {
  const { bufferView, byteOffset = 0, count, type, componentType } = gltf.accessors[index];
  const { byteOffset: viewOffset = 0, byteStride } = gltf.bufferViews[bufferView];
  const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[type];
  const ArrayType = componentType === 5125 ? Uint32Array : Float32Array;
  const result = new ArrayType(count * components);
  const stride = byteStride ?? components * 4;

  for (let item = 0; item < count; item++) {
    for (let channel = 0; channel < components; channel++) {
      const offset = viewOffset + byteOffset + item * stride + channel * 4;

      result[item * components + channel] = componentType === 5125 ? binary.readUInt32LE(offset) : binary.readFloatLE(offset);
    }
  }

  return result;
}

function writeAccessor(values, type, { indices = false, bounds = false, filtered = false } = {}) {
  const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[type];
  const count = values.length / components;
  const stride = components * 4;
  const bytes = filtered ? MeshoptEncoder.encodeFilterExp(values, count, stride, 16, 'SharedComponent') : new Uint8Array(values.buffer, values.byteOffset, values.byteLength);
  const mode = indices ? 'TRIANGLES' : 'ATTRIBUTES';
  const encoded = MeshoptEncoder.encodeGltfBuffer(bytes, count, stride, mode);
  const extension = { buffer: 0, byteOffset: compressedOffset, byteLength: encoded.length, byteStride: stride, count, mode, ...(filtered ? { filter: 'EXPONENTIAL' } : {}) };
  const accessor = { bufferView: newViews.length, componentType: indices ? 5125 : 5126, count, type };

  if (bounds) {
    accessor.min = Array(components).fill(Infinity);
    accessor.max = Array(components).fill(-Infinity);

    for (let index = 0; index < values.length; index++) {
      const component = index % components;

      accessor.min[component] = Math.min(accessor.min[component], values[index]);
      accessor.max[component] = Math.max(accessor.max[component], values[index]);
    }
  }

  newViews.push({ buffer: 1, byteOffset: decodedOffset, byteLength: bytes.length, ...(components > 1 ? { byteStride: stride } : {}), extensions: { EXT_meshopt_compression: extension } });
  newAccessors.push(accessor);
  chunks.push(encoded);
  compressedOffset += encoded.length;
  decodedOffset += bytes.length;

  return newAccessors.length - 1;
}

for (const node of gltf.nodes) {
  const { children = [] } = node;

  if (node.name !== 'TimeframeMainGroup' || children.length !== 321) {
    continue;
  }

  animation.channels = animation.channels.filter(({ target }) => !children.includes(target.node));
  node.children = children.filter((id, frame) => {
    if (frame % 2) {
      removedNodes.add(id);
      removedNodes.add(gltf.nodes[id].children[0]);

      return false;
    }

    frameNodes.push({ id, frame });

    return true;
  });
}

const nodeIds = gltf.nodes.map((_, index) => index).filter((id) => !removedNodes.has(id));
const nodeMap = new Map(nodeIds.map((id, index) => [id, index]));
const meshIds = [...new Set(nodeIds.map((id) => gltf.nodes[id].mesh).filter((id) => id !== undefined))];
const meshMap = new Map(meshIds.map((id, index) => [id, index]));
const morphMeshes = new Set();
const meshes = meshIds.map((id) => {
  const { name, primitives } = gltf.meshes[id];
  const [primitive] = primitives;
  const { attributes, indices, material, targets } = primitive;
  const positions = readAccessor(attributes.POSITION);
  const originalIndices = readAccessor(indices);
  const [simplified] = MeshoptSimplifier.simplify(originalIndices, positions, 3, Math.floor(originalIndices.length * .6 / 3) * 3, .001);
  const [remap, count] = MeshoptSimplifier.compactMesh(simplified);


  function compact(values) {
    const result = new Float32Array(count * 3);

    for (let vertex = 0; vertex < remap.length; vertex++) {
      if (remap[vertex] === 0xffffffff) {
        continue;
      }

      result.set(values.subarray(vertex * 3, vertex * 3 + 3), remap[vertex] * 3);
    }

    return result;
  }

  const output = { name, primitives: [{ attributes: { POSITION: writeAccessor(compact(positions), 'VEC3', { bounds: true, filtered: true }) }, indices: writeAccessor(simplified, 'SCALAR', { indices: true }), material }] };

  if (targets) {
    morphMeshes.add(id);
    output.weights = Array(sampleFrames.length - 1).fill(0);
    output.primitives[0].targets = sampleFrames.slice(1).map((frame) => {
      const values = readAccessor(targets[frame - 1].POSITION);

      return { POSITION: writeAccessor(compact(values), 'VEC3', { bounds: true, filtered: true }) };
    });
  }

  return output;
});
const nodes = nodeIds.map((id) => {
  const node = structuredClone(gltf.nodes[id]);

  if (node.children) {
    node.children = node.children.filter((child) => nodeMap.has(child)).map((child) => nodeMap.get(child));
  }

  if (node.mesh !== undefined) {
    node.mesh = meshMap.get(node.mesh);
  }

  return node;
});
const channels = [];
const samplers = [];
const accessorCache = new Map();

function copyAccessor(id) {
  if (!accessorCache.has(id)) {
    const { type, min } = gltf.accessors[id];

    accessorCache.set(id, writeAccessor(readAccessor(id), type, { bounds: !!min }));
  }

  return accessorCache.get(id);
}

for (const { sampler, target } of animation.channels) {
  if (!nodeMap.has(target.node) || target.path === 'weights') {
    continue;
  }

  const { input, output, interpolation } = animation.samplers[sampler];

  channels.push({ sampler: samplers.length, target: { ...target, node: nodeMap.get(target.node) } });
  samplers.push({ input: copyAccessor(input), output: copyAccessor(output), interpolation });
}

const originalWeightChannel = animation.channels.find(({ target }) => target.path === 'weights');
const originalTimes = readAccessor(animation.samplers[originalWeightChannel.sampler].input);
const times = new Float32Array(sampleFrames.map((frame) => originalTimes[frame]));
const weights = new Float32Array(sampleFrames.length * (sampleFrames.length - 1));

for (let frame = 1; frame < sampleFrames.length; frame++) {
  weights[frame * (sampleFrames.length - 1) + frame - 1] = 1;
}

for (const { id, frame } of frameNodes) {
  const start = originalTimes[frame];
  const end = originalTimes[Math.min(frame + 2, 320)];
  const frameTimes = frame ? [0, start, ...(frame < 320 ? [end] : [])] : [0, end];
  const scales = frame ? [0, 0, 0, 1, 1, 1, ...(frame < 320 ? [0, 0, 0] : [])] : [1, 1, 1, 0, 0, 0];

  channels.push({ sampler: samplers.length, target: { node: nodeMap.get(id), path: 'scale' } });
  samplers.push({ input: writeAccessor(new Float32Array(frameTimes), 'SCALAR', { bounds: true }), output: writeAccessor(new Float32Array(scales), 'VEC3'), interpolation: 'STEP' });
}

const weightSampler = { input: writeAccessor(times, 'SCALAR', { bounds: true }), output: writeAccessor(weights, 'SCALAR'), interpolation: 'LINEAR' };

for (const id of nodeIds) {
  if (!morphMeshes.has(gltf.nodes[id].mesh)) {
    continue;
  }

  channels.push({ sampler: samplers.length, target: { node: nodeMap.get(id), path: 'weights' } });
  samplers.push(weightSampler);
}

const output = { asset: gltf.asset, extensionsUsed: ['KHR_materials_unlit', 'EXT_meshopt_compression'], extensionsRequired: ['EXT_meshopt_compression'], scene: 0, scenes: gltf.scenes.map((scene) => ({ ...scene, nodes: scene.nodes.map((id) => nodeMap.get(id)) })), nodes, meshes, materials: gltf.materials, animations: [{ name: 'Steamboat Willie', channels, samplers }], accessors: newAccessors, bufferViews: newViews, buffers: [{ uri: 'mickey.bin', byteLength: compressedOffset }, { byteLength: decodedOffset, extensions: { EXT_meshopt_compression: { fallback: true } } }] };

fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(path.join(destination, 'mickey.gltf'), JSON.stringify(output));
fs.writeFileSync(path.join(destination, 'mickey.bin'), Buffer.concat(chunks));
fs.copyFileSync(path.join(source, 'license.txt'), path.join(destination, 'license.txt'));
fs.appendFileSync(path.join(destination, 'license.txt'), '\n\nAdaptation: topology-changing frames sampled at 15 fps and morph animation interpolated at 7.5 fps; geometry simplified and meshopt-compressed for web playback. Original monochrome materials preserved.\n');
console.log(JSON.stringify({ originalBytes: binary.length, compressedBytes: compressedOffset, meshes: meshes.length, nodes: nodes.length, morphSamples: sampleFrames.length, duration: times.at(-1) }));
