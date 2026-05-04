import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { COLORS } from '../../game/constants';
import { getSkin } from '../../game/skins';
import { getMapVariant, getPositionDataForVariant } from '../../game/mapVariants';
import { useGameStore } from '../../game/store';
import * as THREE from 'three';

export default function Piece3D({ piece, isSelected, canMove, onClick, skin: skinProp }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const targetScaleRef = useRef(new THREE.Vector3(1, 1, 1));

  const skinId = useGameStore((state) => state.skin);
  const mapVariantId = useGameStore((state) => state.mapVariant);
  
  const skin = skinProp || getSkin(skinId);
  const mapVariant = getMapVariant(mapVariantId);
  
  const posData = getPositionDataForVariant(piece.position, piece.color, mapVariant);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation (only if skin allows)
      if (skin.effects.pieceFloat) {
        meshRef.current.position.y = (posData?.y || 0.2) + Math.sin(state.clock.elapsedTime * 2 + piece.id.charCodeAt(0)) * 0.05;
      } else {
        meshRef.current.position.y = posData?.y || 0.2;
      }

      // Selection/hover scale with smooth lerp
      const targetScale = isSelected ? 1.2 : hovered && canMove ? 1.1 : 1;
      targetScaleRef.current.setScalar(targetScale);
      meshRef.current.scale.lerp(targetScaleRef.current, 0.1);
    }
  });

  if (!posData) return null;

  const emissiveIntensity = isSelected 
    ? skin.piece.selectedEmissive 
    : canMove 
      ? skin.piece.canMoveEmissive 
      : skin.piece.emissiveIntensity;

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
          emissiveIntensity={emissiveIntensity}
          roughness={skin.piece.roughness}
          metalness={skin.piece.metalness}
        />
      </RoundedBox>

      {/* Piece top (dome) */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={COLORS[piece.color]}
          emissive={COLORS[piece.color]}
          emissiveIntensity={emissiveIntensity}
          roughness={skin.piece.roughness}
          metalness={skin.piece.metalness}
        />
      </mesh>

      {/* Shield indicator */}
      {piece.hasShield && (
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            color={skin.effects.shieldColor}
            emissive={skin.effects.shieldColor}
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
            color={skin.board.trophy}
            emissive={skin.board.trophy}
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}
