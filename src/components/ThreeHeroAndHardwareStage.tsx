import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { FARZAM_LOGO_PATH } from './BrandSvg';
import type { HardwareLayerSpec } from '../data/farzamData';
import { toPersianDigits } from '../utils/telemetryLogic';

export type SignalVisualMode = 'moving' | 'stopped' | 'alert' | 'cold';

interface ThreeStageProps {
  mode: 'hero' | 'hardware';
  signalState?: SignalVisualMode;
  activeLayerId?: HardwareLayerSpec['id'];
  explodeFactor?: number; // 0 to 1
  onSelectLayer?: (id: HardwareLayerSpec['id']) => void;
}

// Reusable scratch vectors at module scope to prevent GC allocations in the render loop
const _targetCameraPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3();
const _beaconPos = new THREE.Vector3();
const _beaconTangent = new THREE.Vector3();
const _upVec = new THREE.Vector3(0, 1, 0);

function detectSoftwareWebGL(): { supported: boolean; isSoftware: boolean } {
  if (typeof document === 'undefined') return { supported: false, isSoftware: true };
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return { supported: false, isSoftware: true };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    const isSoftware = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return { supported: true, isSoftware };
  } catch {
    return { supported: false, isSoftware: true };
  }
}

export const ThreeHeroAndHardwareStage: React.FC<ThreeStageProps> = ({
  mode,
  signalState = 'moving',
  activeLayerId = 'gps',
  explodeFactor = 0.65,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });

  // Store mutable props in ref so React state updates never recreate the WebGLRenderer
  const stateRef = useRef({
    mode,
    signalState,
    activeLayerId,
    explodeFactor,
    pointerX: 0,
    pointerY: 0,
    inView: true,
    pulseBoost: 0,
  });

  useEffect(() => {
    stateRef.current.mode = mode;
    stateRef.current.signalState = signalState;
    stateRef.current.activeLayerId = activeLayerId;
    stateRef.current.explodeFactor = explodeFactor;
  }, [mode, signalState, activeLayerId, explodeFactor]);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const { supported, isSoftware } = detectSoftwareWebGL();
    if (!supported || prefersReducedMotion) {
      setFallbackMode(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftware,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setFallbackMode(true);
      return;
    }

    const width = Math.max(mountEl.clientWidth, 300);
    const height = Math.max(mountEl.clientHeight, 300);
    const isMobile = width < 768;
    const maxDpr = isSoftware ? 1 : isMobile ? 1.5 : Math.min(window.devicePixelRatio || 1, 2);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(maxDpr);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftware;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08131c, 0.055);

    // Studio Environment Reflection (Mandatory PBR standard)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 7.2);

    // 3-Point Studio Lighting with Warm Key + Cool Hemisphere Fill
    const hemiLight = new THREE.HemisphereLight(0xe8decd, 0x08131c, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e0, 2.2);
    keyLight.position.set(4.5, 6.5, 5.0);
    if (!isSoftware) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 20;
      const d = 4.5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff742e, 1.65);
    rimLight.position.set(-5.0, 2.5, -4.0);
    scene.add(rimLight);

    // Shared PBR Materials (Strictly derived from Brand Colors #102333, #FF742E, #E8DECD)
    const navyAnodisedMat = new THREE.MeshStandardMaterial({
      color: 0x102333,
      metalness: 0.78,
      roughness: 0.24,
    });
    const navyMatteMat = new THREE.MeshStandardMaterial({
      color: 0x183146,
      metalness: 0.35,
      roughness: 0.62,
    });
    const beigeCeramicMat = new THREE.MeshStandardMaterial({
      color: 0xe8decd,
      metalness: 0.15,
      roughness: 0.32,
    });
    const orangeSignalMat = new THREE.MeshStandardMaterial({
      color: 0xff742e,
      emissive: 0xff742e,
      emissiveIntensity: 0.85,
      metalness: 0.2,
      roughness: 0.2,
    });
    const coldGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x8ab0c7,
      transparent: true,
      opacity: isSoftware ? 0.55 : 0.78,
      transmission: isSoftware ? 0 : 0.65,
      roughness: 0.18,
      metalness: 0.1,
      clearcoat: 1.0,
    });

    // Contact shadow grounding plane
    const groundGeo = new THREE.CircleGeometry(4.2, 48);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x050c12,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });
    const groundDisc = new THREE.Mesh(groundGeo, groundMat);
    groundDisc.rotation.x = -Math.PI / 2;
    groundDisc.position.y = -2.35;
    scene.add(groundDisc);

    // Coordinate ring on floor (offset +0.02 on Y to prevent Z-fighting)
    const floorRingGeo = new THREE.RingGeometry(2.4, 2.44, 64);
    const floorRingMat = new THREE.MeshBasicMaterial({
      color: 0xff742e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
    });
    const floorRing = new THREE.Mesh(floorRingGeo, floorRingMat);
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = -2.33;
    scene.add(floorRing);

    // =========================================================================
    // GROUP 1: HERO SCULPTURE (Composite 9-Part Architectural Farzam Monolith + Signal Orbit)
    // =========================================================================
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // 1. Left Outer Pillar (echoing logo.svg left vertical stem)
    const pillarLeftGeo = new THREE.CapsuleGeometry(0.22, 2.1, 12, 24);
    const pillarLeft = new THREE.Mesh(pillarLeftGeo, navyAnodisedMat);
    pillarLeft.position.set(-1.15, -0.1, 0);
    heroGroup.add(pillarLeft);

    // 2. Inner Chamber Pillar
    const pillarInnerGeo = new THREE.CapsuleGeometry(0.22, 1.45, 12, 24);
    const pillarInner = new THREE.Mesh(pillarInnerGeo, navyMatteMat);
    pillarInner.position.set(-0.42, -0.42, 0.12);
    heroGroup.add(pillarInner);

    // 3. Top Crown Arch Bar
    const crownBarGeo = new THREE.BoxGeometry(2.1, 0.42, 0.48);
    const crownBar = new THREE.Mesh(crownBarGeo, navyAnodisedMat);
    crownBar.position.set(-0.1, 1.15, 0);
    heroGroup.add(crownBar);

    // 4. Sweeping Parabolic Wing (echoing logo.svg right curve)
    const wingCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 0.25, 0.18),
      new THREE.Vector3(0.95, 0.25, 0.22),
      new THREE.Vector3(0.72, -0.75, 0.1),
      new THREE.Vector3(-0.15, -1.55, 0.0),
    ]);
    const wingGeo = new THREE.TubeGeometry(wingCurve, 40, 0.21, 16, false);
    const wingMesh = new THREE.Mesh(wingGeo, beigeCeramicMat);
    heroGroup.add(wingMesh);

    // 5. Living Orange Signal Ribbon orbiting through the chamber
    const signalOrbitCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-1.8, 1.45, 0.8),
        new THREE.Vector3(-0.2, 0.75, 1.15),
        new THREE.Vector3(1.45, 0.15, 0.65),
        new THREE.Vector3(0.85, -1.15, -0.75),
        new THREE.Vector3(-0.85, -1.35, -0.85),
        new THREE.Vector3(-1.75, 0.1, 0.45),
      ],
      true,
    );
    const signalTubeGeo = new THREE.TubeGeometry(signalOrbitCurve, 96, 0.055, 12, true);
    const signalTube = new THREE.Mesh(signalTubeGeo, orangeSignalMat);
    heroGroup.add(signalTube);

    // 6. Composite 4-part Fleet Vehicle Beacon riding the signal curve
    const vehicleBeacon = new THREE.Group();
    const hullMesh = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.18), beigeCeramicMat);
    const cabMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.16), navyAnodisedMat);
    cabMesh.position.set(0.1, 0.09, 0);
    const pulseCore = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), orangeSignalMat);
    pulseCore.position.set(-0.06, 0.1, 0);
    const haloRing = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.24, 24),
      new THREE.MeshBasicMaterial({ color: 0xff742e, side: THREE.DoubleSide }),
    );
    haloRing.rotation.x = Math.PI / 2;
    haloRing.position.y = -0.06;
    vehicleBeacon.add(hullMesh, cabMesh, pulseCore, haloRing);
    heroGroup.add(vehicleBeacon);

    // 7. Geofence Translucent Dome Shell around the sculpture
    const domeGeo = new THREE.SphereGeometry(2.15, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.58);
    const domeMesh = new THREE.Mesh(domeGeo, coldGlassMat);
    domeMesh.position.y = -0.85;
    domeMesh.material.depthWrite = false;
    domeMesh.renderOrder = 2;
    heroGroup.add(domeMesh);

    // =========================================================================
    // GROUP 2: HARDWARE EXPLODED VIEW (7 Functional Tracker Layers + Central Signal Spine)
    // =========================================================================
    const hardwareGroup = new THREE.Group();
    hardwareGroup.visible = false;
    scene.add(hardwareGroup);

    const layerIds: HardwareLayerSpec['id'][] = [
      'gps',
      'sim',
      'ignition',
      'motion',
      'voltage',
      'temperature',
      'fuel',
    ];
    const baseLayerY = [1.35, 0.9, 0.45, 0.0, -0.45, -0.9, -1.35];
    const layerMeshes: Record<HardwareLayerSpec['id'], THREE.Group> = {} as Record<
      HardwareLayerSpec['id'],
      THREE.Group
    >;

    layerIds.forEach((id, idx) => {
      const grp = new THREE.Group();
      grp.position.y = baseLayerY[idx];

      if (id === 'gps') {
        // Top anodised casing + ceramic patch antenna
        const shell = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.22, 1.45), navyAnodisedMat);
        const patch = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.1, 0.85), beigeCeramicMat);
        patch.position.y = 0.14;
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.18, 16), orangeSignalMat);
        pin.position.set(0, 0.22, 0);
        grp.add(shell, patch, pin);
      } else if (id === 'sim') {
        // Cellular SIM tray + metallic contact pads
        const board = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 1.3), navyMatteMat);
        const simCard = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.08, 0.48), orangeSignalMat);
        simCard.position.set(0.35, 0.09, 0.15);
        grp.add(board, simCard);
      } else if (id === 'ignition') {
        // Ignition / Power harness module
        const harness = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.14, 1.25), beigeCeramicMat);
        const relay = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.2, 20), orangeSignalMat);
        relay.position.set(-0.45, 0.12, 0);
        grp.add(harness, relay);
      } else if (id === 'motion') {
        // 3-axis accelerometer & speed gyroscope core
        const pcb = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 1.3), navyAnodisedMat);
        const gyroRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.05, 12, 32), orangeSignalMat);
        gyroRing.rotation.x = Math.PI / 2;
        gyroRing.position.y = 0.1;
        grp.add(pcb, gyroRing);
      } else if (id === 'voltage') {
        // Power / Voltage regulator bank
        const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.14, 1.2), navyMatteMat);
        const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.24, 16), beigeCeramicMat);
        cap1.position.set(-0.35, 0.14, -0.2);
        const cap2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.24, 16), beigeCeramicMat);
        cap2.position.set(0.35, 0.14, 0.2);
        grp.add(base, cap1, cap2);
      } else if (id === 'temperature') {
        // Cold-chain frosted glass sensor module
        const frostPlate = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.18, 1.15), coldGlassMat);
        const probe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 16), beigeCeramicMat);
        probe.rotation.z = Math.PI / 2;
        probe.position.set(0, 0.12, 0);
        grp.add(frostPlate, probe);
      } else {
        // Fuel sensor & bottom rugged chassis
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.24, 1.45), navyAnodisedMat);
        const fuelGauge = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 24), orangeSignalMat);
        fuelGauge.position.set(0, 0.15, 0);
        grp.add(chassis, fuelGauge);
      }

      layerMeshes[id] = grp;
      hardwareGroup.add(grp);
    });

    // Central orange signal core threading vertically through all 7 hardware layers
    const coreBeamGeo = new THREE.CylinderGeometry(0.045, 0.045, 4.2, 16);
    const coreBeam = new THREE.Mesh(coreBeamGeo, orangeSignalMat);
    hardwareGroup.add(coreBeam);

    // Pre-warm shaders on real GPUs
    if (!isSoftware) {
      renderer.compile(scene, camera);
    }

    // IntersectionObserver to pause rendering when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          stateRef.current.inView = entry.isIntersecting;
        });
      },
      { threshold: 0.05 },
    );
    observer.observe(mountEl);

    // Handle Resize via both window resize and ResizeObserver
    const handleResize = () => {
      if (!mountEl) return;
      const w = Math.max(mountEl.clientWidth, 240);
      const h = Math.max(mountEl.clientHeight, 240);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => handleResize())
        : null;
    resizeObserver?.observe(mountEl);

    // Software-WebGL safe pacing loop (`afterDraw` from threejs skill)
    const clock = new THREE.Clock();
    let frameId = 0;
    let isDisposed = false;

    function afterDraw(cb: () => void) {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 8);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 85);
          }
        };
        frameId = window.setTimeout(poll, 8);
      } else {
        frameId = window.setTimeout(cb, 90);
      }
    }

    let orbitProgress = 0.18;

    function tick() {
      if (isDisposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const st = stateRef.current;

      if (st.inView) {
        const isHero = st.mode === 'hero';
        heroGroup.visible = isHero;
        hardwareGroup.visible = !isHero;

        // Smooth camera damping
        if (isHero) {
          _targetCameraPos.set(st.pointerX * 1.1, 0.65 + st.pointerY * 0.65, 6.2);
          _targetLookAt.set(0, -0.1, 0);
        } else {
          const activeIdx = layerIds.indexOf(st.activeLayerId);
          const focusY = (baseLayerY[activeIdx] ?? 0) * (0.55 + st.explodeFactor * 0.65);
          _targetCameraPos.set(2.35 + st.pointerX * 0.7, 0.9 + focusY * 0.35 + st.pointerY * 0.5, 5.4);
          _targetLookAt.set(0, focusY * 0.4, 0);
        }

        camera.position.lerp(_targetCameraPos, 1 - Math.exp(-6.5 * dt));
        _currentLookAt.lerp(_targetLookAt, 1 - Math.exp(-6.5 * dt));
        camera.lookAt(_currentLookAt);

        // Update signal color/intensity by state
        if (st.signalState === 'cold') {
          orangeSignalMat.color.setHex(0x8ab0c7);
          orangeSignalMat.emissive.setHex(0x8ab0c7);
          orangeSignalMat.emissiveIntensity = 0.75;
        } else if (st.signalState === 'alert') {
          orangeSignalMat.color.setHex(0xff742e);
          orangeSignalMat.emissive.setHex(0xe04819);
          orangeSignalMat.emissiveIntensity = 1.15 + Math.sin(elapsed * 8) * 0.35;
        } else {
          orangeSignalMat.color.setHex(0xff742e);
          orangeSignalMat.emissive.setHex(0xff742e);
          orangeSignalMat.emissiveIntensity = 0.85;
        }

        if (isHero) {
          heroGroup.rotation.y = THREE.MathUtils.damp(
            heroGroup.rotation.y,
            st.pointerX * 0.45 + Math.sin(elapsed * 0.45) * 0.14,
            5,
            dt,
          );
          heroGroup.rotation.x = THREE.MathUtils.damp(
            heroGroup.rotation.x,
            st.pointerY * 0.25,
            5,
            dt,
          );

          const speedFactor =
            st.signalState === 'stopped' ? 0.0 : st.signalState === 'alert' ? 0.16 : 0.095;
          orbitProgress = (orbitProgress + dt * speedFactor) % 1;
          signalOrbitCurve.getPointAt(orbitProgress, _beaconPos);
          signalOrbitCurve.getTangentAt(orbitProgress, _beaconTangent);
          vehicleBeacon.position.copy(_beaconPos);
          vehicleBeacon.lookAt(_beaconPos.clone().add(_beaconTangent));
          vehicleBeacon.up.copy(_upVec);

          const ringScale =
            st.signalState === 'stopped'
              ? 1.45 + Math.sin(elapsed * 3.0) * 0.25
              : 1.0 + Math.sin(elapsed * 5.0) * 0.12;
          haloRing.scale.setScalar(ringScale);
        } else {
          // Hardware exploded-view layer separation
          hardwareGroup.rotation.y = THREE.MathUtils.damp(
            hardwareGroup.rotation.y,
            -0.45 + st.pointerX * 0.55 + elapsed * 0.12,
            5,
            dt,
          );
          const spread = 0.45 + st.explodeFactor * 0.85;
          layerIds.forEach((id, idx) => {
            const grp = layerMeshes[id];
            const isSelected = id === st.activeLayerId;
            const targetY = baseLayerY[idx] * spread;
            const targetX = isSelected ? 0.28 : 0;
            const targetScale = isSelected ? 1.08 : 0.96;

            grp.position.y = THREE.MathUtils.damp(grp.position.y, targetY, 7.5, dt);
            grp.position.x = THREE.MathUtils.damp(grp.position.x, targetX, 7.5, dt);
            const nextScale = THREE.MathUtils.damp(grp.scale.x, targetScale, 7.5, dt);
            grp.scale.setScalar(nextScale);
          });
        }

        renderer.render(scene, camera);
      }

      if (isSoftware) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      observer.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
    stateRef.current.pointerX = nx;
    stateRef.current.pointerY = ny;
    setPointerOffset({ x: nx, y: ny });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        stateRef.current.pointerX = 0;
        stateRef.current.pointerY = 0;
        setPointerOffset({ x: 0, y: 0 });
      }}
      data-testid={`three-stage-${mode}`}
      className="relative w-full h-full min-h-[340px] select-none overflow-hidden rounded-[28px]"
      style={{
        background:
          'radial-gradient(circle at 50% 42%, rgba(24, 49, 70, 0.72) 0%, rgba(8, 19, 28, 0.96) 76%)',
        border: '1px solid var(--surface-dark-border)',
      }}
    >
      {/* Subtle architectural coordinate grid backdrop */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
        viewBox="0 0 600 450"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`grid-${mode}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--color-beige-200)"
              strokeWidth="0.6"
              strokeOpacity="0.25"
            />
          </pattern>
        </defs>
        <rect width="600" height="450" fill={`url(#grid-${mode})`} />
        <ellipse
          cx={300 + pointerOffset.x * 18}
          cy={235 - pointerOffset.y * 14}
          rx="210"
          ry="115"
          fill="none"
          stroke="var(--color-orange-500)"
          strokeWidth="1.5"
          strokeDasharray="8 10"
        />
      </svg>

      {/* Dedicated empty mount div for Three.js WebGLRenderer */}
      {!fallbackMode && (
        <div
          ref={mountRef}
          className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing"
          aria-label={
            mode === 'hero'
              ? 'نمای سه‌بعدی تعاملی نشان فرزام و رشته سیگنال زنده'
              : 'نمای سه‌بعدی لایه‌باز سخت‌افزار ردیاب فرزام'
          }
        />
      )}

      {/* High-craft interactive SVG fallback when WebGL is disabled or reduced-motion is preferred */}
      {fallbackMode && (
        <div className="relative z-10 flex items-center justify-center w-full h-full p-6">
          <svg
            viewBox="0 0 400 320"
            className="w-full max-w-[360px] h-auto"
            role="img"
            aria-label="شماتیک مهندسی سیگنال و سخت‌افزار فرزام"
          >
            <circle
              cx="200"
              cy="160"
              r="118"
              fill="none"
              stroke="var(--color-beige-200)"
              strokeOpacity="0.2"
              strokeDasharray="6 6"
            />
            <g transform="translate(130, 42) scale(0.68)">
              <path d={FARZAM_LOGO_PATH} fill="var(--color-navy-700)" stroke="var(--color-beige-200)" strokeWidth="3" />
              <path
                d={FARZAM_LOGO_PATH}
                fill="none"
                stroke="var(--color-orange-500)"
                strokeWidth="7"
                strokeDasharray="220 680"
              />
            </g>
            <path
              d="M 35 230 C 120 90, 280 260, 365 110"
              fill="none"
              stroke="var(--color-orange-500)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="200" cy="172" r="9" fill="var(--color-orange-500)" />
          </svg>
        </div>
      )}

      {/* Quiet bottom telemetry caption bar (never obstructing the central 3D model) */}
      <div
        className="absolute bottom-3 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-full text-xs pointer-events-none"
        style={{
          backgroundColor: 'rgba(8, 19, 28, 0.86)',
          border: '1px solid var(--surface-dark-border)',
          color: 'var(--color-beige-200)',
        }}
      >
        <span>
          {mode === 'hero'
            ? 'با حرکت اشاره‌گر یا لمس، زاویه دید و پالس سیگنال را تغییر دهید'
            : `لایه فعال: ${toPersianDigits(activeLayerId.toUpperCase())} · تفکیک سه‌بعدی: ${toPersianDigits(Math.round(explodeFactor * 100))}٪`}
        </span>
        <span className="font-tabular" style={{ color: 'var(--color-orange-400)' }}>
          {signalState === 'moving' && 'وضعیت پالس: در حال حرکت (۸۴ km/h)'}
          {signalState === 'stopped' && 'وضعیت پالس: متوقف در محدوده (حلقه‌زنی زمان درنگ)'}
          {signalState === 'alert' && 'وضعیت پالس: هشدار عملیاتی روی خط زمان'}
          {signalState === 'cold' && 'وضعیت پالس: زنجیره سرد (۴٫۲- درجه سانتی‌گراد)'}
        </span>
      </div>
    </div>
  );
};
