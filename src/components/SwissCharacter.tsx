import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin } from '@pixiv/three-vrm';
import * as THREE from 'three';

const SwissVRM = () => {
  const vrmRef = useRef<VRM | null>(null);
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVRM = async () => {
      try {
        setLoading(true);
        setError(null);

        // For now, let's create a placeholder since Google Drive has CORS issues
        // We'll need to either:
        // 1. Host the VRM on a CORS-friendly server
        // 2. Use a proxy service
        // 3. Convert to a different format
        
        console.log('VRM loading attempted - Google Drive CORS blocked');
        setError('Google Drive CORS blocked - need alternative hosting');
        
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
    if (vrmRef.current) {
      // Simple idle animation - gentle breathing
      const time = state.clock.elapsedTime;
      vrmRef.current.scene.position.y = -1 + Math.sin(time * 2) * 0.02;
      
      // Update VRM (required for animations)
      vrmRef.current.update(delta);
    }
  });

  if (loading) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 1, 0.2]} />
        <meshStandardMaterial color="#6366f1" opacity={0.5} transparent />
      </mesh>
    );
  }

  if (error || !vrm) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 1, 0.2]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    );
  }

  return <primitive object={vrm.scene} />;
};

export const SwissCharacter = () => {
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