import { create } from 'zustand';
import { COLORS, PLAYER_COLORS, START_POSITIONS, getEventType } from './constants';

const createInitialPieces = () => {
  const pieces = [];
  let id = 0;
  for (const color of PLAYER_COLORS) {
    for (let i = 0; i < 4; i++) {
      pieces.push({
        id: `${color}-${i}`,
        color,
        position: -1, // -1 = start area
        isInFinish: false,
        hasShield: false,
      });
      id++;
    }
  }
  return pieces;
};

const createPlayers = (count) => {
  return PLAYER_COLORS.slice(0, count).map((color, index) => ({
    id: index,
    color,
    name: `${color} Player`,
    isAI: false,
  }));
};

export const useGameStore = create((set, get) => ({
  // Game mode
  mode: 'classic', // 'classic' | 'event'
  
  // Players
  players: [],
  
  // Current turn
  currentPlayerIndex: 0,
  
  // All pieces
  pieces: createInitialPieces(),
  
  // Dice
  diceValue: null,
  isRolling: false,
  
  // Game phase
  phase: 'setup', // 'setup' | 'roll' | 'select' | 'move' | 'event' | 'victory'
  
  // Selected piece
  selectedPieceId: null,
  
  // Event state
  lastEvent: null,
  lastEventResult: null,
  
  // Winner
  winner: null,
  
  // Actions
  setMode: (mode) => set({ mode }),
  
  startGame: (playerCount) => {
    set({
      players: createPlayers(playerCount),
      currentPlayerIndex: 0,
      pieces: createInitialPieces(),
      phase: 'roll',
      diceValue: null,
      selectedPieceId: null,
      winner: null,
      lastEvent: null,
      lastEventResult: null,
    });
  },
  
  rollDice: () => {
    const value = Math.floor(Math.random() * 6) + 1;
    set({
      diceValue: value,
      isRolling: false,
      phase: 'select',
    });
    return value;
  },
  
  startRolling: () => {
    set({ isRolling: true });
  },
  
  selectPiece: (pieceId) => {
    const { pieces, diceValue, currentPlayerIndex, players, mode, phase } = get();
    if (phase !== 'select') return false;
    
    const player = players[currentPlayerIndex];
    const piece = pieces.find(p => p.id === pieceId);
    
    if (!piece || piece.color !== player.color) return false;
    
    // Check if piece can move
    const canMove = get().canPieceMove(pieceId);
    if (!canMove) return false;
    
    set({ selectedPieceId: pieceId, phase: 'move' });
    return true;
  },
  
  canPieceMove: (pieceId) => {
    const { pieces, diceValue, players, currentPlayerIndex } = get();
    if (diceValue === null) return false;
    
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece || piece.isInFinish) return false;
    
    // If at start and rolled 6, can launch
    if (piece.position === -1 && diceValue === 6) {
      return true;
    }
    
    // If at start but didn't roll 6, cannot move
    if (piece.position === -1) {
      return false;
    }
    
    // In runway - check if can finish
    if (piece.position >= 52) {
      const runwaySteps = piece.position - 52;
      const playerColorIndex = PLAYER_COLORS.indexOf(piece.color);
      const runwayIndex = runwaySteps - playerColorIndex * 4;
      const stepsNeeded = 4 - runwayIndex;
      return diceValue >= stepsNeeded; // Must roll exact or higher to finish
    }
    
    return true;
  },
  
  movePiece: (pieceId) => {
    const state = get();
    const { pieces, diceValue, players, currentPlayerIndex, mode, selectedPieceId, phase } = state;
    if (phase !== 'move' || !diceValue) return;
    
    const player = players[currentPlayerIndex];
    const pieceIndex = pieces.findIndex(p => p.id === pieceId);
    const piece = pieces[pieceIndex];
    
    let newPosition = piece.position;
    let isInFinish = piece.isInFinish;
    let wasLaunched = false;
    
    // Launch from start
    if (piece.position === -1 && diceValue === 6) {
      newPosition = START_POSITIONS[piece.color];
      wasLaunched = true;
    } else if (piece.position >= 0 && piece.position < 52) {
      // Main track movement
      newPosition = piece.position + diceValue;
      
      // Check if completed main loop
      if (newPosition >= 52) {
        newPosition = newPosition - 52;
      }
    } else if (piece.position >= 52) {
      // In runway
      const runwaySteps = piece.position - 52;
      const playerColorIndex = PLAYER_COLORS.indexOf(piece.color);
      const runwayIndex = runwaySteps - playerColorIndex * 4;
      const newRunwayIndex = runwayIndex + diceValue;
      
      if (newRunwayIndex >= 4) {
        // Reached finish!
        isInFinish = true;
        newPosition = 100 + playerColorIndex; // Finish position
      } else {
        newPosition = 52 + playerColorIndex * 4 + newRunwayIndex;
      }
    }
    
    // Check for captures (only on main track, not in runway or finish)
    let capturedPiece = null;
    if (newPosition >= 0 && newPosition < 52 && !isInFinish) {
      const captured = pieces.find(p => 
        p.id !== pieceId &&
        p.position === newPosition &&
        p.color !== piece.color &&
        !p.isInFinish &&
        !p.hasShield
      );
      if (captured) {
        capturedPiece = captured;
      }
    }
    
    // Check for event (classic mode has no events)
    let event = null;
    if (mode === 'event' && newPosition >= 0 && newPosition < 52 && !isInFinish) {
      event = getEventType(newPosition);
    }
    
    // Update pieces
    const newPieces = [...pieces];
    newPieces[pieceIndex] = { ...piece, position: isInFinish ? 100 + PLAYER_COLORS.indexOf(piece.color) : newPosition, isInFinish };
    
    if (capturedPiece) {
      const capturedIndex = newPieces.findIndex(p => p.id === capturedPiece.id);
      newPieces[capturedIndex] = { ...capturedPiece, position: -1 };
    }
    
    // Update shields
    newPieces.forEach((p, i) => {
      if (p.hasShield && p.shieldTurnsLeft !== undefined) {
        p.shieldTurnsLeft--;
        if (p.shieldTurnsLeft <= 0) {
          newPieces[i] = { ...p, hasShield: false, shieldTurnsLeft: 0 };
        }
      }
    });
    
    // Check for victory
    const playerPieces = newPieces.filter(p => p.color === piece.color);
    const allInFinish = playerPieces.every(p => p.isInFinish);
    const winner = allInFinish ? player : null;
    
    // Determine next phase
    let nextPhase = 'move';
    if (winner) {
      nextPhase = 'victory';
    } else if (event) {
      nextPhase = 'event';
    } else if (diceValue === 6 && !wasLaunched) {
      // Rolled 6 - get another turn
      nextPhase = 'roll';
    } else {
      // Next player's turn
      nextPhase = 'roll';
    }
    
    set({
      pieces: newPieces,
      phase: nextPhase,
      lastEvent: event,
      winner,
      selectedPieceId: null,
    });
    
    // Move to next player if needed
    if (nextPhase === 'roll' && !diceValue === 6) {
      get().nextPlayer();
    }
  },
  
  nextPlayer: () => {
    const { players, currentPlayerIndex } = get();
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    set({
      currentPlayerIndex: nextIndex,
      diceValue: null,
      phase: 'roll',
    });
  },
  
  handleEvent: (eventResult) => {
    // Handle event effects and move to next turn
    const { diceValue, currentPlayerIndex, players } = get();
    
    // If event says "continue", stay on same player
    if (eventResult.continueTurn) {
      set({ phase: 'roll', lastEvent: null });
    } else {
      get().nextPlayer();
    }
  },
  
  resetGame: () => {
    set({
      mode: 'classic',
      players: [],
      currentPlayerIndex: 0,
      pieces: createInitialPieces(),
      diceValue: null,
      isRolling: false,
      phase: 'setup',
      selectedPieceId: null,
      lastEvent: null,
      lastEventResult: null,
      winner: null,
    });
  },
}));
