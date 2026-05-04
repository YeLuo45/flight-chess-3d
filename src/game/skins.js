// Skin definitions for Flight Chess 3D
// Each skin defines colors and visual properties for board, pieces, and environment

export const SKINS = {
  classic: {
    id: 'classic',
    name: '经典',
    nameEn: 'Classic',
    description: '传统飞行棋风格',
    // Board colors
    board: {
      base: '#F5F0E6',
      track: [
        '#E53935', '#D32F2F', '#C62828', '#B71C1C', '#C62828', '#D32F2F', '#E53935', '#C62828',
        '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#1565C0', '#1976D2', '#1E88E5', '#1565C0',
        '#FDD835', '#FBC02D', '#F9A825', '#F57F17', '#F9A825', '#FBC02D', '#FDD835', '#F9A825',
        '#43A047', '#388E3C', '#2E7D32', '#1B5E20', '#2E7D32', '#388E3C', '#43A047', '#388E3C',
        '#E91E63', '#C2185B', '#AD1457', '#880E4F', '#AD1457', '#C2185B', '#E91E63', '#C2185B',
        '#9C27B0', '#7B1FA2', '#6A1B9A', '#4A148C', '#6A1B9A', '#7B1FA2', '#9C27B0', '#7B1FA2',
        '#00BCD4', '#0097A7', '#00838F', '#006064', '#00838F', '#0097A7', '#00BCD4', '#0097A7',
      ],
      runway: 0.1,
      finish: '#FF8F00',
      trophy: '#FFC107',
    },
    // Piece material
    piece: {
      roughness: 0.6,
      metalness: 0.2,
      emissiveIntensity: 0.2,
      selectedEmissive: 0.4,
      canMoveEmissive: 0.2,
    },
    // Environment
    background: '#87CEEB',
    fog: '#87CEEB',
    ambientLight: '#FFFFFF',
    directionalLight: '#FFFFFF',
    // Special effects
    effects: {
      eventGlow: true,
      pieceFloat: true,
      shieldColor: '#00ffff',
    },
  },

  neon: {
    id: 'neon',
    name: '霓虹',
    nameEn: 'Neon',
    description: '赛博朋克霓虹风格',
    board: {
      base: '#1a1a2e',
      track: [
        '#ff006e', '#ff006e', '#ff006e', '#ff006e', '#ff006e', '#ff006e', '#ff006e', '#ff006e',
        '#00f5ff', '#00f5ff', '#00f5ff', '#00f5ff', '#00f5ff', '#00f5ff', '#00f5ff', '#00f5ff',
        '#ffbe0b', '#ffbe0b', '#ffbe0b', '#ffbe0b', '#ffbe0b', '#ffbe0b', '#ffbe0b', '#ffbe0b',
        '#8338ec', '#8338ec', '#8338ec', '#8338ec', '#8338ec', '#8338ec', '#8338ec', '#8338ec',
        '#ff006e', '#ff006e', '#ff006e', '#ff006e', '#ff006e', '#ff006e', '#ff006e', '#ff006e',
        '#00f5ff', '#00f5ff', '#00f5ff', '#00f5ff', '#00f5ff', '#00f5ff', '#00f5ff', '#00f5ff',
        '#ffbe0b', '#ffbe0b', '#ffbe0b', '#ffbe0b', '#ffbe0b', '#ffbe0b', '#ffbe0b', '#ffbe0b',
      ],
      runway: 0.3,
      finish: '#ff006e',
      trophy: '#00f5ff',
    },
    piece: {
      roughness: 0.2,
      metalness: 0.8,
      emissiveIntensity: 0.6,
      selectedEmissive: 1.0,
      canMoveEmissive: 0.8,
    },
    background: '#0f0f23',
    fog: '#0f0f23',
    ambientLight: '#4a4a6a',
    directionalLight: '#ff006e',
    effects: {
      eventGlow: true,
      pieceFloat: true,
      shieldColor: '#00f5ff',
    },
  },

  wooden: {
    id: 'wooden',
    name: '木纹',
    nameEn: 'Wooden',
    description: '传统木制棋盘风格',
    board: {
      base: '#8B4513',
      track: [
        '#D2691E', '#CD853F', '#DEB887', '#D2691E', '#CD853F', '#DEB887', '#D2691E', '#CD853F',
        '#A0522D', '#8B4513', '#A0522D', '#8B4513', '#A0522D', '#8B4513', '#A0522D', '#8B4513',
        '#D2691E', '#CD853F', '#DEB887', '#D2691E', '#CD853F', '#DEB887', '#D2691E', '#CD853F',
        '#A0522D', '#8B4513', '#A0522D', '#8B4513', '#A0522D', '#8B4513', '#A0522D', '#8B4513',
        '#D2691E', '#CD853F', '#DEB887', '#D2691E', '#CD853F', '#DEB887', '#D2691E', '#CD853F',
        '#A0522D', '#8B4513', '#A0522D', '#8B4513', '#A0522D', '#8B4513', '#A0522D', '#8B4513',
        '#D2691E', '#CD853F', '#DEB887', '#D2691E', '#CD853F', '#DEB887', '#D2691E', '#CD853F',
      ],
      runway: 0.15,
      finish: '#FFD700',
      trophy: '#B8860B',
    },
    piece: {
      roughness: 0.8,
      metalness: 0.1,
      emissiveIntensity: 0.1,
      selectedEmissive: 0.3,
      canMoveEmissive: 0.15,
    },
    background: '#2d5016',
    fog: '#2d5016',
    ambientLight: '#FFF8DC',
    directionalLight: '#F4A460',
    effects: {
      eventGlow: false,
      pieceFloat: false,
      shieldColor: '#FFD700',
    },
  },

  crystal: {
    id: 'crystal',
    name: '水晶',
    nameEn: 'Crystal',
    description: '晶莹剔透冰晶风格',
    board: {
      base: '#E0FFFF',
      track: [
        '#87CEEB', '#B0E0E6', '#ADD8E6', '#B0E0E6', '#87CEEB', '#B0E0E6', '#ADD8E6', '#B0E0E6',
        '#E0FFFF', '#B0E0E6', '#ADD8E6', '#B0E0E6', '#E0FFFF', '#B0E0E6', '#ADD8E6', '#B0E0E6',
        '#AFEEEE', '#E0FFFF', '#B0E0E6', '#ADD8E6', '#AFEEEE', '#E0FFFF', '#B0E0E6', '#ADD8E6',
        '#00CED1', '#20B2AA', '#48D1CC', '#40E0D0', '#48D1CC', '#20B2AA', '#00CED1', '#40E0D0',
        '#87CEEB', '#B0E0E6', '#ADD8E6', '#B0E0E6', '#87CEEB', '#B0E0E6', '#ADD8E6', '#B0E0E6',
        '#E0FFFF', '#B0E0E6', '#ADD8E6', '#B0E0E6', '#E0FFFF', '#B0E0E6', '#ADD8E6', '#B0E0E6',
        '#AFEEEE', '#E0FFFF', '#B0E0E6', '#ADD8E6', '#AFEEEE', '#E0FFFF', '#B0E0E6', '#ADD8E6',
      ],
      runway: 0.5,
      finish: '#00BFFF',
      trophy: '#E0FFFF',
    },
    piece: {
      roughness: 0.1,
      metalness: 0.9,
      emissiveIntensity: 0.3,
      selectedEmissive: 0.6,
      canMoveEmissive: 0.4,
    },
    background: '#1a1a2e',
    fog: '#1a1a2e',
    ambientLight: '#E0FFFF',
    directionalLight: '#87CEEB',
    effects: {
      eventGlow: true,
      pieceFloat: true,
      shieldColor: '#00FFFF',
    },
  },

  galaxy: {
    id: 'galaxy',
    name: '星空',
    nameEn: 'Galaxy',
    description: '深邃宇宙星空风格',
    board: {
      base: '#0d0d1a',
      track: [
        '#9400D3', '#8A2BE2', '#7B68EE', '#6A5ACD', '#7B68EE', '#8A2BE2', '#9400D3', '#8A2BE2',
        '#00BFFF', '#00CED1', '#20B2AA', '#48D1CC', '#20B2AA', '#00CED1', '#00BFFF', '#48D1CC',
        '#FFD700', '#FFA500', '#FF8C00', '#FF7F50', '#FF8C00', '#FFA500', '#FFD700', '#FF7F50',
        '#32CD32', '#228B22', '#006400', '#008000', '#006400', '#228B22', '#32CD32', '#008000',
        '#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493', '#FFC0CB',
        '#9400D3', '#8A2BE2', '#7B68EE', '#6A5ACD', '#7B68EE', '#8A2BE2', '#9400D3', '#8A2BE2',
        '#00BFFF', '#00CED1', '#20B2AA', '#48D1CC', '#20B2AA', '#00CED1', '#00BFFF', '#48D1CC',
      ],
      runway: 0.4,
      finish: '#FF00FF',
      trophy: '#FFD700',
    },
    piece: {
      roughness: 0.3,
      metalness: 0.7,
      emissiveIntensity: 0.5,
      selectedEmissive: 0.9,
      canMoveEmissive: 0.6,
    },
    background: '#000011',
    fog: '#000022',
    ambientLight: '#333366',
    directionalLight: '#9966FF',
    effects: {
      eventGlow: true,
      pieceFloat: true,
      shieldColor: '#FF00FF',
    },
  },

  retro: {
    id: 'retro',
    name: '复古',
    nameEn: 'Retro',
    description: '80年代复古像素风格',
    board: {
      base: '#2F4F4F',
      track: [
        '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#0000FF', '#0000FF', '#0000FF', '#0000FF',
        '#00FF00', '#00FF00', '#00FF00', '#00FF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00',
        '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#0000FF', '#0000FF', '#0000FF', '#0000FF',
        '#00FF00', '#00FF00', '#00FF00', '#00FF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00',
        '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#0000FF', '#0000FF', '#0000FF', '#0000FF',
        '#00FF00', '#00FF00', '#00FF00', '#00FF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00',
        '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#0000FF', '#0000FF', '#0000FF', '#0000FF',
      ],
      runway: 0.0,
      finish: '#FFFFFF',
      trophy: '#FFFF00',
    },
    piece: {
      roughness: 0.9,
      metalness: 0.0,
      emissiveIntensity: 0.0,
      selectedEmissive: 0.5,
      canMoveEmissive: 0.3,
    },
    background: '#1a1a1a',
    fog: '#1a1a1a',
    ambientLight: '#808080',
    directionalLight: '#C0C0C0',
    effects: {
      eventGlow: false,
      pieceFloat: false,
      shieldColor: '#FFFF00',
    },
  },
};

export const SKIN_LIST = Object.values(SKINS);

export function getSkin(skinId) {
  return SKINS[skinId] || SKINS.classic;
}
