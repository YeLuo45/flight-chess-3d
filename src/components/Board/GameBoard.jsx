import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore } from '../../game/store';
import Board from './Board';
import Piece3D from '../Piece/Piece3D';

export default function GameBoard() {
  const { pieces, selectedPieceId, phase, selectPiece, movePiece, canPieceMove } = useGameStore();
  
  const handlePieceClick = (pieceId) => {
    if (phase === 'select' || phase === 'move') {
      if (canPieceMove(pieceId)) {
        selectPiece(pieceId);
        if (phase === 'move' && selectedPieceId === pieceId) {
          movePiece(pieceId);
        }
      }
    }
  };
  
  return (
    <Canvas
      shadows
      camera={{ position: [18, 18, 18], fov: 55 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#1a1a2e']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.8} color="#FFFFFF" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffffff" />
      
      {/* Board */}
      <Board />
      
      {/* Pieces */}
      {pieces.map((piece) => (
        <Piece3D
          key={piece.id}
          piece={piece}
          isSelected={selectedPieceId === piece.id}
          canMove={canPieceMove(piece.id)}
          onClick={() => handlePieceClick(piece.id)}
        />
      ))}
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={12}
        maxDistance={30}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
