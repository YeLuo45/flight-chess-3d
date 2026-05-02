import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { COLORS, MAIN_TRACK, RUNWAYS, getEventType, EVENT_TYPES } from '../../game/constants';

// Rainbow colors for main track - each position gets a different vibrant color
const TRACK_COLORS = [
  '#FF6B6B', '#FF8E53', '#FFA502', '#FFD93D', // red-orange-yellow
  '#6BCB77', '#4ECDC4', '#45B7D1', '#5C7AEA', // green-cyan-blue-indigo
  '#9B59B6', '#E91E63', '#FF5722', '#795548', // purple-pink-brown
  '#F44336', '#FF9800', '#FFEB3B', '#8BC34A', // red-orange-yellow-green
  '#03A9F4', '#00BCD4', '#009688', '#00695C', // blue-cyan-teal
  '#7E57C2', '#AB47BC', '#EC407A', '#EF5350', // purple-pink-red
  '#FF7043', '#FFCA28', '#66BB6A', '#26A69A', // orange-yellow-green-teal
  '#5C6BC0', '#7E57C2', '#AB47BC', '#8D6E63', // indigo-purple-brown
  '#78909C', '#90A4AE', '#B0BEC5', '#CFD8DC', // gray shades
  '#FF1744', '#FF5252', '#FF7575', '#FFAB91', '#FFCCBC', // red shades
  '#18FFFF', '#84FFFF', '#A7FFEB', '#B9F6CA', // cyan-green shades
  '#FFE082', '#FFD54F', '#FFCA28', '#FFC107', // amber-yellow shades
  '#CE93D8', '#BA68C8', '#AB47BC', '#8E24AA', // purple shades
  '#80DEEA', '#4DD0E1', '#26C6DA', '#00ACC1', // light-blue shades
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
          emissiveIntensity={isEvent ? 0.6 : 0.3}
          roughness={0.6}
          metalness={0.1}
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
      
      {/* Center finish zone - golden rainbow */}
      <group position={[0, 0.05, 0]}>
        <RoundedBox
          args={[3, 0.2, 3]}
          radius={0.3}
          smoothness={4}
          position={[0, 0.1, 0]}
          receiveShadow
        >
          <meshStandardMaterial
            color="#FF6B6B"
            emissive="#FF6B6B"
            emissiveIntensity={0.4}
            roughness={0.5}
            metalness={0.3}
          />
        </RoundedBox>
        
        {/* Trophy icon in center - colorful */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 0.6, 8]} />
          <meshStandardMaterial
            color="#00FFFF"
            emissive="#00FFFF"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
      
      {/* Base platform - purple gradient */}
      <RoundedBox
        args={[18, 0.3, 18]}
        radius={1}
        smoothness={4}
        position={[0, -0.15, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#2d1b4e" roughness={0.9} metalness={0.1} />
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
