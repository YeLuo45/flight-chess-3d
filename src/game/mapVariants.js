// Map variants for Flight Chess 3D
// Each variant defines a different board layout

import { COLORS, PLAYER_COLORS } from './constants';

// Variant 1: Classic Cross (original layout)
function generateClassicCross() {
  const positions = [];
  
  // Top arm (Red) - going right
  for (let i = 0; i < 13; i++) {
    positions.push({ x: i - 6, z: -6, color: 'red', segment: 'arm' });
  }
  
  // Right arm (Yellow) - going down
  for (let i = 0; i < 13; i++) {
    positions.push({ x: 6, z: i - 6, color: 'yellow', segment: 'arm' });
  }
  
  // Bottom arm (Blue) - going left
  for (let i = 0; i < 13; i++) {
    positions.push({ x: 6 - i, z: 6, color: 'blue', segment: 'arm' });
  }
  
  // Left arm (Green) - going up
  for (let i = 0; i < 13; i++) {
    positions.push({ x: -6, z: 6 - i, color: 'green', segment: 'arm' });
  }
  
  return positions;
}

function generateClassicRunways() {
  return {
    red: [
      { x: -5, y: 0.1, z: -5, color: 'red', segment: 'runway' },
      { x: -5, y: 0.15, z: -4, color: 'red', segment: 'runway' },
      { x: -5, y: 0.2, z: -3, color: 'red', segment: 'runway' },
      { x: -5, y: 0.25, z: -2, color: 'red', segment: 'runway' },
    ],
    yellow: [
      { x: 5, y: 0.1, z: -5, color: 'yellow', segment: 'runway' },
      { x: 4, y: 0.15, z: -5, color: 'yellow', segment: 'runway' },
      { x: 3, y: 0.2, z: -5, color: 'yellow', segment: 'runway' },
      { x: 2, y: 0.25, z: -5, color: 'yellow', segment: 'runway' },
    ],
    blue: [
      { x: 5, y: 0.1, z: 5, color: 'blue', segment: 'runway' },
      { x: 5, y: 0.15, z: 4, color: 'blue', segment: 'runway' },
      { x: 5, y: 0.2, z: 3, color: 'blue', segment: 'runway' },
      { x: 5, y: 0.25, z: 2, color: 'blue', segment: 'runway' },
    ],
    green: [
      { x: -5, y: 0.1, z: 5, color: 'green', segment: 'runway' },
      { x: -4, y: 0.15, z: 5, color: 'green', segment: 'runway' },
      { x: -3, y: 0.2, z: 5, color: 'green', segment: 'runway' },
      { x: -2, y: 0.25, z: 5, color: 'green', segment: 'runway' },
    ],
  };
}

function generateClassicStartPositions() {
  return {
    red: { x: -7, y: 0.2, z: -7 },
    yellow: { x: 7, y: 0.2, z: -7 },
    blue: { x: 7, y: 0.2, z: 7 },
    green: { x: -7, y: 0.2, z: 7 },
  };
}

// Variant 2: Square Ring
function generateSquareRing() {
  const positions = [];
  const size = 8; // half-size of the square
  const step = 1;
  
  // Bottom edge (Blue start, going right)
  for (let i = 0; i < 16; i++) {
    positions.push({ x: -size + i * step, z: size, color: 'blue', segment: 'arm' });
  }
  
  // Right edge (Yellow going down)
  for (let i = 0; i < 16; i++) {
    positions.push({ x: size, z: size - i * step, color: 'yellow', segment: 'arm' });
  }
  
  // Top edge (Red going left)
  for (let i = 0; i < 16; i++) {
    positions.push({ x: size - i * step, z: -size, color: 'red', segment: 'arm' });
  }
  
  // Left edge (Green going up)
  for (let i = 0; i < 16; i++) {
    positions.push({ x: -size, z: -size + i * step, color: 'green', segment: 'arm' });
  }
  
  return positions;
}

