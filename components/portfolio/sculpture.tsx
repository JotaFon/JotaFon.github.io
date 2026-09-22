'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type SculptureControls = { setBlue: (value: boolean) => void; setPaused: (value: boolean) => void; reset: () => void };

export function Sculpture() {
  const { t } = useTranslation('portfolio');
  const hostRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<SculptureControls | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [blue, setBlue] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    if (!host) {

      return;
    }

    async function initialize() {
      const [THREE, tsl, { RoomEnvironment }] = await Promise.all([
        import('three/webgpu'), import('three/tsl'), import('three/addons/environments/RoomEnvironment.js'),
      ]);
      const { WebGPURenderer, Scene, PerspectiveCamera, TorusKnotGeometry, MeshPhysicalNodeMaterial, Mesh, PMREMGenerator, DirectionalLight } = THREE;
      const { uniform, positionLocal, normalLocal, sin, mix, color } = tsl;

      if (disposed || !host) {

        return;
      }

      const renderer = new WebGPURenderer({ alpha: true, antialias: true, forceWebGL: true });
      const scene = new Scene();
      const camera = new PerspectiveCamera(35, 1, .1, 50);
      const clock = uniform(0);
      const blend = uniform(0);
      const material = new MeshPhysicalNodeMaterial({ metalness: 1, roughness: .21, clearcoat: 1, clearcoatRoughness: .15 });
      const wave = sin(positionLocal.y.mul(2).add(clock)).mul(sin(positionLocal.x.mul(5).add(clock.mul(.7)))).mul(.1);
      const geometry = new TorusKnotGeometry(1, .30, 200, 50, 2, 3);
      const sculpture = new Mesh(geometry, material);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const pointer = { x: 0, y: 0, drag: false, lastX: 0, lastY: 0 };
      let motionPaused = reduced.matches;
      let visible = true;
      let lastTime = 0;
      let elapsed = 0;
      let targetX = .35;
      let targetY = -.4;
      let blueTarget = 0;

      material.positionNode = positionLocal.add(normalLocal.mul(wave));
      material.colorNode = mix(color('#d9dcd6'), color('#4abbf8'), blend);
      camera.position.set(0, 0, 8.7);
      sculpture.rotation.set(.35, -.4, -.28);
      scene.add(sculpture);

      const light = new DirectionalLight('#4abbf8', 200);

      light.position.set(2, 4, 2);
      scene.add(light);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      await renderer.init();

      if (disposed) {
        geometry.dispose();
        material.dispose();
        renderer.dispose();

        return;
      }

      const environment = new RoomEnvironment();
      const pmrem = new PMREMGenerator(renderer);
      const envTarget = await pmrem.fromSceneAsync(environment, .04);

      environment.dispose();

      if (disposed) {
        envTarget.dispose();
        pmrem.dispose();
        geometry.dispose();
        material.dispose();
        renderer.dispose();

        return;
      }

      scene.environment = envTarget.texture;
      host.appendChild(renderer.domElement);
      renderer.domElement.setAttribute('aria-hidden', 'true');

      function resize() {
        const { width, height } = host!.getBoundingClientRect();

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.position.z = 8.7 / Math.min(camera.aspect, 1);
        camera.updateProjectionMatrix();
      }

      function onPointerDown(event: PointerEvent) {
        pointer.drag = true;
        pointer.lastX = event.clientX;
        pointer.lastY = event.clientY;
        host!.setPointerCapture(event.pointerId);
      }

      function onPointerMove(event: PointerEvent) {
        const { left, top, width, height } = host!.getBoundingClientRect();

        pointer.x = (event.clientX - left) / width - .5;
        pointer.y = (event.clientY - top) / height - .5;

        if (pointer.drag) {
          targetY += (event.clientX - pointer.lastX) * .008;
          targetX += (event.clientY - pointer.lastY) * .006;
          pointer.lastX = event.clientX;
          pointer.lastY = event.clientY;
        }
      }

      function onPointerUp() {
        pointer.drag = false;
      }

      function onKeyDown(event: KeyboardEvent) {
        const { key } = event;

        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
          event.preventDefault();
          targetY += key === 'ArrowLeft' ? -.25 : key === 'ArrowRight' ? .25 : 0;
          targetX += key === 'ArrowUp' ? -.25 : key === 'ArrowDown' ? .25 : 0;
        }
      }

      function onPreferenceChange({ matches }: MediaQueryListEvent) {
        motionPaused = matches;
        setPaused(matches);
      }

      function render(now: number) {
        const delta = Math.min((now - lastTime) / 1000, .05);

        lastTime = now;

        if (!visible || document.hidden) {

          return;
        }

        if (!motionPaused) {
          elapsed += delta;
          clock.value = elapsed * .6;
          targetY += delta * .09;
        }

        blend.value += (blueTarget - blend.value) * .06;
        sculpture.rotation.x += (targetX + pointer.y * .15 - sculpture.rotation.x) * .055;
        sculpture.rotation.y += (targetY + pointer.x * .2 - sculpture.rotation.y) * .055;
        sculpture.position.y = motionPaused ? 0 : Math.sin(elapsed * .6) * .08;
        renderer.render(scene, camera);
      }

      const observer = new ResizeObserver(resize);
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });

      controlsRef.current = {
        setBlue: (value) => { blueTarget = value ? 1 : 0; },
        setPaused: (value) => { motionPaused = value; },
        reset: () => { targetX = .35; targetY = -.4; pointer.x = 0; pointer.y = 0; },
      };
      host.addEventListener('pointerdown', onPointerDown);
      host.addEventListener('pointermove', onPointerMove);
      host.addEventListener('pointerup', onPointerUp);
      host.addEventListener('pointercancel', onPointerUp);
      host.addEventListener('keydown', onKeyDown);
      reduced.addEventListener('change', onPreferenceChange);
      observer.observe(host);
      intersection.observe(host);
      resize();
      renderer.setAnimationLoop(render);
      setReady(true);
      setPaused(reduced.matches);
      cleanup = () => {
        renderer.setAnimationLoop(null);
        observer.disconnect();
        intersection.disconnect();
        reduced.removeEventListener('change', onPreferenceChange);
        host.removeEventListener('pointerdown', onPointerDown);
        host.removeEventListener('pointermove', onPointerMove);
        host.removeEventListener('pointerup', onPointerUp);
        host.removeEventListener('pointercancel', onPointerUp);
        host.removeEventListener('keydown', onKeyDown);
        renderer.domElement.remove();
        geometry.dispose();
        material.dispose();
        envTarget.dispose();
        pmrem.dispose();
        renderer.dispose();
        controlsRef.current = null;
      };

      if (disposed) {
        cleanup();
      }
    }

    void initialize().catch(() => {
      if (!disposed) {
        setFailed(true);
      }
    });

    return () => { disposed = true; cleanup?.(); };
  }, []);

  function toggleMaterial() {
    const next = !blue;

    setBlue(next);
    controlsRef.current?.setBlue(next);
  }

  function togglePause() {
    const next = !paused;

    setPaused(next);
    controlsRef.current?.setPaused(next);
  }

  return (
    <div className={`sculpture ${ready ? 'is-ready' : ''}`}>
      <div className="sculpture-canvas" ref={hostRef} role="group" tabIndex={ready ? 0 : -1} aria-label={t('scene.label')} />
      {!ready && <p className="scene-loading mono">{t(failed ? 'scene.fallback' : 'scene.loading')}</p>}
      {ready && <div className="scene-caption"><span className="mono">{t('scene.number')}</span><div className="scene-controls"><button className="material-button" onClick={toggleMaterial} aria-label={t('scene.material')} aria-pressed={blue}><i className={blue ? 'blue-swatch' : 'chrome-swatch'} />{t(blue ? 'scene.blue' : 'scene.chrome')}</button><button onClick={togglePause} aria-label={t(paused ? 'scene.paused' : 'scene.playing')}>{paused ? <Play size={13}/> : <Pause size={13}/>}</button><button onClick={() => controlsRef.current?.reset()} aria-label={t('scene.reset')}><RotateCcw size={13}/></button></div><span className="scene-hint mono">{t('scene.hint')}</span></div>}
    </div>
  );
}
