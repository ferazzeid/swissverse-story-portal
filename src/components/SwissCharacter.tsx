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
          // Scale and position for display - middle size between too big and too small
          vrm.scene.scale.setScalar(5);
          vrm.scene.position.set(-3, -4.5, 0);
          // Slight left turn for better 3D effect (about 30 degrees)
          vrm.scene.rotation.y = Math.PI + Math.PI * 0.17;
          
          console.log('VRM loaded successfully');
          
          // IMMEDIATELY fix T-pose regardless of animation
          console.log('Fixing T-pose immediately...');
          setManualPose(vrm);
          
          console.log('Now attempting animation...');
          
          // Now try different animations - starting with happy
          try {
            const animationLoader = new GLTFLoader();
            console.log('Trying happy.glb animation...');
            const animationGltf = await animationLoader.loadAsync(
              'https://raw.githubusercontent.com/ferazzeid/vrm/main/happy.glb'
            );
            
            console.log('Happy animation GLB loaded:', animationGltf);
            console.log('Happy animation count:', animationGltf.animations?.length || 0);
            console.log('Happy animations:', animationGltf.animations);
            
            if (animationGltf.animations && animationGltf.animations.length > 0) {
              console.log('Creating animation mixer...');
              const mixer = new THREE.AnimationMixer(vrm.scene);
              mixerRef.current = mixer;
              
              // Try to apply happy animation directly
              try {
                console.log('Trying happy animation...');
                const action = mixer.clipAction(animationGltf.animations[0]);
                action.setLoop(THREE.LoopRepeat, Infinity);
                action.clampWhenFinished = false;
                action.weight = 1;
                action.play();
                
                console.log('✅ Happy animation applied successfully!');
                console.log('Happy animation duration:', animationGltf.animations[0].duration);
              } catch (directError) {
                console.log('Happy animation failed, trying look animation...');
                console.log('Happy error:', directError.message);
                
                // Try look animation as fallback
                try {
                  const lookLoader = new GLTFLoader();
                  console.log('Loading look.glb animation...');
                  const lookGltf = await lookLoader.loadAsync(
                    'https://raw.githubusercontent.com/ferazzeid/vrm/main/look.glb'
                  );
                  
                  if (lookGltf.animations && lookGltf.animations.length > 0) {
                    const lookAction = mixer.clipAction(lookGltf.animations[0]);
                    lookAction.setLoop(THREE.LoopRepeat, Infinity);
                    lookAction.clampWhenFinished = false;
                    lookAction.weight = 1;
                    lookAction.play();
                    
                    console.log('✅ Look animation applied successfully!');
                  } else {
                    throw new Error('No animations in look.glb');
                  }
                } catch (lookError) {
                  console.log('Look animation also failed, using manual pose');
                  console.log('Look error:', lookError.message);
                  // Disable mixer since animations failed
                  mixerRef.current = null;
                }
              }
            } else {
              console.warn('❌ No animations found in happy.glb - trying look.glb...');
              
              // Create mixer for backup animation
              const mixer = new THREE.AnimationMixer(vrm.scene);
              mixerRef.current = mixer;
              
              // Try look animation as backup
              try {
                const lookLoader = new GLTFLoader();
                const lookGltf = await lookLoader.loadAsync(
                  'https://raw.githubusercontent.com/ferazzeid/vrm/main/look.glb'
                );
                
                if (lookGltf.animations && lookGltf.animations.length > 0) {
                  const lookAction = mixer.clipAction(lookGltf.animations[0]);
                  lookAction.setLoop(THREE.LoopRepeat, Infinity);
                  lookAction.play();
                  console.log('✅ Look animation loaded as backup!');
                } else {
                  console.warn('No animations in look.glb either');
                  mixerRef.current = null;
                }
              } catch (lookError) {
                console.warn('Look animation backup failed:', lookError);
                mixerRef.current = null;
              }
            }
          } catch (animError) {
            console.error('❌ Failed to load any animations:', animError);
            console.error('Animation error details:', animError.message);
            console.log('Using manual pose only...');
            mixerRef.current = null;
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

    // Helper function for manual pose - GUARANTEED to fix T-pose
    const setManualPose = (vrm: VRM) => {
      console.log('🔧 Setting manual pose to fix T-pose...');
      if (vrm.humanoid) {
        try {
          // Get arm bones using VRM humanoid bone names
          const leftUpperArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.LeftUpperArm);
          const rightUpperArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.RightUpperArm);
          const leftLowerArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.LeftLowerArm);
          const rightLowerArm = vrm.humanoid.getBoneNode(VRMHumanBoneName.RightLowerArm);
          
          if (leftUpperArm) {
            // Natural hanging left arm position
            leftUpperArm.rotation.set(0.2, 0, -0.5);
            console.log('✅ Left upper arm positioned');
          }
          if (rightUpperArm) {
            // Natural hanging right arm position
            rightUpperArm.rotation.set(0.2, 0, 0.5);
            console.log('✅ Right upper arm positioned');
          }
          if (leftLowerArm) {
            // Slight bend in left elbow
            leftLowerArm.rotation.set(0, 0, -0.3);
            console.log('✅ Left lower arm positioned');
          }
          if (rightLowerArm) {
            // Slight bend in right elbow
            rightLowerArm.rotation.set(0, 0, 0.3);
            console.log('✅ Right lower arm positioned');
          }
          
          console.log('✅ T-pose FIXED! Arms should now be in natural position');
        } catch (error) {
          console.error('❌ Error setting manual pose:', error);
        }
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
      } else if ((vrmRef.current as any).customIdleAnimation) {
        // Use custom idle animation if available
        (vrmRef.current as any).customIdleAnimation();
      } else {
        // Fallback to basic manual animations
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