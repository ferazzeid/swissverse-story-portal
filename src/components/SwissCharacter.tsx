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
    console.log('🚀 SwissVRM useEffect started - component is mounting');
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
          // Scale and position - moved much further left to not block heading
          vrm.scene.scale.setScalar(5);
          vrm.scene.position.set(-7, -4.5, 0); // MOVED from -3 to -7 (much further left)
          // Slight left turn for better 3D effect (about 30 degrees)
          vrm.scene.rotation.y = Math.PI + Math.PI * 0.17;
          
          console.log('VRM loaded successfully');
          
          // DEEP ANALYSIS: Let's inspect what we actually have
          console.log('=== VRM DEEP ANALYSIS START ===');
          console.log('VRM scene:', vrm.scene);
          console.log('VRM humanoid:', vrm.humanoid);
          
          if (vrm.humanoid) {
            console.log('Humanoid bones available:');
            Object.values(VRMHumanBoneName).forEach(boneName => {
              const bone = vrm.humanoid?.getRawBoneNode(boneName); // FIXED: Using getRawBoneNode
              if (bone) {
                console.log(`✅ ${boneName}:`, bone.name, 'rotation:', bone.rotation);
              } else {
                console.log(`❌ ${boneName}: NOT FOUND`);
              }
            });
          }
          
          // Let's also check the raw scene structure
          console.log('Raw scene children:', vrm.scene.children);
          vrm.scene.traverse((child) => {
            if (child.type === 'Bone' || child.name.includes('Arm') || child.name.includes('arm')) {
              console.log('Found bone/arm:', child.name, child.type, 'rotation:', child.rotation);
            }
          });
          
          console.log('=== VRM DEEP ANALYSIS END ===');
          
          // IMMEDIATELY fix T-pose regardless of animation
          console.log('🔧 ATTEMPTING T-POSE FIX...');
          const tPoseFixed = setManualPose(vrm);
          console.log('T-pose fix result:', tPoseFixed);
          
          console.log('Now attempting animation...');
          
          // Now try the look animation directly (user requested)
          try {
            const animationLoader = new GLTFLoader();
            console.log('Loading look.glb animation directly...');
            const animationGltf = await animationLoader.loadAsync(
              'https://raw.githubusercontent.com/ferazzeid/vrm/main/look.glb'
            );
            
            console.log('Look animation GLB loaded:', animationGltf);
            console.log('Look animation count:', animationGltf.animations?.length || 0);
            console.log('Look animations:', animationGltf.animations);
            
            if (animationGltf.animations && animationGltf.animations.length > 0) {
              console.log('Creating animation mixer...');
              const mixer = new THREE.AnimationMixer(vrm.scene);
              mixerRef.current = mixer;
              // Try to apply look animation directly
              try {
                console.log('Trying look animation...');
                const action = mixer.clipAction(animationGltf.animations[0]);
                action.setLoop(THREE.LoopRepeat, Infinity);
                action.clampWhenFinished = false;
                action.weight = 1;
                action.play();
                
                console.log('✅ Look animation applied successfully!');
                console.log('Look animation duration:', animationGltf.animations[0].duration);
              } catch (directError) {
                console.log('Look animation failed, using manual pose...');
                console.log('Look error:', directError.message);
                // Disable mixer since animation failed
                mixerRef.current = null;
              }
            } else {
              console.warn('❌ No animations found in look.glb - using manual pose');
              mixerRef.current = null;
            }
          } catch (animError) {
            console.error('❌ Failed to load any animations:', animError);
            console.error('Animation error details:', animError.message);
            console.log('Using manual pose only...');
            mixerRef.current = null;
          }
          
          setVrm(vrm);
          vrmRef.current = vrm;
          
          // FORCE T-pose fix AFTER everything is set up - NEW APPROACH
          console.log('🔧 TRYING VRM POSE OVERRIDE APPROACH...');
          setTimeout(() => {
            // Try completely different approach - override the humanoid pose directly
            if (vrm.humanoid) {
              try {
                // Method 1: Try to set a rest pose
                console.log('Attempting to set VRM rest pose...');
                const humanoid = vrm.humanoid;
                
                // Get the normalized bone nodes (these should respect VRM standards)
                const leftUpperArm = humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftUpperArm);
                const rightUpperArm = humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightUpperArm);
                
                if (leftUpperArm && rightUpperArm) {
                  console.log('Using NORMALIZED bone nodes...');
                  // PUSH EVEN FURTHER: Maximum natural hanging arms
                  leftUpperArm.rotation.set(0.5, 0, 1.4);  // PUSHED to 1.4 - maximum hanging down
                  rightUpperArm.rotation.set(0.5, 0, -1.4); // PUSHED to -1.4 - maximum hanging down
                  console.log('Normalized bones set to maximum natural hanging');
                } else {
                  console.log('Normalized bones not found, trying direct scene manipulation...');
                  
                  // Method 2: Find bones in the scene directly and LOCK them
                  vrm.scene.traverse((child) => {
                    if (child.name.includes('UpperArm') || child.name.includes('upperarm')) {
                      console.log('Found upper arm in scene:', child.name);
                      if (child.name.includes('L_') || child.name.includes('Left')) {
                        child.rotation.set(0.5, 0, 1.4);   // MAXIMUM: Push for perfect hanging arms
                        child.matrixAutoUpdate = false;
                      } else if (child.name.includes('R_') || child.name.includes('Right')) {
                        child.rotation.set(0.5, 0, -1.4);  // MAXIMUM: Push for perfect hanging arms
                        child.matrixAutoUpdate = false;
                      }
                    }
                  });
                }
                
                // Force a complete VRM update
                vrm.update(0.016);
                
              } catch (error) {
                console.error('VRM pose override failed:', error);
              }
            }
          }, 300);
        }
      } catch (err) {
        console.error('Failed to load VRM:', err);
        setError('Failed to load Swiss character');
      } finally {
        setLoading(false);
      }
    };

    // Enhanced manual pose function with detailed analysis
    const setManualPose = (vrm: VRM): boolean => {
      console.log('🔧 === MANUAL POSE SETTING START ===');
      
      if (!vrm.humanoid) {
        console.error('❌ NO HUMANOID FOUND - this is the main problem!');
        return false;
      }
      
      console.log('✅ Humanoid found, proceeding with pose setting...');
      let successCount = 0;
      let totalAttempts = 0;
      
      // Try multiple approaches to set arm positions
      const armBones = [
        { name: VRMHumanBoneName.LeftUpperArm, side: 'left', type: 'upper' },
        { name: VRMHumanBoneName.RightUpperArm, side: 'right', type: 'upper' },
        { name: VRMHumanBoneName.LeftLowerArm, side: 'left', type: 'lower' },
        { name: VRMHumanBoneName.RightLowerArm, side: 'right', type: 'lower' }
      ];
      
      armBones.forEach(({ name, side, type }) => {
        totalAttempts++;
        try {
          const bone = vrm.humanoid!.getRawBoneNode(name); // FIXED: Using getRawBoneNode
          if (bone) {
            console.log(`✅ Found ${side} ${type} arm bone:`, bone.name);
            
            // Store original rotation
            const originalRotation = bone.rotation.clone();
            console.log(`Original ${side} ${type} rotation:`, originalRotation);
            
            // FORCE the rotation change by disabling auto-updates temporarily
            const originalMatrixAutoUpdate = bone.matrixAutoUpdate;
            bone.matrixAutoUpdate = false;
            
            // Apply new rotation based on side and type
            if (type === 'upper') {
              if (side === 'left') {
                bone.rotation.set(0.2, 0, -1.2); // VERY aggressive left arm down
              } else {
                bone.rotation.set(0.2, 0, 1.2); // VERY aggressive right arm down
              }
            } else {
              // Lower arm - add elbow bend
              if (side === 'left') {
                bone.rotation.set(0, 0, -0.8);
              } else {
                bone.rotation.set(0, 0, 0.8);
              }
            }
            
            console.log(`New ${side} ${type} rotation:`, bone.rotation);
            
            // Force matrix update
            bone.updateMatrix();
            bone.updateMatrixWorld(true);
            
            // Re-enable auto-updates
            bone.matrixAutoUpdate = originalMatrixAutoUpdate;
            successCount++;
            
            // Verify the change took effect
            setTimeout(() => {
              console.log(`Verification - ${side} ${type} rotation after 100ms:`, bone.rotation);
            }, 100);
            
          } else {
            console.warn(`❌ ${side} ${type} arm bone NOT FOUND`);
          }
        } catch (error) {
          console.error(`❌ Error setting ${side} ${type} arm:`, error);
        }
      });
      
      // Force VRM update
      vrm.update(0.016); // Simulate one frame update
      
      console.log(`🔧 Manual pose result: ${successCount}/${totalAttempts} bones positioned`);
      console.log('🔧 === MANUAL POSE SETTING END ===');
      
      return successCount > 0;
    };

    loadVRMAndAnimation();
  }, []);

  useFrame((state, delta) => {
    if (vrmRef.current && groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Every 5 seconds, verify the pose is still correct
      if (Math.floor(time) % 5 === 0 && Math.floor(time * 10) % 10 === 0) {
        console.log('🔍 Periodic pose check at', Math.floor(time), 'seconds');
        if (vrmRef.current.humanoid) {
          const leftArm = vrmRef.current.humanoid.getRawBoneNode(VRMHumanBoneName.LeftUpperArm); // FIXED
          const rightArm = vrmRef.current.humanoid.getRawBoneNode(VRMHumanBoneName.RightUpperArm); // FIXED
          if (leftArm) console.log('Left arm rotation:', leftArm.rotation);
          if (rightArm) console.log('Right arm rotation:', rightArm.rotation);
        }
      }
      
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
          const head = vrmRef.current.humanoid.getRawBoneNode(VRMHumanBoneName.Head); // FIXED
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
              target={[-7, 0, 0]} // UPDATED target to match new avatar position (-7)
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