import { useState } from 'react';
import { useGameStore } from '../../game/store';
import { PLAYER_COLORS } from '../../game/constants';
import { getStats } from '../../game/stats';
import { SKIN_LIST } from '../../game/skins';
import { MAP_VARIANT_LIST } from '../../game/mapVariants';

const PLAYER_COLORS_LIST = ['#E53935', '#1E88E5', '#FDD835', '#43A047'];
const PLAYER_NAMES = ['红方', '蓝方', '黄方', '绿方'];
const COLOR_NAMES = { red: '红', blue: '蓝', yellow: '黄', green: '绿' };
const DIFFICULTIES = [
  { value: 'easy', label: '简单', color: 'bg-green-400 text-gray-900' },
  { value: 'medium', label: '中等', color: 'bg-yellow-400 text-gray-900' },
  { value: 'hard', label: '困难', color: 'bg-red-500 text-white' },
];

const SKIN_THUMBNAILS = {
  classic: { bg: '#87CEEB', icon: '🎨' },
  neon: { bg: '#0f0f23', icon: '🌃' },
  wooden: { bg: '#8B4513', icon: '🪵' },
  crystal: { bg: '#E0FFFF', icon: '💎' },
  galaxy: { bg: '#000011', icon: '🌌' },
  retro: { bg: '#2F4F4F', icon: '👾' },
};

const MAP_THUMBNAILS = {
  classic: { bg: '#4a90d9', icon: '✚' },
  square: { bg: '#4ad98a', icon: '◻' },
  diamond: { bg: '#d94a90', icon: '◇' },
};

