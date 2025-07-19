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
          
          // Set up a natural relaxed standing pose - try a different approach
          if (vrm.humanoid) {
            console.log('Available bones:', vrm.humanoid.humanBones);
            
            // Try to access bones differently and log what we find
            const leftUpperArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.LeftUpperArm);
            const rightUpperArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.RightUpperArm);
            
            console.log('Left upper arm bone:', leftUpperArm);
            console.log('Right upper arm bone:', rightUpperArm);
            
            // Force T-pose override using different method
            if (leftUpperArm) {
              // Try using quaternion instead of euler angles
              const leftQuaternion = new THREE.Quaternion();
              leftQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI/3); // -60 degrees
              leftUpperArm.quaternion.copy(leftQuaternion);
              console.log('Set left arm quaternion');
            }
            
            if (rightUpperArm) {
              const rightQuaternion = new THREE.Quaternion();
              rightQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI/3); // 60 degrees  
              rightUpperArm.quaternion.copy(rightQuaternion);
              console.log('Set right arm quaternion');
            }

            // Try lower arms too
            const leftLowerArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.LeftLowerArm);
            const rightLowerArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.RightLowerArm);
            
            if (leftLowerArm) {
              const leftLowerQ = new THREE.Quaternion();
              leftLowerQ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.3);
              leftLowerArm.quaternion.copy(leftLowerQ);
            }
            
            if (rightLowerArm) {
              const rightLowerQ = new THREE.Quaternion();
              rightLowerQ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.3);
              rightLowerArm.quaternion.copy(rightLowerQ);
            }

            // Set head position
            const head = vrm.humanoid.getBoneNode(VRMHumanBoneName.Head);
            if (head) {
              head.rotation.x = 0;
              head.rotation.y = 0.15;
              head.rotation.z = 0;
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

        // Subtle arm movements - keeping them down using quaternions
        const leftUpperArm = vrmRef.current.humanoid.getBoneNode(VRMHumanBoneName.LeftUpperArm);
        const rightUpperArm = vrmRef.current.humanoid.getBoneNode(VRMHumanBoneName.RightUpperArm);
        
        // Left arm - maintain downward position with subtle sway
        if (leftUpperArm) {
          const leftBaseAngle = -Math.PI/3; // -60 degrees base
          const leftSway = Math.sin(time * 0.8) * 0.05;
          const leftQ = new THREE.Quaternion();
          leftQ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), leftBaseAngle + leftSway);
          leftUpperArm.quaternion.copy(leftQ);
        }
        
        // Right arm - maintain downward position with subtle movement
        if (rightUpperArm) {
          const rightBaseAngle = Math.PI/3; // 60 degrees base
          const rightSway = Math.sin(time * 0.7) * 0.05;
          const rightQ = new THREE.Quaternion();
          rightQ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rightBaseAngle + rightSway);
          rightUpperArm.quaternion.copy(rightQ);
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
            camera={{ position: [-5, 2, 10], fov: 40 }}
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
              maxDistance={12}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 4}
              target={[-3, 1, 0]}
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