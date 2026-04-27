// Board and game constants for Flight Chess 3D

export const COLORS = {
  red: '#E53935',
  blue: '#1E88E5',
  yellow: '#FDD835',
  green: '#43A047',
};

export const PLAYER_COLORS = ['red', 'blue', 'yellow', 'green'];

// 52 main track positions (clockwise from red start)
// Board layout: cross shape
// Main track positions 0-51
// Each color's runway: 4 squares leading to center
// Start positions on main track for each color launch

// Classic flight chess board positions
// The board is a cross shape with 4 arms
// Red starts at position 0 (top arm), then clockwise: Yellow(13), Blue(26), Green(39)

// Main track: 52 squares (0-51), clockwise
// Starting squares for each color (where pieces launch onto track)
export const START_POSITIONS = {
  red: 0,
  yellow: 13,
  blue: 26,
  green: 39,
};

// Entry positions where pieces enter their color's runway (after completing main loop)
export const RUNWAY_ENTRY = {
  red: 51,   // last main track square before completing loop
  yellow: 12,
  blue: 25,
  green: 38,
};

// Event square positions on main track (indices)
export const EVENT_POSITIONS = {
  lucky: [5, 18, 31, 44],      // Roll again
  curse: [11, 24, 37, 50],     // Miss turn
  teleport: [3, 16, 29, 42],   // Jump 6 squares
  swap: [8, 21, 34, 47],       // Swap with opponent
};

// Event types
export const EVENT_TYPES = {
  LUCKY: 'lucky',
  CURSE: 'curse',
  TELEPORT: 'teleport',
  SWAP: 'swap',
};

// Generate 3D positions for main track squares (cross shape)
function generateMainTrack() {
  const positions = [];
  
  // Cross arms (each arm has squares radiating from center)
  // Using a simplified coordinate system
  // Center is at (0, 0, 0)
  // Board squares are at y = 0.1 (slightly elevated)
  
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

// Generate runway squares for a color (4 squares leading to center)
function generateRunway(color, startPos) {
  const runway = [];
  const offsets = [
    { x: 0, z: -1 },
    { x: 0, z: -2 },
    { x: 0, z: -3 },
    { x: 0, z: -4 },
  ];
  
  offsets.forEach((offset, i) => {
    runway.push({
      x: startPos.x + offset.x,
      y: 0.1 + i * 0.05,
      z: startPos.z + offset.z,
      color,
      segment: 'runway',
      index: i,
    });
  });
  
  return runway;
}

export const MAIN_TRACK = generateMainTrack();

// Runway positions (relative to center)
export const RUNWAYS = {
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

// Get position data for a piece
export function getPositionData(position, color) {
  if (position === -1) {
    // Start area - return spawn position for the color
    return getStartPosition(color);
  }
  
  if (position >= 0 && position < 52) {
    return MAIN_TRACK[position];
  }
  
  // Runway positions (52-55 for red, 56-59 for blue, etc.)
  if (position >= 52 && position < 68) {
    const runwayIndex = position - 52;
    const runwayColors = ['red', 'yellow', 'blue', 'green'];
    const colorIndex = runwayColors.indexOf(color);
    const indexInRunway = runwayIndex - colorIndex * 4;
    if (indexInRunway >= 0 && indexInRunway < 4) {
      return RUNWAYS[color][indexInRunway];
    }
  }
  
  return null;
}

function getStartPosition(color) {
  const startPositions = {
    red: { x: -7, y: 0.2, z: -7 },
    yellow: { x: 7, y: 0.2, z: -7 },
    blue: { x: 7, y: 0.2, z: 7 },
    green: { x: -7, y: 0.2, z: 7 },
  };
  return startPositions[color];
}

// Check if a position is an event square
export function getEventType(position) {
  if (position < 0 || position >= 52) return null;
  
  for (const [type, positions] of Object.entries(EVENT_POSITIONS)) {
    if (positions.includes(position)) {
      return type;
    }
  }
  return null;
}
