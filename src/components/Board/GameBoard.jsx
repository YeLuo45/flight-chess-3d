import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore } from '../../game/store';
import { getSkin } from '../../game/skins';
import { getMapVariant } from '../../game/mapVariants';
import Board from './Board';
import Piece3D from '../Piece/Piece3D';

export default function GameBoard() {
  const { pieces, selectedPieceId, phase, selectPiece, movePiece, canPieceMove, skin: skinId, mapVariant: mapVariantId } = useGameStore();
  
  const skin = getSkin(skinId);
  const mapVariant = getMapVariant(mapVariantId);
  
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
      camera={{ position: mapVariant.cameraPosition, fov: 55 }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Background and fog based on skin */}
      <color attach="background" args={[skin.background]} />
      <fog attach="fog" args={[skin.fog, 30, 60]} />
      
      {/* Lighting based on skin */}
      <ambientLight intensity={0.8} color={skin.ambientLight} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        color={skin.directionalLight}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} color={skin.directionalLight} />
      
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
          skin={skin}
        />
      ))}
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={12}
        maxDistance={30}
        target={mapVariant.cameraTarget}
      />
    </Canvas>
  );
}
