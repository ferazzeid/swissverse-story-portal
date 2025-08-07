import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin, VRMHumanBoneName } from '@pixiv/three-vrm';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { applyRelaxedPose } from '../lib/vrmPose';

const SwissVRM = ({ paused = false }: { paused?: boolean }) => {
  const vrmRef = useRef<VRM | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // External idle animation retargeting
  const idleSourceRef = useRef<THREE.Object3D | null>(null);
  const idleMixerRef = useRef<THREE.AnimationMixer | null>(null);
  const [idleReady, setIdleReady] = useState(false);


  useEffect(() => {
    // Respect user motion preferences
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const isPaused = paused || prefersReduced;

  useEffect(() => {
    const loadVRMAndAnimation = async () => {
      try {
        setLoading(true);
        setError(null);

        const loader = new GLTFLoader();
        loader.register((parser) => new VRMLoaderPlugin(parser));

        const gltf = await loader.loadAsync(
          'https://raw.githubusercontent.com/ferazzeid/vrm/main/SWISS.vrm'
        );

        const vrm = gltf.userData.vrm as VRM;
        
        if (vrm) {
          vrm.scene.scale.setScalar(5);
          vrm.scene.position.set(-4, -4.5, 0);
          vrm.scene.rotation.y = -Math.PI / 8;

          // Apply a relaxed idle pose (replaces temporary T-pose arm override)
          applyRelaxedPose(vrm);
          
          setVrm(vrm);
          vrmRef.current = vrm;
        }
      } catch (err) {
        setError('Failed to load Swiss character');
      } finally {
        setLoading(false);
      }
    };

    loadVRMAndAnimation();
  }, []);

  // Load and play external idle animation (GLB), then retarget to VRM each frame
  useEffect(() => {
    if (!vrmRef.current || !groupRef.current) return;

    let canceled = false;
    const loader = new GLTFLoader();
    const idleUrl = 'https://raw.githubusercontent.com/ferazzeid/vrm/main/idle.glb';

    loader.load(
      idleUrl,
      (gltf) => {
        if (canceled) return;
        const source = gltf.scene;
        source.visible = false; // keep hidden; we only use its skeleton pose
        idleSourceRef.current = source;
        groupRef.current?.add(source);

        const mixer = new THREE.AnimationMixer(source);
        idleMixerRef.current = mixer;
        const clip = gltf.animations?.[0];
        if (clip) {
          const action = mixer.clipAction(clip);
          action.play();
          setIdleReady(true);
        }
      },
      undefined,
      () => {
        // ignore errors; fallback to static relaxed pose
      }
    );

    return () => {
      canceled = true;
      if (idleMixerRef.current) {
        idleMixerRef.current.stopAllAction();
        // @ts-ignore - uncacheRoot may not be typed
        idleMixerRef.current.uncacheRoot?.(idleSourceRef.current as any);
        idleMixerRef.current = null;
      }
      if (idleSourceRef.current && groupRef.current) {
        groupRef.current.remove(idleSourceRef.current);
        idleSourceRef.current = null;
      }
      setIdleReady(false);
    };
  }, [vrm]);

  useFrame((state, delta) => {
    // Reduced-motion detected or paused: we still keep gentle rotation active

    // Update source mixer if external idle animation is present
    if (idleMixerRef.current) {
      idleMixerRef.current.update(delta);
    }

    const vrm = vrmRef.current;
    const group = groupRef.current;

    if (vrm && group) {
      const time = state.clock.elapsedTime;

      // Slow clockwise rotation from ~240 degrees
      vrm.scene.rotation.y = (-Math.PI / 8) + (time * 0.15);

      // Always apply subtle micro idle baseline
      const breathingIntensity = Math.sin(time * 1.5) * 0.08;
      const breathingScale = 1 + Math.sin(time * 1.5) * 0.02;
      group.position.y = breathingIntensity;
      group.scale.setScalar(breathingScale);

      const weightShift = Math.sin(time * 0.4) * 0.015;
      group.rotation.z = weightShift;

      if (vrm.humanoid) {
        const head = vrm.humanoid.getRawBoneNode(VRMHumanBoneName.Head);
        if (head) {
          head.rotation.y = 0.1 + Math.sin(time * 0.3) * 0.05;
          head.rotation.x = Math.sin(time * 0.7) * 0.015;
        }
      }

      // If external idle animation is present, retarget its pose onto the VRM each frame
      if (idleReady && idleSourceRef.current) {
        (SkeletonUtils as any).retarget(
          vrm.scene as unknown as THREE.Object3D,
          idleSourceRef.current as THREE.Object3D,
          { preservePosition: true }
        );
      }

      vrm.update(delta);
    }
  });

  if (loading) {
    return (
      <group ref={groupRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 2, 0.5]} />
          <meshStandardMaterial color="#6366f1" opacity={0.5} transparent />
        </mesh>
        <mesh position={[0, 1.2, 0.3]}>
          <sphereGeometry args={[0.3]} />
          <meshStandardMaterial color="#6366f1" opacity={0.7} transparent />
        </mesh>
      </group>
    );
  }

  if (error || !vrm) {
    return (
      <group ref={groupRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 2, 0.5]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <primitive object={vrm.scene} />
    </group>
  );
};

export const SwissCharacter = ({ isHero = false, paused = false }: { isHero?: boolean; paused?: boolean }) => {
  if (isHero) {
    return (
      <div 
        className="absolute inset-0 z-0 pointer-events-none select-none"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        {/* Position canvas to show avatar on left side - shift the whole canvas left */}
        <div className="absolute -left-32 top-0 w-1/2 h-full pointer-events-auto">
          <Canvas
            camera={{ position: [0, 2, 12], fov: 45 }}
            frameloop={paused ? 'never' : 'always'}
            dpr={[1, 1.5]}
            gl={{ powerPreference: 'high-performance', antialias: true }}
            style={{ 
              background: 'transparent', 
              width: '100%', 
              height: '100%',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight 
              position={[5, 5, 5]} 
              intensity={1.2}
              castShadow
            />
            <pointLight position={[-3, 3, 3]} intensity={0.6} color="#9333ea" />
            <pointLight position={[3, 2, -2]} intensity={0.4} color="#06b6d4" />
            <SwissVRM paused={paused} />
            <OrbitControls 
              enablePan={false}
              enableZoom={true}
              minDistance={8}
              maxDistance={16}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 4}
              target={[-4, 0, 0]}
            />
          </Canvas>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-48 h-48 z-10">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        frameloop={paused ? 'never' : 'always'}
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'high-performance', antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[2, 2, 2]} 
          intensity={1}
          castShadow
        />
        <SwissVRM paused={paused} />
      </Canvas>
    </div>
  );
};