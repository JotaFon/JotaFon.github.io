'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, MoveUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Material, Mesh, Object3D, Texture } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type SculptureControls = { setPaused: (value: boolean) => void; reset: () => void };

function disposeModel(root: Object3D) {
  const materials = new Set<Material>();
  const textures = new Set<Texture>();

  root.traverse((object) => {
    const mesh = object as Mesh;
    const { geometry, material, isMesh } = mesh;

    if (!isMesh) {

      return;
    }

    geometry.dispose();
    (Array.isArray(material) ? material : [material]).forEach((item) => materials.add(item));
  });
  materials.forEach((material) => {
    Object.values(material).forEach((value) => {
      if ((value as Texture)?.isTexture) {
        textures.add(value as Texture);
      }
    });
    material.dispose();
  });
  textures.forEach((texture) => texture.dispose());
}

export function Sculpture({ onSettled }: { onSettled: () => void }) {
  const { t } = useTranslation('portfolio');
  const hostRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<SculptureControls | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    const disposers: (() => void)[] = [];
    let disposed = false;

    if (!host) {

      return;
    }

    function cleanup() {
      disposers.splice(0).reverse().forEach((dispose) => dispose());
      controlsRef.current = null;
    }

    async function initialize() {
      const [THREE, { GLTFLoader }, { uv, uniform }, { MeshoptDecoder }] = await Promise.all([
        import('three/webgpu'), import('three/addons/loaders/GLTFLoader.js'), import('three/tsl'), import('three/addons/libs/meshopt_decoder.module.js'),
      ]);
      const { WebGPURenderer, Scene, PerspectiveCamera, Group, Box3, Vector3, DirectionalLight, HemisphereLight, Mesh, PlaneGeometry, MeshBasicNodeMaterial, AnimationMixer } = THREE;

      if (disposed) {

        return;
      }

      const renderer = new WebGPURenderer({ alpha: true, antialias: true, forceWebGL: true });
      const scene = new Scene();
      const camera = new PerspectiveCamera(33, 1, .1, 50);
      const character = new Group();
      const shadowMaterial = new MeshBasicNodeMaterial({ color: '#202020', transparent: true, depthWrite: false });
      const shadowGeometry = new PlaneGeometry(3.5, 3.5);
      const shadowOpacity = uniform(.4);
      const shadow = new Mesh(shadowGeometry, shadowMaterial);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const pointer = { x: 0, y: 0, id: -1, lastX: 0 };
      const scrollFlow = { progress: 0 };
      const gesture = { stretch: 1, lean: 0 };
      const gestureTimeline = gsap.timeline({ paused: true });
      let motionPaused = reduced.matches;
      let visible = true;
      let lastTime = 0;
      let targetY = 0;

      disposers.push(() => {
        gestureTimeline.kill();
        renderer.setAnimationLoop(null);
        renderer.domElement.remove();
        shadowGeometry.dispose();
        shadowMaterial.dispose();
        renderer.dispose();
      });
      shadowMaterial.opacityNode = shadowOpacity.mul(uv().sub(.5).length().smoothstep(.04, .46).oneMinus().pow(2));
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -.025;
      scene.add(character, shadow, new HemisphereLight('#ffffff', '#666666', 2.6));

      const keyLight = new DirectionalLight('#ffffff', 3.2);
      const rimLight = new DirectionalLight('#eeeeee', 4);
      const fillLight = new DirectionalLight('#dddddd', 1);

      keyLight.position.set(-3, 5, 6);
      rimLight.position.set(3, 3, -3);
      fillLight.position.set(4, 2, 4);
      scene.add(keyLight, rimLight, fillLight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      await renderer.init();

      if (disposed) {

        return;
      }

      const { scene: model, animations } = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync('/models/mickey/mickey.gltf');

      if (disposed) {
        disposeModel(model);

        return;
      }

      disposers.push(() => disposeModel(model));

      const mixer = new AnimationMixer(model);
      const actions = animations.map((clip) => mixer.clipAction(clip).play());
      const frameGroups: Object3D[] = [];
      const bounds = new Box3();
      const worldScale = new Vector3();
      const placement = new Group();

      mixer.update(0);
      model.updateMatrixWorld(true);
      model.traverse((object) => {
        const { name, children } = object;
        const { isMesh } = object as Mesh;

        if (name.startsWith('TimeframeMainGroup') && children.length > 1) {
          frameGroups.push(object);
        }

        if (isMesh && object.getWorldScale(worldScale).lengthSq() > .000001) {
          bounds.expandByObject(object, true);
        }
      });

      const size = bounds.getSize(new Vector3());
      const center = bounds.getCenter(new Vector3());
      const scale = 3 / size.y;

      placement.scale.setScalar(scale);
      placement.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
      placement.add(model);
      character.add(placement);
      disposers.push(() => { mixer.stopAllAction(); mixer.uncacheRoot(model); });
      character.rotation.y = targetY;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host!.appendChild(renderer.domElement);

      function resize() {
        const { width, height } = host!.getBoundingClientRect();
        const aspect = width / Math.max(height, 1);

        renderer.setSize(Math.max(width, 1), Math.max(height, 1));
        camera.aspect = aspect;
        camera.position.set(0, 2.05, 6.8 / Math.min(aspect, 1));
        camera.lookAt(0, 1.25, 0);
        camera.updateProjectionMatrix();
      }

      function replay() {
        actions.forEach((action) => action.reset().play());
        mixer.setTime(0);
      }

      function onPointerDown(event: PointerEvent) {
        if (!event.isPrimary || event.button !== 0) {

          return;
        }

        pointer.id = event.pointerId;
        pointer.lastX = event.clientX;
        host!.setPointerCapture(event.pointerId);

        if (!motionPaused) {
          gestureTimeline.clear().to(gesture, { stretch: .94, lean: -.025, duration: .18, ease: 'power2.out' }).restart();
        }
      }

      function onPointerMove(event: PointerEvent) {
        const { left, top, width, height } = host!.getBoundingClientRect();

        if (event.pointerType === 'mouse') {
          pointer.x = (event.clientX - left) / width - .5;
          pointer.y = (event.clientY - top) / height - .5;
        }

        if (pointer.id === event.pointerId) {
          targetY += (event.clientX - pointer.lastX) * .008;
          pointer.lastX = event.clientX;
        }
      }

      function onPointerLeave() {
        pointer.x = 0;
        pointer.y = 0;
      }

      function onPointerUp(event: PointerEvent) {
        if (pointer.id !== event.pointerId) {

          return;
        }

        if (host!.hasPointerCapture(event.pointerId)) {
          host!.releasePointerCapture(event.pointerId);
        }

        pointer.id = -1;
        onPointerLeave();

        if (!motionPaused) {
          gestureTimeline.clear()
            .to(gesture, { stretch: 1.065, lean: .02, duration: .19, ease: 'power2.out' })
            .to(gesture, { stretch: 1, lean: 0, duration: .65, ease: 'elastic.out(1, .45)' }).restart();
        }
      }

      function onKeyDown(event: KeyboardEvent) {
        const { key } = event;

        if (key === 'ArrowLeft' || key === 'ArrowRight') {
          event.preventDefault();
          targetY += key === 'ArrowLeft' ? -.3 : .3;
        }

        if (key === ' ' || key === 'Enter') {
          event.preventDefault();

          if (!event.repeat) {
            setMotionPaused(!motionPaused);
            setPaused(motionPaused);
          }
        }
      }

      function setMotionPaused(value: boolean) {
        motionPaused = value;

        if (value) {
          gestureTimeline.pause();
          gesture.stretch = 1;
          gesture.lean = 0;
        }
      }

      function onPreferenceChange({ matches }: MediaQueryListEvent) {
        setMotionPaused(matches);
        setPaused(matches);
      }

      gsap.registerPlugin(ScrollTrigger);

      const motion = gsap.matchMedia();

      motion.add('(prefers-reduced-motion: no-preference)', () => {
        const tween = gsap.to(scrollFlow, { progress: 1, ease: 'none', scrollTrigger: { trigger: host!.closest('.hero'), start: 'top top', end: 'bottom top', scrub: .65 } });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          scrollFlow.progress = 0;
        };
      });
      disposers.push(() => motion.revert());

      function render(now: number) {
        const delta = Math.min((now - lastTime) / 1000, .05);

        lastTime = now;

        if (!visible || document.hidden) {

          return;
        }

        if (!motionPaused) {
          mixer.update(delta);
        }

        const easing = 1 - Math.exp(-delta * 7);
        const followX = motionPaused ? 0 : pointer.x;
        const followY = motionPaused ? 0 : pointer.y;
        const flow = motionPaused ? 0 : scrollFlow.progress;
        const stretch = motionPaused ? 1 : gesture.stretch;
        const width = 1 / Math.sqrt(stretch);

        character.scale.set(width, stretch, width);
        character.rotation.z = motionPaused ? 0 : gesture.lean;
        shadow.scale.setScalar(width);
        character.rotation.y += (targetY + followX * .35 + flow * .7 - character.rotation.y) * easing;
        character.rotation.x += (followY * .07 - character.rotation.x) * easing;
        frameGroups.forEach(({ children }) => {
          children.forEach((frame) => { frame.visible = frame.scale.lengthSq() > .000001; });
        });
        renderer.render(scene, camera);
      }

      const observer = new ResizeObserver(resize);
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });

      controlsRef.current = {
        setPaused: setMotionPaused,
        reset: () => {
          targetY = 0;
          pointer.x = 0;
          pointer.y = 0;
          replay();
        },
      };
      host!.addEventListener('pointerdown', onPointerDown);
      host!.addEventListener('pointermove', onPointerMove);
      host!.addEventListener('pointerup', onPointerUp);
      host!.addEventListener('pointercancel', onPointerUp);
      host!.addEventListener('pointerleave', onPointerLeave);
      host!.addEventListener('keydown', onKeyDown);
      reduced.addEventListener('change', onPreferenceChange);
      observer.observe(host!);
      intersection.observe(host!);
      disposers.push(() => {
        observer.disconnect();
        intersection.disconnect();
        reduced.removeEventListener('change', onPreferenceChange);
        host!.removeEventListener('pointerdown', onPointerDown);
        host!.removeEventListener('pointermove', onPointerMove);
        host!.removeEventListener('pointerup', onPointerUp);
        host!.removeEventListener('pointercancel', onPointerUp);
        host!.removeEventListener('pointerleave', onPointerLeave);
        host!.removeEventListener('keydown', onKeyDown);
      });
      resize();
      renderer.render(scene, camera);
      renderer.setAnimationLoop(render);
      setReady(true);
      setPaused(reduced.matches);
      onSettled();
    }

    setReady(false);
    setFailed(false);
    void initialize().catch(() => {
      cleanup();

      if (!disposed) {
        setFailed(true);
        onSettled();
      }
    });

    return () => { disposed = true; cleanup(); };
  }, [onSettled, attempt]);

  function togglePause() {
    const next = !paused;

    setPaused(next);
    controlsRef.current?.setPaused(next);
  }

  return (
    <div className={`sculpture character-scene ${ready ? 'is-ready' : ''}`}>
      <div className="sculpture-canvas" ref={hostRef} role="group" tabIndex={ready ? 0 : -1} aria-label={t('scene.label')} aria-describedby={ready ? 'scene-interaction-hint' : undefined} />
      {!ready && <div className="scene-loading mono"><p role="status">{t(failed ? 'scene.fallback' : 'scene.loading')}</p>{failed && <button onClick={() => setAttempt((value) => value + 1)}>{t('scene.retry')}</button>}</div>}
      {ready && (
        <div className="scene-caption">
          <span className="mono">{t('scene.number')}</span>
          <div className="scene-controls">
            <button onClick={togglePause} aria-label={t(paused ? 'scene.paused' : 'scene.playing')} aria-pressed={paused}>{paused ? <Play size={13} /> : <Pause size={13} />}</button>
            <button onClick={() => controlsRef.current?.reset()} aria-label={t('scene.reset')}><RotateCcw size={13} /></button>
          </div>
          <span className="scene-hint" id="scene-interaction-hint"><MoveUpRight size={13} aria-hidden="true" />{t('scene.hint')}</span>
          <span className="scene-credit">{t('scene.credit')} <a href="https://sketchfab.com/3d-models/steamboat-willie-animated-fd5073a9f0294743b2d6da0909bdb17b" target="_blank" rel="noreferrer">{t('scene.author')}</a><span aria-hidden="true"> · </span><a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">{t('scene.license')}</a></span>
        </div>
      )}
    </div>
  );
}
