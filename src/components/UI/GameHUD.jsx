import { useGameStore } from '../../game/store';
import Dice from '../Dice/Dice';
import { COLORS } from '../../game/constants';

export default function GameHUD() {
  const {
    phase,
    currentPlayerIndex,
    players,
    diceValue,
    isRolling,
    isAIThinking,
    pieces,
    rollDice,
    startRolling,
    selectPiece,
    movePiece,
    canPieceMove,
    selectedPieceId,
  } = useGameStore();

  const currentPlayer = players[currentPlayerIndex];
  const currentColor = currentPlayer?.color;
  const isAI = currentPlayer?.isAI;

  const handleRollClick = () => {
    // Don't allow manual roll for AI's turn
    if (isAI) return;
    if (phase === 'roll' && !isRolling) {
      startRolling();
      setTimeout(() => {
        rollDice();
      }, 800);
    }
  };

  const handlePieceClick = (pieceId) => {
    // Don't allow manual piece selection for AI's turn
    if (isAI) return;
    if (phase === 'select') {
      selectPiece(pieceId);
    } else if (phase === 'move' && selectedPieceId === pieceId) {
      movePiece(pieceId);
    }
  };

  const playerPieces = pieces.filter((p) => p.color === currentColor);
  const movablePieces = playerPieces.filter((p) => canPieceMove(p.id));

  return (
    <>
      {/* Top bar - Player indicator */}
      <div
        className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center z-10"
        style={{
          background: `linear-gradient(to bottom, ${COLORS[currentColor]}dd, ${COLORS[currentColor]}00)`,
        }}
      >
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-4 border-white shadow-lg"
            style={{ backgroundColor: COLORS[currentColor] }}
          />
          <span className="text-white font-bold text-lg">
            {currentPlayer?.name || `Player ${currentPlayerIndex + 1}`} 的回合
          </span>
          {/* AI Thinking Indicator */}
          {isAIThinking && (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-yellow-300 text-sm font-medium">AI思考中...</span>
            </div>
          )}
          <span className="text-white/80 text-sm">
            {phase === 'roll' && (isAI ? 'AI正在投掷...' : '点击骰子投掷')}
            {phase === 'select' && (isAI ? 'AI正在选择...' : '选择一个棋子移动')}
            {phase === 'move' && (isAI ? 'AI移动中...' : '确认移动位置')}
          </span>
        </div>
      </div>

      {/* Dice area */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <Dice
          value={diceValue}
          isRolling={isRolling}
          onClick={handleRollClick}
          disabled={phase !== 'roll' || isAI}
        />
      </div>

      {/* Player pieces status */}
      <div className="absolute top-20 left-4 bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 z-10">
        <h3 className="text-white font-bold mb-2 text-sm">
          {isAI ? 'AI棋子' : '我的棋子'}
        </h3>
        <div className="flex gap-2">
          {playerPieces.map((piece) => {
            const canMove = canPieceMove(piece.id);
            const isSelected = selectedPieceId === piece.id;
            return (
              <button
                key={piece.id}
                onClick={() => handlePieceClick(piece.id)}
                disabled={phase !== 'select' && phase !== 'move' || isAI}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs transition-all ${
                  !canMove ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
                } ${isSelected ? 'ring-4 ring-white' : ''}`}
                style={{ backgroundColor: COLORS[piece.color] }}
              >
                {piece.isInFinish ? '✓' : piece.position === -1 ? '○' : '●'}
              </button>
            );
          })}
        </div>
        <p className="text-white/60 text-xs mt-2">
          {movablePieces.length} 个可移动
        </p>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-white/80 text-sm text-center z-10">
        {isAI ? (
          phase === 'roll' ? 'AI正在投掷骰子...' :
          phase === 'select' ? `AI投出了 ${diceValue} 点！正在选择...` :
          'AI正在移动...'
        ) : (
          <>
            {phase === 'roll' && '点击骰子投掷 (需投出6点起飞)'}
            {phase === 'select' && `投出了 ${diceValue} 点！选择一个棋子移动`}
            {phase === 'move' && '再次点击确认移动'}
          </>
        )}
      </div>
    </>
  );
}
