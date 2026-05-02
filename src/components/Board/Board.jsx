import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { COLORS, MAIN_TRACK, RUNWAYS, getEventType, EVENT_TYPES } from '../../game/constants';

// Rainbow colors for main track - bright vibrant colors
const TRACK_COLORS = [
  '#E53935', '#D32F2F', '#C62828', '#B71C1C', '#C62828', '#D32F2F', '#E53935', '#C62828', // Red
  '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#1565C0', '#1976D2', '#1E88E5', '#1565C0', // Blue
  '#FDD835', '#FBC02D', '#F9A825', '#F57F17', '#F9A825', '#FBC02D', '#FDD835', '#F9A825', // Yellow
  '#43A047', '#388E3C', '#2E7D32', '#1B5E20', '#2E7D32', '#388E3C', '#43A047', '#388E3C', // Green
  '#E91E63', '#C2185B', '#AD1457', '#880E4F', '#AD1457', '#C2185B', '#E91E63', '#C2185B', // Pink
  '#9C27B0', '#7B1FA2', '#6A1B9A', '#4A148C', '#6A1B9A', '#7B1FA2', '#9C27B0', '#7B1FA2', // Purple
  '#00BCD4', '#0097A7', '#00838F', '#006064', '#00838F', '#0097A7', '#00BCD4', '#0097A7', // Cyan
];

function Square({ position, color, isEvent, eventType, index }) {
  const meshRef = useRef();
  const isLucky = eventType === EVENT_TYPES.LUCKY;
  const isCurse = eventType === EVENT_TYPES.CURSE;
  const isTeleport = eventType === EVENT_TYPES.TELEPORT;
  const isSwap = eventType === EVENT_TYPES.SWAP;
  
  useFrame((state) => {
    if (meshRef.current && isEvent) {
      // Pulsing glow for event squares
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7;
      meshRef.current.material.emissiveIntensity = pulse;
    }
  });
  
  // Use rainbow color for main track, fall back to color's own color for runway/safe zones
  const baseColor = (index !== undefined && position.segment === 'arm') 
    ? TRACK_COLORS[index % TRACK_COLORS.length] 
    : (color ? COLORS[color] : '#ffffff');
  
  return (
    <group position={[position.x, 0, position.z]}>
      {/* Square base */}
      <RoundedBox
        ref={meshRef}
        args={[0.8, 0.15, 0.8]}
        radius={0.1}
        smoothness={4}
        position={[0, 0.075, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={isEvent ? 1.2 : 0.8}
          roughness={0.4}
          metalness={0.2}
        />
      </RoundedBox>
      
      {/* Event icon */}
      {isEvent && (
        <group position={[0, 0.5, 0]}>
          {isLucky && (
            <mesh>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
            </mesh>
          )}
          {isCurse && (
            <mesh>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
            </mesh>
          )}
          {isTeleport && (
            <mesh rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[0.15, 0.3, 4]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
            </mesh>
          )}
          {isSwap && (
            <mesh>
              <torusGeometry args={[0.12, 0.04, 8, 16]} />
              <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
}

function RunwaySquare({ position, color, index }) {
  return (
    <group position={[position.x, position.y, position.z]}>
      <RoundedBox
        args={[0.7, 0.12, 0.7]}
        radius={0.08}
        smoothness={4}
        position={[0, 0.06, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={COLORS[color]}
          emissive={COLORS[color]}
          emissiveIntensity={0.1}
          roughness={0.8}
          metalness={0.2}
        />
      </RoundedBox>
    </group>
  );
}

export default function Board() {
  return (
    <group>
      {/* Main track squares */}
      {MAIN_TRACK.map((pos, index) => {
        const eventType = getEventType(index);
        return (
          <Square
            key={`main-${index}`}
            position={pos}
            color={pos.color}
            isEvent={!!eventType}
            eventType={eventType}
            index={index}
          />
        );
      })}
      
      {/* Runway squares */}
      {Object.entries(RUNWAYS).map(([color, squares]) =>
        squares.map((pos, index) => (
          <RunwaySquare
            key={`${color}-runway-${index}`}
            position={pos}
            color={color}
            index={index}
          />
        ))
      )}
      
      {/* Center finish zone - bright orange/gold like reference */}
      <group position={[0, 0.05, 0]}>
        <RoundedBox
          args={[3, 0.2, 3]}
          radius={0.3}
          smoothness={4}
          position={[0, 0.1, 0]}
          receiveShadow
        >
          <meshStandardMaterial
            color="#FF8F00"
            emissive="#FF8F00"
            emissiveIntensity={0.3}
            roughness={0.5}
            metalness={0.3}
          />
        </RoundedBox>
        
        {/* Trophy icon in center - golden yellow */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 0.6, 8]} />
          <meshStandardMaterial
            color="#FFC107"
            emissive="#FFC107"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
      
      {/* Base platform - white/cream */}
      <RoundedBox
        args={[18, 0.3, 18]}
        radius={1}
        smoothness={4}
        position={[0, -0.15, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#F5F0E6" roughness={0.9} metalness={0.1} />
      </RoundedBox>
      
      {/* Start area markers */}
      {['red', 'yellow', 'blue', 'green'].map((color, i) => {
        const positions = [
          [-7, 0.1, -7],
          [7, 0.1, -7],
          [7, 0.1, 7],
          [-7, 0.1, 7],
        ];
        return (
          <group key={color} position={positions[i]}>
            <RoundedBox
              args={[1.5, 0.1, 1.5]}
              radius={0.2}
              smoothness={4}
              position={[0, 0.05, 0]}
              receiveShadow
            >
              <meshStandardMaterial
                color={COLORS[color]}
                emissive={COLORS[color]}
                emissiveIntensity={0.15}
                roughness={0.7}
              />
            </RoundedBox>
          </group>
        );
      })}
    </group>
  );
}
