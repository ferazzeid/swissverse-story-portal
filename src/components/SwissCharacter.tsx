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

        // Create a GLTF loader with VRM plugin
        const loader = new GLTFLoader();
        loader.register((parser) => new VRMLoaderPlugin(parser));

        // Load the VRM from GitHub raw URL
        console.log('Starting VRM load...');
        const gltf = await loader.loadAsync(
          'https://raw.githubusercontent.com/ferazzeid/vrm/main/SWISS.vrm'
        );

        const vrm = gltf.userData.vrm as VRM;
        
        if (vrm) {
          // Scale and position for far left-side display - much bigger for interaction
          vrm.scene.scale.setScalar(6);
          vrm.scene.position.set(-3, -4, 0);
          vrm.scene.rotation.y = Math.PI * 0.15;
          
          console.log('VRM loaded successfully, now loading animation...');
          
          // Now load the idle animation
          try {
            const animationLoader = new GLTFLoader();
            console.log('Loading idle.glb animation...');
            const animationGltf = await animationLoader.loadAsync(
              'https://raw.githubusercontent.com/ferazzeid/vrm/main/idle.glb'
            );
            
            console.log('Animation GLB loaded:', animationGltf);
            console.log('Animation count:', animationGltf.animations?.length || 0);
            console.log('Animations:', animationGltf.animations);
            
            if (animationGltf.animations && animationGltf.animations.length > 0) {
              // Create animation mixer
              console.log('Creating animation mixer...');
              const mixer = new THREE.AnimationMixer(vrm.scene);
              mixerRef.current = mixer;
              
              // Apply the first animation (idle)
              console.log('Creating and playing animation action...');
              const action = mixer.clipAction(animationGltf.animations[0]);
              action.setLoop(THREE.LoopRepeat, Infinity);
              action.clampWhenFinished = false;
              action.play();
              
              console.log('✅ Idle animation applied and playing successfully!');
              console.log('Animation duration:', animationGltf.animations[0].duration);
              console.log('Animation name:', animationGltf.animations[0].name);
            } else {
              console.warn('❌ No animations found in idle.glb - using manual pose');
              setManualPose(vrm);
            }
          } catch (animError) {
            console.error('❌ Failed to load idle animation:', animError);
            console.error('Animation error details:', animError.message);
            // Fallback to manual pose if animation fails
            console.log('Falling back to manual pose...');
            setManualPose(vrm);
          }
          
          setVrm(vrm);
          vrmRef.current = vrm;
        }
      } catch (err) {
        console.error('Failed to load VRM:', err);
        setError('Failed to load Swiss character');
      } finally {
        setLoading(false);
      }
    };

    // Helper function for manual pose fallback
    const setManualPose = (vrm: VRM) => {
      console.log('🔧 Setting manual pose as fallback...');
      if (vrm.humanoid) {
        const leftUpperArm = vrm.humanoid.getRawBoneNode(VRMHumanBoneName.LeftUpperArm);
        const rightUpperArm = vrm.humanoid.getRawBoneNode(VRMHumanBoneName.RightUpperArm);
        
        if (leftUpperArm) {
          leftUpperArm.rotation.set(0, 0, -1.2);
          console.log('Manual left arm set');
        }
        if (rightUpperArm) {
          rightUpperArm.rotation.set(0, 0, 1.2);
          console.log('Manual right arm set');
        }
        console.log('✅ Manual pose applied');
      } else {
        console.warn('❌ No humanoid found for manual pose');
      }
    };

    loadVRMAndAnimation();
  }, []);

  useFrame((state, delta) => {
    if (vrmRef.current && groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Update animation mixer if it exists
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      } else {
        // Fallback to manual animations if no GLB animation is loaded
        // Breathing animation - more pronounced
        const breathingIntensity = Math.sin(time * 1.2) * 0.05;
        groupRef.current.position.y = breathingIntensity;
        
        // Weight shifting from leg to leg (slower cycle)
        const weightShift = Math.sin(time * 0.4) * 0.02;
        groupRef.current.rotation.z = weightShift;
        
        if (vrmRef.current.humanoid) {
          // Natural head movement - looking around occasionally
          const head = vrmRef.current.humanoid.getRawBoneNode(VRMHumanBoneName.Head);
          if (head) {
            head.rotation.y = 0.15 + Math.sin(time * 0.3) * 0.05;
            head.rotation.x = Math.sin(time * 0.7) * 0.01;
          }
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