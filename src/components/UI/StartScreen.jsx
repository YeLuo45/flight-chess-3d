import { useState } from 'react';
import { useGameStore } from '../../game/store';
import { PLAYER_COLORS } from '../../game/constants';

const PLAYER_COLORS_LIST = ['#E53935', '#1E88E5', '#FDD835', '#43A047'];
const PLAYER_NAMES = ['红方', '蓝方', '黄方', '绿方'];
const DIFFICULTIES = [
  { value: 'easy', label: '简单', color: 'bg-green-400 text-gray-900' },
  { value: 'medium', label: '中等', color: 'bg-yellow-400 text-gray-900' },
  { value: 'hard', label: '困难', color: 'bg-red-500 text-white' },
];

export default function StartScreen() {
  const [mode, setMode] = useState('classic');
  const [playerCount, setPlayerCount] = useState(2);
  // Each player: { isAI: bool, aiDifficulty: 'easy'|'medium'|'hard' }
  const [playerConfigs, setPlayerConfigs] = useState(() => {
    const defaultConfigs = [];
    for (let i = 0; i < 4; i++) {
      defaultConfigs.push({
        isAI: i > 0, // First player human, others AI
        aiDifficulty: 'medium',
      });
    }
    return defaultConfigs;
  });
  const startGame = useGameStore((state) => state.startGame);

  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
    // Default: first player is human, rest are AI
    const newConfigs = [];
    for (let i = 0; i < count; i++) {
      newConfigs.push({
        isAI: i > 0,
        aiDifficulty: 'medium',
      });
    }
    setPlayerConfigs(newConfigs);
  };

  const toggleAI = (index) => {
    const newConfigs = [...playerConfigs];
    newConfigs[index] = { ...newConfigs[index], isAI: !newConfigs[index].isAI };

    // Ensure at least one human player
    const humanCount = newConfigs.filter(c => !c.isAI).length;
    if (humanCount < 1 && !newConfigs[index].isAI) {
      return; // Don't allow turning off the last human
    }

    setPlayerConfigs(newConfigs);
  };

  const handleDifficultyChange = (index, difficulty) => {
    const newConfigs = [...playerConfigs];
    newConfigs[index] = { ...newConfigs[index], aiDifficulty: difficulty };
    setPlayerConfigs(newConfigs);
  };

  const handleStartGame = () => {
    const config = PLAYER_COLORS.slice(0, playerCount).map((color, index) => ({
      color,
      name: PLAYER_NAMES[index],
      isAI: playerConfigs[index].isAI,
      aiDifficulty: playerConfigs[index].aiDifficulty,
    }));
    startGame(config);
  };

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
              onClick={() => handlePlayerCountChange(count)}
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
                backgroundColor: PLAYER_COLORS_LIST[i],
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Player Types */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8 w-96">
        <h2 className="text-xl font-bold text-white mb-4 text-center">玩家类型</h2>
        <div className="flex flex-col gap-3">
          {Array.from({ length: playerCount }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: PLAYER_COLORS_LIST[i] }}
                />
                <span className="text-white font-medium">{PLAYER_NAMES[i]}</span>
              </div>
              <button
                onClick={() => toggleAI(i)}
                className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
                  playerConfigs[i].isAI
                    ? 'bg-red-500 text-white'
                    : 'bg-green-400 text-gray-900'
                }`}
              >
                {playerConfigs[i].isAI ? 'AI对手' : '玩家'}
              </button>
            </div>
          ))}
        </div>
        <p className="text-white/60 text-sm text-center mt-4">
          点击切换玩家/AI类型，至少保留一个人类玩家
        </p>
      </div>

      {/* AI Difficulty Selection */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8 w-96">
        <h2 className="text-xl font-bold text-white mb-4 text-center">AI难度</h2>
        <div className="flex flex-col gap-3">
          {Array.from({ length: playerCount }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: PLAYER_COLORS_LIST[i] }}
                />
                <span className="text-white font-medium">{PLAYER_NAMES[i]}</span>
              </div>
              {playerConfigs[i].isAI ? (
                <div className="flex gap-2">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => handleDifficultyChange(i, diff.value)}
                      className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all ${
                        playerConfigs[i].aiDifficulty === diff.value
                          ? diff.color + ' shadow-lg scale-105'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-white/40 text-sm">人类</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Start Button */}
      <button
        onClick={handleStartGame}
        className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-bold text-2xl py-4 px-12 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        开始游戏
      </button>
    </div>
  );
}
