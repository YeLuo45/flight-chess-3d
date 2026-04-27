import { useRef, useState, useEffect } from 'react';

const DICE_FACES = {
  1: [3],
  2: [0, 6],
  3: [0, 3, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 3, 5, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export default function Dice({ value, isRolling, onClick, disabled }) {
  const [displayValue, setDisplayValue] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const animationRef = useRef();
  
  useEffect(() => {
    if (isRolling) {
      // Random animation
      let startTime = null;
      const duration = 800;
      
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = elapsed / duration;
        
        if (progress < 1) {
          // Fast random rotation during roll
          setRotation({
            x: rotation.x + (Math.random() - 0.5) * 2,
            y: rotation.y + (Math.random() - 0.5) * 2,
          });
          setDisplayValue(Math.floor(Math.random() * 6) + 1);
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Settle on final value
          setDisplayValue(value || 1);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else if (value) {
      setDisplayValue(value);
      // Settle to correct face
      const faceRotations = {
        1: { x: 0, y: 0 },
        2: { x: 0, y: Math.PI / 2 },
        3: { x: -Math.PI / 2, y: 0 },
        4: { x: Math.PI / 2, y: 0 },
        5: { x: 0, y: 0 },
        6: { x: 0, y: Math.PI },
      };
      setRotation(faceRotations[value] || { x: 0, y: 0 });
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRolling, value]);
  
  const renderDots = (face) => {
    const positions = DICE_FACES[face] || [];
    const dots = [];
    
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const hasDot = positions.includes(i);
      dots.push(
        <div
          key={i}
          className={`absolute w-3 h-3 rounded-full ${hasDot ? 'bg-gray-900' : ''}`}
          style={{
            top: `${20 + row * 30}%`,
            left: `${20 + col * 30}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      );
    }
    
    return dots;
  };
  
  const getFaceClass = (face) => {
    const colors = {
      1: 'from-white to-gray-100',
      2: 'from-red-400 to-red-500',
      3: 'from-green-400 to-green-500',
      4: 'from-blue-400 to-blue-500',
      5: 'from-yellow-400 to-yellow-500',
      6: 'from-purple-400 to-purple-500',
    };
    return colors[face] || 'from-white to-gray-200';
  };
  
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`relative w-20 h-20 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ perspective: '200px' }}
    >
      {/* Dice cube effect with CSS 3D */}
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}rad) rotateY(${rotation.y}rad)`,
          transition: isRolling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {/* Front face (value depends on rotation) */}
        <div
          className={`absolute w-20 h-20 rounded-xl shadow-lg bg-gradient-to-br ${getFaceClass(displayValue)} flex items-center justify-center`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'translateZ(10px)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)',
          }}
        >
          <div className="relative w-12 h-12">
            {renderDots(displayValue)}
          </div>
        </div>
        
        {/* Top face */}
        <div
          className="absolute w-20 h-20 rounded-xl bg-gradient-to-b from-gray-200 to-gray-300"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateX(90deg) translateZ(10px)',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5)',
          }}
        />
        
        {/* Right face */}
        <div
          className="absolute w-20 h-20 rounded-xl bg-gradient-to-r from-gray-300 to-gray-400"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(90deg) translateZ(10px)',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)',
          }}
        />
      </div>
      
      {/* Rolling animation overlay */}
      {isRolling && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl animate-pulse">🎲</div>
        </div>
      )}
    </div>
  );
}
