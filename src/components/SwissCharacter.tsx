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
          // Scale and position for left-side background display
          vrm.scene.scale.setScalar(4);
          vrm.scene.position.set(-2.5, -3, 0);
          vrm.scene.rotation.y = Math.PI * 0.2; // Angled toward center
          
          // Set up a confident, welcoming pose
          if (vrm.humanoid) {
            // Left arm - hand on hip pose
            const leftUpperArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.LeftUpperArm);
            const leftLowerArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.LeftLowerArm);
            
            if (leftUpperArm) {
              leftUpperArm.rotation.z = 0.8;
              leftUpperArm.rotation.x = -0.3;
              leftUpperArm.rotation.y = 0.2;
            }
            if (leftLowerArm) {
              leftLowerArm.rotation.z = -0.6;
            }

            // Right arm - pointing or welcoming gesture
            const rightUpperArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.RightUpperArm);
            const rightLowerArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.RightLowerArm);
            
            if (rightUpperArm) {
              rightUpperArm.rotation.z = -0.5;
              rightUpperArm.rotation.x = -0.2;
              rightUpperArm.rotation.y = 0.3;
            }
            if (rightLowerArm) {
              rightLowerArm.rotation.z = 0.4;
            }

            // Confident head position looking toward content
            const head = vrm.humanoid.getBoneNode(VRMHumanBoneName.Head);
            if (head) {
              head.rotation.x = -0.05;
              head.rotation.y = 0.2;
            }

            // Slight hip tilt for dynamic pose
            const hips = vrm.humanoid.getBoneNode(VRMHumanBoneName.Hips);
            if (hips) {
              hips.rotation.z = 0.05;
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
      <div 
        className="absolute inset-0 z-0 pointer-events-none select-none"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        <div className="absolute left-0 top-0 w-full h-full pointer-events-auto">
          <Canvas
            camera={{ position: [-3, 1, 7], fov: 45 }}
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
              minDistance={4}
              maxDistance={12}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
              target={[-1, 0.5, 0]}
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