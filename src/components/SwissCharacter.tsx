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
          // Scale and position for far left-side display
          vrm.scene.scale.setScalar(4.5);
          vrm.scene.position.set(-4, -3.5, 0);
          vrm.scene.rotation.y = Math.PI * 0.25; // Angled toward center
          
          // Set up a natural relaxed standing pose
          if (vrm.humanoid) {
            // SHOULDERS - bring them down first
            const leftShoulder = vrm.humanoid.getBoneNode(VRMHumanBoneName.LeftShoulder);
            const rightShoulder = vrm.humanoid.getBoneNode(VRMHumanBoneName.RightShoulder);
            
            if (leftShoulder) {
              leftShoulder.rotation.z = -0.2; // Lower the shoulder
            }
            if (rightShoulder) {
              rightShoulder.rotation.z = 0.2; // Lower the shoulder
            }

            // LEFT ARM - force it down by the side
            const leftUpperArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.LeftUpperArm);
            const leftLowerArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.LeftLowerArm);
            const leftHand = vrm.humanoid.getBoneNode(VRMHumanBoneName.LeftHand);
            
            if (leftUpperArm) {
              leftUpperArm.rotation.x = 0; // No forward/back
              leftUpperArm.rotation.y = 0; // No twist
              leftUpperArm.rotation.z = -1.4; // Rotate down dramatically
            }
            if (leftLowerArm) {
              leftLowerArm.rotation.x = 0;
              leftLowerArm.rotation.y = 0;
              leftLowerArm.rotation.z = 0.3; // Slight bend at elbow
            }
            if (leftHand) {
              leftHand.rotation.x = 0;
              leftHand.rotation.y = 0;
              leftHand.rotation.z = 0;
            }

            // RIGHT ARM - force it down by the side
            const rightUpperArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.RightUpperArm);
            const rightLowerArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.RightLowerArm);
            const rightHand = vrm.humanoid.getBoneNode(VRMHumanBoneName.RightHand);
            
            if (rightUpperArm) {
              rightUpperArm.rotation.x = 0;
              rightUpperArm.rotation.y = 0;
              rightUpperArm.rotation.z = 1.4; // Rotate down dramatically
            }
            if (rightLowerArm) {
              rightLowerArm.rotation.x = 0;
              rightLowerArm.rotation.y = 0;
              rightLowerArm.rotation.z = -0.3; // Slight bend at elbow
            }
            if (rightHand) {
              rightHand.rotation.x = 0;
              rightHand.rotation.y = 0;
              rightHand.rotation.z = 0;
            }

            // Natural head position
            const head = vrm.humanoid.getBoneNode(VRMHumanBoneName.Head);
            if (head) {
              head.rotation.x = 0;
              head.rotation.y = 0.15; // Looking slightly toward content
              head.rotation.z = 0;
            }

            // Relaxed spine
            const spine = vrm.humanoid.getBoneNode(VRMHumanBoneName.Spine);
            if (spine) {
              spine.rotation.x = 0.02; // Slight forward lean
            }

            // Hip positioning for natural stance
            const hips = vrm.humanoid.getBoneNode(VRMHumanBoneName.Hips);
            if (hips) {
              hips.rotation.z = 0;
              hips.rotation.x = 0;
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
      
      // Breathing animation - more pronounced
      const breathingIntensity = Math.sin(time * 1.2) * 0.08;
      groupRef.current.position.y = breathingIntensity;
      
      // Weight shifting from leg to leg (slower cycle)
      const weightShift = Math.sin(time * 0.4) * 0.03;
      groupRef.current.rotation.z = weightShift;
      
      if (vrmRef.current.humanoid) {
        // Natural head movement - looking around occasionally
        const head = vrmRef.current.humanoid.getBoneNode(VRMHumanBoneName.Head);
        if (head) {
          head.rotation.y = 0.15 + Math.sin(time * 0.3) * 0.08; // Looking left/right
          head.rotation.x = Math.sin(time * 0.7) * 0.02; // Slight up/down
        }

        // Subtle arm movements - keeping them down
        const leftUpperArm = vrmRef.current.humanoid.getBoneNode(VRMHumanBoneName.LeftUpperArm);
        const rightUpperArm = vrmRef.current.humanoid.getBoneNode(VRMHumanBoneName.RightUpperArm);
        
        // Left arm - maintain downward position with subtle sway
        if (leftUpperArm) {
          leftUpperArm.rotation.z = -1.4 + Math.sin(time * 0.8) * 0.05; // Keep down, slight sway
          leftUpperArm.rotation.x = Math.sin(time * 0.6) * 0.02;
        }
        
        // Right arm - maintain downward position with subtle movement
        if (rightUpperArm) {
          rightUpperArm.rotation.z = 1.4 + Math.sin(time * 0.7) * 0.05; // Keep down, slight sway
          rightUpperArm.rotation.x = Math.sin(time * 0.9) * 0.02;
        }

        // Spine breathing movement
        const spine = vrmRef.current.humanoid.getBoneNode(VRMHumanBoneName.Spine);
        if (spine) {
          spine.rotation.x = 0.02 + Math.sin(time * 1.2) * 0.005;
        }

        // Hip movement for weight shifting
        const hips = vrmRef.current.humanoid.getBoneNode(VRMHumanBoneName.Hips);
        if (hips) {
          hips.rotation.y = Math.sin(time * 0.4) * 0.02;
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
            camera={{ position: [-5, 1, 8], fov: 50 }}
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
              minDistance={5}
              maxDistance={15}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
              target={[-3, 0.5, 0]}
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