export default function StartScreen() {
  const [mode, setMode] = useState('classic');
  const [playerCount, setPlayerCount] = useState(2);
  const [playerColor, setPlayerColor] = useState('red');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showSkinModal, setShowSkinModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  
  // Each player: { isAI: bool, aiDifficulty: 'easy'|'medium'|'hard' }
  const [playerConfigs, setPlayerConfigs] = useState(() => {
    const defaultConfigs = [];
    for (let i = 0; i < 4; i++) {
      defaultConfigs.push({
        isAI: i > 0,
        aiDifficulty: 'medium',
      });
    }
    return defaultConfigs;
  });
  
  const startGame = useGameStore((state) => state.startGame);
  const setSkin = useGameStore((state) => state.setSkin);
  const setMapVariant = useGameStore((state) => state.setMapVariant);
  const currentSkin = useGameStore((state) => state.skin);
  const currentMapVariant = useGameStore((state) => state.mapVariant);

  const availableAIColors = PLAYER_COLORS.filter(c => c !== playerColor);

  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
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
    const humanCount = newConfigs.filter(c => !c.isAI).length;
    if (humanCount < 1 && !newConfigs[index].isAI) {
      return;
    }
    setPlayerConfigs(newConfigs);
  };

  const handleDifficultyChange = (index, difficulty) => {
    const newConfigs = [...playerConfigs];
    newConfigs[index] = { ...newConfigs[index], aiDifficulty: difficulty };
    setPlayerConfigs(newConfigs);
  };

  const handleStartGame = () => {
    const config = availableAIColors.slice(0, playerCount - 1).map((color, index) => ({
      color,
      name: PLAYER_NAMES[index + 1],
      isAI: true,
      aiDifficulty: playerConfigs[index + 1].aiDifficulty,
    }));
    config.unshift({
      color: playerColor,
      name: PLAYER_NAMES[0],
      isAI: false,
      aiDifficulty: 'medium',
    });
    startGame(config, playerColor);
  };

  const handleSkinSelect = (skinId) => {
    setSkin(skinId);
    setShowSkinModal(false);
  };

  const handleMapSelect = (mapVariantId) => {
    setMapVariant(mapVariantId);
    setShowMapModal(false);
  };

  const stats = getStats();
  const totalWins = stats.wins.easy + stats.wins.medium + stats.wins.hard;
  const totalLosses = stats.losses.easy + stats.losses.medium + stats.losses.hard;

  const getWinRate = (difficulty) => {
    const wins = stats.wins[difficulty];
    const losses = stats.losses[difficulty];
    const total = wins + losses;
    if (total === 0) return '0%';
    return Math.round((wins / total) * 100) + '%';
  };

  const getOverallWinRate = () => {
    const total = totalWins + totalLosses;
    if (total === 0) return '0%';
    return Math.round((totalWins / total) * 100) + '%';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-blue-600">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-4">
          飞行棋大作战
        </h1>
        <p className="text-xl text-white/80">Flight Chess 3D</p>
      </div>

      {/* Skin and Map Selection Row */}
      <div className="flex gap-4 mb-4">
        {/* Skin Selection */}
        <button
          onClick={() => setShowSkinModal(true)}
          className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/30 transition-all"
        >
          <span className="text-xl">{SKIN_THUMBNAILS[currentSkin]?.icon || '🎨'}</span>
          <span className="text-white font-medium">皮肤: {SKIN_LIST.find(s => s.id === currentSkin)?.name || '经典'}</span>
        </button>
        
        {/* Map Selection */}
        <button
          onClick={() => setShowMapModal(true)}
          className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/30 transition-all"
        >
          <span className="text-xl">{MAP_THUMBNAILS[currentMapVariant]?.icon || '✚'}</span>
          <span className="text-white font-medium">地图: {MAP_VARIANT_LIST.find(m => m.id === currentMapVariant)?.name || '十字地图'}</span>
        </button>
      </div>
      
      {/* Mode Selection */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4 w-96">
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
      
      {/* Player Color Selection */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4 w-96">
        <h2 className="text-xl font-bold text-white mb-4 text-center">选择颜色</h2>
        <div className="flex gap-4 justify-center">
          {PLAYER_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setPlayerColor(color)}
              className={`w-14 h-14 rounded-full transition-all ${
                playerColor === color
                  ? 'ring-4 ring-white ring-offset-2 ring-offset-blue-600 scale-110'
                  : 'hover:scale-105 opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: PLAYER_COLORS_LIST[PLAYER_COLORS.indexOf(color)] }}
            />
          ))}
        </div>
        <p className="text-white/80 text-center mt-3 text-sm">
          你的颜色: {COLOR_NAMES[playerColor]}
        </p>
      </div>
      
      {/* Player Count */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4 w-96">
        <h2 className="text-xl font-bold text-white mb-4 text-center">玩家数量</h2>
        <div className="flex gap-4 justify-center">
          {[2, 3, 4].map((count) => (
            <button
              key={count}
              onClick={() => handlePlayerCountChange(count)}
              className={`w-14 h-14 rounded-full font-bold text-xl transition-all ${
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
          {Array.from({ length: playerCount }).map((_, i) => {
            const color = i === 0 ? playerColor : availableAIColors[i - 1];
            return (
              <div
                key={i}
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: PLAYER_COLORS_LIST[PLAYER_COLORS.indexOf(color)],
                }}
              />
            );
          })}
        </div>
      </div>
      
      {/* Player Types */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4 w-96">
        <h2 className="text-xl font-bold text-white mb-4 text-center">玩家类型</h2>
        <div className="flex flex-col gap-3">
          {Array.from({ length: playerCount }).map((_, i) => {
            const color = i === 0 ? playerColor : availableAIColors[i - 1];
            return (
              <div
                key={i}
                className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: PLAYER_COLORS_LIST[PLAYER_COLORS.indexOf(color)] }}
                  />
                  <span className="text-white font-medium">
                    {i === 0 ? COLOR_NAMES[playerColor] : COLOR_NAMES[color]}
                  </span>
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
            );
          })}
        </div>
        <p className="text-white/60 text-sm text-center mt-4">
          点击切换玩家/AI类型，至少保留一个人类玩家
        </p>
      </div>

      {/* AI Difficulty Selection */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4 w-96">
        <h2 className="text-xl font-bold text-white mb-4 text-center">AI难度</h2>
        <div className="flex flex-col gap-3">
          {Array.from({ length: playerCount }).map((_, i) => {
            const color = i === 0 ? playerColor : availableAIColors[i - 1];
            return (
              <div
                key={i}
                className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: PLAYER_COLORS_LIST[PLAYER_COLORS.indexOf(color)] }}
                  />
                  <span className="text-white font-medium">
                    {i === 0 ? COLOR_NAMES[playerColor] : COLOR_NAMES[color]}
                  </span>
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
            );
          })}
        </div>
      </div>
      
      {/* Start Button */}
      <button
        onClick={handleStartGame}
        className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-bold text-2xl py-4 px-12 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        开始游戏
      </button>

      {/* Stats Summary */}
      <div className="mt-6 flex items-center gap-4">
        <p className="text-white/90">
          战绩: 胜{totalWins} 负{totalLosses}
        </p>
        <button
          onClick={() => setShowStatsModal(true)}
          className="text-white/70 hover:text-white text-sm underline"
        >
          [详细]
        </button>
      </div>

      {/* Skin Selection Modal */}
      {showSkinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[500px] shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">选择皮肤</h3>
            <div className="grid grid-cols-2 gap-3">
              {SKIN_LIST.map((skin) => (
                <button
                  key={skin.id}
                  onClick={() => handleSkinSelect(skin.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    currentSkin === skin.id
                      ? 'ring-4 ring-blue-500 shadow-lg'
                      : 'hover:scale-102 hover:shadow-md'
                  }`}
                  style={{ backgroundColor: SKIN_THUMBNAILS[skin.id]?.bg || '#ccc' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{SKIN_THUMBNAILS[skin.id]?.icon || '🎨'}</span>
                    <div>
                      <div className="font-bold text-lg">{skin.name}</div>
                      <div className="text-xs opacity-70">{skin.nameEn}</div>
                      <div className="text-sm opacity-60 mt-1">{skin.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSkinModal(false)}
              className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Map Selection Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[500px] shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">选择地图</h3>
            <div className="flex flex-col gap-3">
              {MAP_VARIANT_LIST.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleMapSelect(variant.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    currentMapVariant === variant.id
                      ? 'ring-4 ring-blue-500 shadow-lg'
                      : 'hover:scale-102 hover:shadow-md'
                  }`}
                  style={{ backgroundColor: MAP_THUMBNAILS[variant.id]?.bg || '#ccc' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{MAP_THUMBNAILS[variant.id]?.icon || '✚'}</span>
                    <div>
                      <div className="font-bold text-lg">{variant.name}</div>
                      <div className="text-xs opacity-70">{variant.nameEn}</div>
                      <div className="text-sm opacity-60 mt-1">{variant.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMapModal(false)}
              className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">战绩统计</h3>
            
            <div className="text-center mb-4">
              <p className="text-gray-600">总场次: {stats.totalGames}</p>
              <p className="text-2xl font-bold text-green-600">胜率: {getOverallWinRate()}</p>
            </div>

            <div className="space-y-3">
              {DIFFICULTIES.map((diff) => {
                const wins = stats.wins[diff.value];
                const losses = stats.losses[diff.value];
                const streak = stats.winStreak[diff.value];
                const bestStreak = stats.bestWinStreak[diff.value];
                return (
                  <div key={diff.value} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className={`font-bold ${diff.color.split(' ')[0]}`}>{diff.label}</span>
                      <span className="text-gray-600">
                        胜{wins} 负{losses} | 胜率{getWinRate(diff.value)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      当前连胜: {streak} | 最高连胜: {bestStreak}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowStatsModal(false)}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
