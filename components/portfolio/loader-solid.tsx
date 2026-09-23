'use client';

import { useEffect, useRef } from 'react';

const SEGMENTS = 72;
const PROFILES = [3, 4, 6, 12];

function profilePositions(sides: number) {
  const positions = new Float32Array((SEGMENTS * 4 + 2) * 3);
  const rings = [{ radius: .89, depth: -.4 }, { radius: 1, depth: -.28 }, { radius: 1, depth: .28 }, { radius: .89, depth: .4 }];
  const sector = Math.PI * 2 / sides;

  rings.forEach(({ radius, depth }, ring) => {
    for (let index = 0; index < SEGMENTS; index += 1) {
      const angle = index * Math.PI * 2 / SEGMENTS;
      const localAngle = ((angle + sector / 2) % sector) - sector / 2;
      const distance = radius * Math.cos(Math.PI / sides) / Math.cos(localAngle);
      const offset = (ring * SEGMENTS + index) * 3;

      positions[offset] = Math.cos(angle - Math.PI / 2) * distance;
      positions[offset + 1] = Math.sin(angle - Math.PI / 2) * distance;
      positions[offset + 2] = depth;
    }
  });
  positions[SEGMENTS * 4 * 3 + 2] = -.4;
  positions[(SEGMENTS * 4 + 1) * 3 + 2] = .4;

  return positions;
}

export function LoaderSolid({ onReady }: { onReady: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    if (!host) {

      return;
    }

    async function initialize() {
      const { WebGPURenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute, MeshPhysicalNodeMaterial, Mesh, DirectionalLight, AmbientLight, ACESFilmicToneMapping } = await import('three/webgpu');

      if (disposed || !host) {

        return;
      }

      const renderer = new WebGPURenderer({ alpha: true, antialias: true, forceWebGL: true });
      const scene = new Scene();
      const camera = new PerspectiveCamera(35, 1, .1, 20);
      const profiles = PROFILES.map(profilePositions);
      const [firstProfile] = profiles;
      const geometry = new BufferGeometry();
      const positions = new BufferAttribute(firstProfile.slice(), 3);
      const indices: number[] = [];
      const material = new MeshPhysicalNodeMaterial({ color: '#444444', metalness: .15, roughness: .5, clearcoat: 1, flatShading: true });
      const mesh = new Mesh(geometry, material);
      const key = new DirectionalLight('#ffffff', 5);
      const rim = new DirectionalLight('#dddddd', 4);
      const fill = new DirectionalLight('#ffffff', 2);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      let previousTime = 0;
      let elapsed = 0;

      cleanup = () => { renderer.setAnimationLoop(null); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); };

      for (let ring = 0; ring < 3; ring += 1) {
        for (let index = 0; index < SEGMENTS; index += 1) {
          const next = (index + 1) % SEGMENTS;
          const a = ring * SEGMENTS + index;
          const b = ring * SEGMENTS + next;
          const c = (ring + 1) * SEGMENTS + index;
          const d = (ring + 1) * SEGMENTS + next;

          indices.push(a, b, c, b, d, c);
        }
      }

      for (let index = 0; index < SEGMENTS; index += 1) {
        const next = (index + 1) % SEGMENTS;

        indices.push(SEGMENTS * 4, next, index, SEGMENTS * 4 + 1, SEGMENTS * 3 + index, SEGMENTS * 3 + next);
      }

      geometry.setAttribute('position', positions);
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      mesh.frustumCulled = false;
      mesh.rotation.set(-.35, -.5, .15);
      scene.add(mesh, new AmbientLight('#eeeeee', 1.8));
      key.position.set(-3, 4, 5);
      rim.position.set(3, 1, -2);
      fill.position.set(3, -2, 3);
      scene.add(key, rim, fill);
      camera.position.z = 5.2;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(112, 112);
      renderer.toneMapping = ACESFilmicToneMapping;
      await renderer.init();

      if (disposed) {
        cleanup?.();

        return;
      }

      host.appendChild(renderer.domElement);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      renderer.render(scene, camera);
      onReady();
      renderer.setAnimationLoop((now: number) => {
        const delta = Math.min((now - previousTime) / 1000, .05);

        previousTime = now;

        if (document.hidden) {

          return;
        }

        if (!reduced.matches) {
          elapsed += delta;

          const cycle = elapsed / .85;
          const index = Math.floor(cycle) % profiles.length;
          const phase = Math.min(Math.max(((cycle % 1) - .2) / .8, 0), 1);
          const blend = phase * phase * (3 - 2 * phase);
          const from = profiles[index];
          const to = profiles[(index + 1) % profiles.length];

          for (let coordinate = 0; coordinate < positions.array.length; coordinate += 1) {
            positions.array[coordinate] = from[coordinate] + (to[coordinate] - from[coordinate]) * blend;
          }

          positions.needsUpdate = true;
          geometry.computeVertexNormals();
          mesh.rotation.y = -.65 + elapsed * .65;
          mesh.rotation.x = -.4 + Math.cos(elapsed * .7) * .1;
          mesh.rotation.z = elapsed * .16;
        }

        renderer.render(scene, camera);
      });
    }

    void initialize().catch(() => {
      cleanup?.();

      if (!disposed) {
        onReady();
      }
    });

    return () => { disposed = true; cleanup?.(); };
  }, [onReady]);

  return <div className="loader-solid" ref={hostRef} aria-hidden="true" />;
}
