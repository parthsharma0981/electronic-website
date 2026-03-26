import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

interface ProductCardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  delay: number;
  targetPosition: [number, number, number];
}

// A placeholder 3D Product (resembling a glass card or a sleek object)
function ProductCard({ position, rotation, delay, targetPosition }: ProductCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetVec = new THREE.Vector3(...targetPosition);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Time based animation sequence
    const t = state.clock.getElapsedTime();
    
    // Start appearing after slight delay
    if (t > delay) {
      // Easing towards the target position
      meshRef.current.position.lerp(targetVec, 0.05);
      
      // Floating animation
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.position.y += Math.sin(t * 2) * 0.002; 
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[1.5, 2.5, 0.1]} />
      <meshStandardMaterial 
        color="#ffffff"
        metalness={0.5}
        roughness={0.4}
      />
    </mesh>
  );
}

function MainEntity({ introFinished }: { introFinished: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const targetCameraPos = new THREE.Vector3(0, 1, 8);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    
    // Camera cinematic movement
    if (!introFinished) {
      // Zoom and pan out slowly using lerp
      camera.position.lerp(targetCameraPos, 0.03);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x = Math.sin(t) * 0.1;
      meshRef.current.position.y = Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[2, 3, 0.2]} />
      <meshStandardMaterial 
        color="#111111"
        metalness={0.5}
        roughness={0.4}
      />
    </mesh>
  );
}

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [introFinished, setIntroFinished] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroFinished(true);
      onComplete();
    }, 4000); // 4 seconds intro
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundColor: '#000' }}>
      <Canvas shadows camera={{ position: [0, 0, 3], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        
        {/* Deep, dramatic lighting */}
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[5, 5, 5]} 
          angle={0.15} 
          penumbra={1} 
          intensity={50} 
          castShadow 
          shadow-bias={-0.0001}
        />
        <spotLight position={[-5, 5, -5]} intensity={20} color="#4f46e5" />
        
        <MainEntity introFinished={introFinished} />
        
        {/* Other assembling products */}
        <ProductCard 
          position={[-5, 2, -2]} 
          targetPosition={[-2.5, 0, -1]} 
          delay={1.5} 
          rotation={[0.2, 0.5, -0.1]} 
        />
        <ProductCard 
          position={[5, -2, -2]} 
          targetPosition={[2.5, 0, -1]} 
          delay={1.8} 
          rotation={[-0.2, -0.5, 0.1]} 
        />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
