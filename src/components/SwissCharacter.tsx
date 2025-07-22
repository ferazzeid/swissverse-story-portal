import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin, VRMHumanBoneName } from '@pixiv/three-vrm';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const SwissVRM = () => {
  const vrmRef = useRef<VRM | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          vrm.scene.rotation.y = -Math.PI * 2/3;
          
          // Simple pose fix without extensive logging
          if (vrm.humanoid) {
            const leftUpperArm = vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftUpperArm);
            const rightUpperArm = vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightUpperArm);
            
            if (leftUpperArm && rightUpperArm) {
              leftUpperArm.rotation.set(0.5, 0, 1.4);
              rightUpperArm.rotation.set(0.5, 0, -1.4);
            }
          }
          
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

  useFrame((state, delta) => {
    if (vrmRef.current && groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Removed intensive periodic pose checking to improve performance
      
      // Force simple animations - ignore mixer completely 
      // 360-degree slow clockwise rotation animation with breathing
      if (vrmRef.current) {
        vrmRef.current.scene.rotation.y = (-Math.PI * 2/3) + (time * 0.2); // Clockwise rotation from 240 degrees
      }
      
      // Breathing/pulsating animation - scale and position
      const breathingIntensity = Math.sin(time * 1.5) * 0.08; // Stronger breathing
      const breathingScale = 1 + Math.sin(time * 1.5) * 0.02; // Subtle scale pulsing
      
      if (groupRef.current) {
        groupRef.current.position.y = breathingIntensity; // Up and down movement
        groupRef.current.scale.setScalar(breathingScale); // Subtle size pulsing
        
        // Weight shifting from leg to leg (slower cycle)
        const weightShift = Math.sin(time * 0.4) * 0.015;
        groupRef.current.rotation.z = weightShift;
      }
      
      // Add some natural head movement without complex animations
      if (vrmRef.current && vrmRef.current.humanoid) {
        const head = vrmRef.current.humanoid.getRawBoneNode(VRMHumanBoneName.Head);
        if (head) {
          head.rotation.y = 0.1 + Math.sin(time * 0.3) * 0.05;
          head.rotation.x = Math.sin(time * 0.7) * 0.015;
        }
      }
      
      // Update VRM (required for animations)
      vrmRef.current.update(delta);
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

export const SwissCharacter = ({ isHero = false }: { isHero?: boolean }) => {
  if (isHero) {
    return (
      <div 
        className="absolute inset-0 z-0 pointer-events-none select-none"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        {/* Position canvas to show avatar on left side - shift the whole canvas left */}
        <div className="absolute -left-32 top-0 w-1/2 h-full pointer-events-auto">
          <Canvas
            camera={{ position: [0, 2, 12], fov: 45 }} // Camera looking straight ahead
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
            <SwissVRM />
            <OrbitControls 
              enablePan={false}
              enableZoom={true}
              minDistance={8}
              maxDistance={16}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 4}
              target={[-4, 0, 0]} // Back to -4 to match avatar position
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
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[2, 2, 2]} 
          intensity={1}
          castShadow
        />
        <SwissVRM />
      </Canvas>
    </div>
  );
};