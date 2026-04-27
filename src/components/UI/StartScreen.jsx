import { useState } from 'react';
import { useGameStore } from '../../game/store';

export default function StartScreen() {
  const [mode, setMode] = useState('classic');
  const [playerCount, setPlayerCount] = useState(2);
  const startGame = useGameStore((state) => state.startGame);
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-blue-600">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg mb-4">
          飞行棋大作战
        </h1>
        <p className="text-2xl text-white/80">Flight Chess 3D</p>
      </div>
      
      {/* Mode Selection */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8 w-96">
        <h2 className="text-xl font-bold text-white mb-4 text-center">选择模式</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setMode('classic')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
              mode === 'classic'
                ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105'
                : 'bg-white/30 text-white hover:bg-white/50'
            }`}
          >
            传统模式
            <span className="block text-sm font-normal mt-1">Classic</span>
          </button>
          <button
            onClick={() => setMode('event')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
              mode === 'event'
                ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105'
                : 'bg-white/30 text-white hover:bg-white/50'
            }`}
          >
            事件模式
            <span className="block text-sm font-normal mt-1">Event Mode</span>
          </button>
        </div>
        
        {mode === 'event' && (
          <div className="mt-4 text-white/80 text-sm text-center">
            包含幸运/厄运/传送/交换特殊事件！
          </div>
        )}
      </div>
      
      {/* Player Count */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8 w-96">
        <h2 className="text-xl font-bold text-white mb-4 text-center">玩家数量</h2>
        <div className="flex gap-4 justify-center">
          {[2, 3, 4].map((count) => (
            <button
              key={count}
              onClick={() => setPlayerCount(count)}
              className={`w-16 h-16 rounded-full font-bold text-2xl transition-all ${
                playerCount === count
                  ? 'bg-yellow-400 text-gray-900 shadow-lg scale-110'
                  : 'bg-white/30 text-white hover:bg-white/50'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: playerCount }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: ['#E53935', '#1E88E5', '#FDD835', '#43A047'][i],
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Start Button */}
      <button
        onClick={() => startGame(playerCount)}
        className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-bold text-2xl py-4 px-12 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        开始游戏
      </button>
    </div>
  );
}
