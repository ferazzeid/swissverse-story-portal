import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin, VRMHumanBoneName } from '@pixiv/three-vrm';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const SwissVRM = () => {
  const vrmRef = useRef<VRM | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVRM = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create a GLTF loader with VRM plugin
        const loader = new GLTFLoader();
        loader.register((parser) => new VRMLoaderPlugin(parser));

        // Load the VRM from GitHub raw URL
        const gltf = await loader.loadAsync(
          'https://raw.githubusercontent.com/ferazzeid/vrm/main/SWISS.vrm'
        );

        const vrm = gltf.userData.vrm as VRM;
        
        if (vrm) {
          // Scale the model appropriately for hero display
          vrm.scene.scale.setScalar(2.5);
          vrm.scene.position.set(0, -2, 0);
          vrm.scene.rotation.y = Math.PI * 0.1; // Slight angle to show character better
          
          // Set up initial pose (more natural than T-pose)
          if (vrm.humanoid) {
            // Relax arms slightly
            const leftUpperArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.LeftUpperArm);
            const rightUpperArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.RightUpperArm);
            
            if (leftUpperArm) {
              leftUpperArm.rotation.z = 0.3;
              leftUpperArm.rotation.x = -0.1;
            }
            if (rightUpperArm) {
              rightUpperArm.rotation.z = -0.3;
              rightUpperArm.rotation.x = -0.1;
            }

            // Slight head tilt
            const head = vrm.humanoid.getBoneNode(VRMHumanBoneName.Head);
            if (head) {
              head.rotation.x = -0.1;
            }
          }
          
          setVrm(vrm);
          vrmRef.current = vrm;
          console.log('VRM loaded successfully:', vrm);
        }
      } catch (err) {
        console.error('Failed to load VRM:', err);
        setError('Failed to load Swiss character');
      } finally {
        setLoading(false);
      }
    };

    loadVRM();
  }, []);

  useFrame((state, delta) => {
    if (vrmRef.current && groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Gentle breathing animation
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.02;
      
      // Subtle idle head movement
      if (vrmRef.current.humanoid) {
        const head = vrmRef.current.humanoid.getBoneNode(VRMHumanBoneName.Head);
        if (head) {
          head.rotation.y = Math.sin(time * 0.8) * 0.05;
          head.rotation.x = -0.1 + Math.sin(time * 1.2) * 0.02;
        }

        // Slight arm movement for life
        const leftUpperArm = vrmRef.current.humanoid.getBoneNode(VRMHumanBoneName.LeftUpperArm);
        const rightUpperArm = vrmRef.current.humanoid.getBoneNode(VRMHumanBoneName.RightUpperArm);
        
        if (leftUpperArm) {
          leftUpperArm.rotation.z = 0.3 + Math.sin(time * 0.7) * 0.02;
        }
        if (rightUpperArm) {
          rightUpperArm.rotation.z = -0.3 - Math.sin(time * 0.7) * 0.02;
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
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-80 h-96 z-20">
        <Canvas
          camera={{ position: [0, 0.5, 4], fov: 35 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight 
            position={[2, 3, 2]} 
            intensity={1.2}
            castShadow
          />
          <pointLight position={[-2, 2, 2]} intensity={0.5} color="#9333ea" />
          <SwissVRM />
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 2.5}
            target={[0, 0.5, 0]}
          />
        </Canvas>
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