function generateSquareRingRunways() {
  return {
    red: [
      { x: -4, y: 0.1, z: -5, color: 'red', segment: 'runway' },
      { x: -4, y: 0.15, z: -6, color: 'red', segment: 'runway' },
      { x: -4, y: 0.2, z: -7, color: 'red', segment: 'runway' },
      { x: -4, y: 0.25, z: -8, color: 'red', segment: 'runway' },
    ],
    yellow: [
      { x: 4, y: 0.1, z: -4, color: 'yellow', segment: 'runway' },
      { x: 5, y: 0.15, z: -4, color: 'yellow', segment: 'runway' },
      { x: 6, y: 0.2, z: -4, color: 'yellow', segment: 'runway' },
      { x: 7, y: 0.25, z: -4, color: 'yellow', segment: 'runway' },
    ],
    blue: [
      { x: 4, y: 0.1, z: 4, color: 'blue', segment: 'runway' },
      { x: 4, y: 0.15, z: 5, color: 'blue', segment: 'runway' },
      { x: 4, y: 0.2, z: 6, color: 'blue', segment: 'runway' },
      { x: 4, y: 0.25, z: 7, color: 'blue', segment: 'runway' },
    ],
    green: [
      { x: -4, y: 0.1, z: 4, color: 'green', segment: 'runway' },
      { x: -5, y: 0.15, z: 4, color: 'green', segment: 'runway' },
      { x: -6, y: 0.2, z: 4, color: 'green', segment: 'runway' },
      { x: -7, y: 0.25, z: 4, color: 'green', segment: 'runway' },
    ],
  };
}

function generateSquareRingStartPositions() {
  return {
    red: { x: -6, y: 0.2, z: -10 },
    yellow: { x: 10, y: 0.2, z: -6 },
    blue: { x: 6, y: 0.2, z: 10 },
    green: { x: -10, y: 0.2, z: 6 },
  };
}

// Variant 3: Diamond (rotated square)
function generateDiamond() {
  const positions = [];
  const size = 7; // distance to corner
  
  // Bottom-left to bottom-right (Blue segment 1)
  for (let i = 0; i < 13; i++) {
    positions.push({ x: -6 + i, z: 6, color: 'blue', segment: 'arm' });
  }
  
  // Bottom-right to top-right (Yellow segment 2)
  for (let i = 0; i < 13; i++) {
    positions.push({ x: 6, z: 6 - i, color: 'yellow', segment: 'arm' });
  }
  
  // Top-right to top-left (Red segment 3)
  for (let i = 0; i < 13; i++) {
    positions.push({ x: 6 - i, z: -6, color: 'red', segment: 'arm' });
  }
  
  // Top-left to bottom-left (Green segment 4)
  for (let i = 0; i < 13; i++) {
    positions.push({ x: -6, z: -6 + i, color: 'green', segment: 'arm' });
  }
  
  return positions;
}

function generateDiamondRunways() {
  return {
    red: [
      { x: 5, y: 0.1, z: -5, color: 'red', segment: 'runway' },
      { x: 6, y: 0.15, z: -5, color: 'red', segment: 'runway' },
      { x: 7, y: 0.2, z: -5, color: 'red', segment: 'runway' },
      { x: 8, y: 0.25, z: -5, color: 'red', segment: 'runway' },
    ],
    yellow: [
      { x: 5, y: 0.1, z: 5, color: 'yellow', segment: 'runway' },
      { x: 5, y: 0.15, z: 6, color: 'yellow', segment: 'runway' },
      { x: 5, y: 0.2, z: 7, color: 'yellow', segment: 'runway' },
      { x: 5, y: 0.25, z: 8, color: 'yellow', segment: 'runway' },
    ],
    blue: [
      { x: -5, y: 0.1, z: 5, color: 'blue', segment: 'runway' },
      { x: -6, y: 0.15, z: 5, color: 'blue', segment: 'runway' },
      { x: -7, y: 0.2, z: 5, color: 'blue', segment: 'runway' },
      { x: -8, y: 0.25, z: 5, color: 'blue', segment: 'runway' },
    ],
    green: [
      { x: -5, y: 0.1, z: -5, color: 'green', segment: 'runway' },
      { x: -5, y: 0.15, z: -6, color: 'green', segment: 'runway' },
      { x: -5, y: 0.2, z: -7, color: 'green', segment: 'runway' },
      { x: -5, y: 0.25, z: -8, color: 'green', segment: 'runway' },
    ],
  };
}

