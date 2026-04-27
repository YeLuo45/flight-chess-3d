import { useGameStore } from '../../game/store';

export default function VictoryScreen() {
  const { winner, players, resetGame } = useGameStore();
  
  const winnerColor = winner?.color;
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-600 to-indigo-800">
      {/* Confetti effect would go here */}
      
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-white mb-4 animate-bounce">
          🎉 胜利！🎉
        </h1>
        <div
          className="text-5xl font-bold text-white mb-2"
          style={{
            textShadow: `0 0 20px ${winnerColor === 'red' ? '#E53935' : winnerColor === 'blue' ? '#1E88E5' : winnerColor === 'yellow' ? '#FDD835' : '#43A047'}`,
          }}
        >
          {winner?.name || `Player ${winner?.id + 1}`}
        </div>
        <p className="text-2xl text-white/80">恭喜获胜！</p>
      </div>
      
      {/* Winner color indicator */}
      <div
        className="w-32 h-32 rounded-full mb-8 shadow-2xl"
        style={{
          backgroundColor: winnerColor === 'red' ? '#E53935' : winnerColor === 'blue' ? '#1E88E5' : winnerColor === 'yellow' ? '#FDD835' : '#43A047',
          boxShadow: `0 0 60px ${winnerColor === 'red' ? '#E53935' : winnerColor === 'blue' ? '#1E88E5' : winnerColor === 'yellow' ? '#FDD835' : '#43A047'}`,
        }}
      />
      
      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            const { startGame } = useGameStore.getState();
            startGame(players.length);
          }}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-bold text-xl py-3 px-8 rounded-full shadow-xl transition-all hover:scale-105"
        >
          再来一局
        </button>
        <button
          onClick={resetGame}
          className="bg-white/20 hover:bg-white/30 text-white font-bold text-xl py-3 px-8 rounded-full shadow-xl transition-all"
        >
          返回主菜单
        </button>
      </div>
    </div>
  );
}
