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
          vrm.scene.scale.setScalar(3.5); // Reduced scale for better view
          vrm.scene.position.set(-5, -3.5, 0); // More to the left
          vrm.scene.rotation.y = Math.PI * 0.25; // Angled toward center
          
          // Set up a natural relaxed standing pose using new API
          if (vrm.humanoid) {
            console.log('Available bones:', vrm.humanoid.humanBones);
            
            // Use getRawBoneNode instead of deprecated getBoneNode
            const leftUpperArm = vrm.humanoid.getRawBoneNode(VRMHumanBoneName.LeftUpperArm);
            const rightUpperArm = vrm.humanoid.getRawBoneNode(VRMHumanBoneName.RightUpperArm);
            const leftShoulder = vrm.humanoid.getRawBoneNode(VRMHumanBoneName.LeftShoulder);
            const rightShoulder = vrm.humanoid.getRawBoneNode(VRMHumanBoneName.RightShoulder);
            
            console.log('Left upper arm bone:', leftUpperArm);
            console.log('Right upper arm bone:', rightUpperArm);
            
            // Drop shoulders first
            if (leftShoulder) {
              leftShoulder.rotation.z = 0.3; // Drop left shoulder
              console.log('Dropped left shoulder');
            }
            
            if (rightShoulder) {
              rightShoulder.rotation.z = -0.3; // Drop right shoulder  
              console.log('Dropped right shoulder');
            }
            
            // Aggressively move arms down from T-pose
            if (leftUpperArm) {
              // Reset first, then apply strong downward rotation
              leftUpperArm.rotation.set(0, 0, 0);
              leftUpperArm.rotation.z = -1.2; // Strong downward rotation (about -69 degrees)
              leftUpperArm.rotation.x = 0.2; // Slight forward
              console.log('Set left arm down aggressively');
            }
            
            if (rightUpperArm) {
              // Reset first, then apply strong downward rotation
              rightUpperArm.rotation.set(0, 0, 0);
              rightUpperArm.rotation.z = 1.2; // Strong downward rotation (about 69 degrees)
              rightUpperArm.rotation.x = 0.2; // Slight forward
              console.log('Set right arm down aggressively');
            }

            // Set lower arms
            const leftLowerArm = vrm.humanoid.getRawBoneNode(VRMHumanBoneName.LeftLowerArm);
            const rightLowerArm = vrm.humanoid.getRawBoneNode(VRMHumanBoneName.RightLowerArm);
            
            if (leftLowerArm) {
              leftLowerArm.rotation.z = 0.4; // Bend elbow slightly
              console.log('Set left lower arm');
            }
            
            if (rightLowerArm) {
              rightLowerArm.rotation.z = -0.4; // Bend elbow slightly
              console.log('Set right lower arm');
            }

            // Set head position
            const head = vrm.humanoid.getRawBoneNode(VRMHumanBoneName.Head);
            if (head) {
              head.rotation.x = 0;
              head.rotation.y = 0.15;
              head.rotation.z = 0;
              console.log('Set head position');
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
        const head = vrmRef.current.humanoid.getRawBoneNode(VRMHumanBoneName.Head);
        if (head) {
          head.rotation.y = 0.15 + Math.sin(time * 0.3) * 0.08; // Looking left/right
          head.rotation.x = Math.sin(time * 0.7) * 0.02; // Slight up/down
        }

        // Maintain arm positions and add subtle movements
        const leftUpperArm = vrmRef.current.humanoid.getRawBoneNode(VRMHumanBoneName.LeftUpperArm);
        const rightUpperArm = vrmRef.current.humanoid.getRawBoneNode(VRMHumanBoneName.RightUpperArm);
        
        // Left arm - maintain downward position with subtle sway
        if (leftUpperArm) {
          const leftBaseDrop = -1.2; // Keep base downward rotation
          const leftSway = Math.sin(time * 0.8) * 0.03; // Smaller sway
          leftUpperArm.rotation.z = leftBaseDrop + leftSway;
          leftUpperArm.rotation.x = 0.2 + Math.sin(time * 0.6) * 0.02;
        }
        
        // Right arm - maintain downward position with subtle movement
        if (rightUpperArm) {
          const rightBaseDrop = 1.2; // Keep base downward rotation
          const rightSway = Math.sin(time * 0.7) * 0.03; // Smaller sway
          rightUpperArm.rotation.z = rightBaseDrop + rightSway;
          rightUpperArm.rotation.x = 0.2 + Math.sin(time * 0.5) * 0.02;
        }

        // Spine breathing movement
        const spine = vrmRef.current.humanoid.getRawBoneNode(VRMHumanBoneName.Spine);
        if (spine) {
          spine.rotation.x = 0.02 + Math.sin(time * 1.2) * 0.005;
        }

        // Hip movement for weight shifting
        const hips = vrmRef.current.humanoid.getRawBoneNode(VRMHumanBoneName.Hips);
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
            camera={{ position: [-5, 2, 15], fov: 45 }} // Much further back
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
              minDistance={12} // Increased minimum distance
              maxDistance={20} // Increased maximum distance  
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 4}
              target={[-4, 0, 0]} // Adjusted target for left positioning
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