function generateDiamondStartPositions() {
  return {
    red: { x: 10, y: 0.2, z: -10 },
    yellow: { x: 10, y: 0.2, z: 10 },
    blue: { x: -10, y: 0.2, z: 10 },
    green: { x: -10, y: 0.2, z: -10 },
  };
}

// Map variants definition
export const MAP_VARIANTS = {
  classic: {
    id: 'classic',
    name: '十字地图',
    nameEn: 'Classic Cross',
    description: '经典十字形地图',
    mainTrack: generateClassicCross(),
    runways: generateClassicRunways(),
    startPositions: generateClassicStartPositions(),
    cameraPosition: [18, 18, 18],
    cameraTarget: [0, 0, 0],
    boardSize: 18,
  },
  
  square: {
    id: 'square',
    name: '方形地图',
    nameEn: 'Square Ring',
    description: '方形环形地图',
    mainTrack: generateSquareRing(),
    runways: generateSquareRingRunways(),
    startPositions: generateSquareRingStartPositions(),
    cameraPosition: [22, 18, 22],
    cameraTarget: [0, 0, 0],
    boardSize: 20,
  },
  
  diamond: {
    id: 'diamond',
    name: '菱形地图',
    nameEn: 'Diamond',
    description: '菱形斜线地图',
    mainTrack: generateDiamond(),
    runways: generateDiamondRunways(),
    startPositions: generateDiamondStartPositions(),
    cameraPosition: [20, 20, 20],
    cameraTarget: [0, 0, 0],
    boardSize: 18,
  },
};

export const MAP_VARIANT_LIST = Object.values(MAP_VARIANTS);

export function getMapVariant(variantId) {
  return MAP_VARIANTS[variantId] || MAP_VARIANTS.classic;
}

// Helper to get start position for a color
export function getStartPositionForVariant(variantId, color) {
  const variant = getMapVariant(variantId);
  return variant.startPositions[color];
}

// Get position data for a piece based on map variant
export function getRunwayEntryPosition(variantId, color) {
  const variant = getMapVariant(variantId);
  const trackLength = variant.mainTrack.length; // 52 for classic
  // Entry is at position just before completing the loop
  const entryOffset = {
    red: 0,
    yellow: 13,
    blue: 26,
    green: 39,
  };
  const entryIndex = (entryOffset[color] + trackLength - 1) % trackLength;
  return variant.mainTrack[entryIndex];
}

// Get position data for a piece based on map variant
export function getPositionDataForVariant(position, color, variant) {
  if (position === -1) {
    // Start area - return spawn position for the color
    return variant.startPositions[color];
  }
  
  if (position >= 0 && position < variant.mainTrack.length) {
    return variant.mainTrack[position];
  }
  
  // Runway positions (52-55 for red, 56-59 for blue, etc.)
  if (position >= variant.mainTrack.length && position < variant.mainTrack.length + 16) {
    const runwayIndex = position - variant.mainTrack.length;
    const runwayColors = ['red', 'yellow', 'blue', 'green'];
    const colorIndex = runwayColors.indexOf(color);
    const indexInRunway = runwayIndex - colorIndex * 4;
    if (indexInRunway >= 0 && indexInRunway < 4) {
      return variant.runways[color][indexInRunway];
    }
  }
  
  return null;
}
