const STATS_KEY = 'flight_chess_stats';

export function getStats() {
  const data = localStorage.getItem(STATS_KEY);
  return data ? JSON.parse(data) : {
    totalGames: 0,
    wins: { easy: 0, medium: 0, hard: 0 },
    losses: { easy: 0, medium: 0, hard: 0 },
    winStreak: { easy: 0, medium: 0, hard: 0 },
    bestWinStreak: { easy: 0, medium: 0, hard: 0 }
  };
}

export function updateStats(isWin, aiDifficulty) {
  // aiDifficulty: highest difficulty AI (e.g. 'hard')
  const stats = getStats();
  stats.totalGames++;
  if (isWin) {
    stats.wins[aiDifficulty]++;
    stats.winStreak[aiDifficulty]++;
    if (stats.winStreak[aiDifficulty] > stats.bestWinStreak[aiDifficulty]) {
      stats.bestWinStreak[aiDifficulty] = stats.winStreak[aiDifficulty];
    }
  } else {
    stats.losses[aiDifficulty]++;
    stats.winStreak[aiDifficulty] = 0;
  }
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function clearStats() {
  localStorage.removeItem(STATS_KEY);
}