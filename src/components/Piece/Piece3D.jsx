import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { COLORS, getPositionData } from '../../game/constants';

export default function Piece3D({ piece, isSelected, canMove, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const posData = getPositionData(piece.position, piece.color);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = (posData?.y || 0.2) + Math.sin(state.clock.elapsedTime * 2 + piece.id.charCodeAt(0)) * 0.05;
      
      // Selection/hover scale
      const targetScale = isSelected ? 1.2 : hovered && canMove ? 1.1 : 1;
      meshRef.current.scale.lerize({ x: targetScale, y: targetScale, z: targetScale }, 0.1);
    }
  });
  
  if (!posData) return null;
  
  return (
    <group
      position={[posData.x, posData.y || 0.2, posData.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      )}
      
      {/* Piece body */}
      <RoundedBox
        ref={meshRef}
        args={[0.5, 0.4, 0.5]}
        radius={0.15}
        smoothness={4}
        position={[0, 0.2, 0]}
        castShadow
      >
        <meshStandardMaterial
          color={COLORS[piece.color]}
          emissive={COLORS[piece.color]}
          emissiveIntensity={isSelected ? 0.4 : canMove ? 0.2 : 0.1}
          roughness={0.6}
          metalness={0.2}
        />
      </RoundedBox>
      
      {/* Piece top (dome) */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={COLORS[piece.color]}
          emissive={COLORS[piece.color]}
          emissiveIntensity={isSelected ? 0.4 : 0.2}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>
      
      {/* Shield indicator */}
      {piece.hasShield && (
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
      
      {/* Finish indicator */}
      {piece.isInFinish && (
        <mesh position={[0, 0.7, 0]}>
          <torusGeometry args={[0.15, 0.05, 8, 16]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}
