import { create } from 'zustand';
import { COLORS, PLAYER_COLORS, START_POSITIONS, getEventType } from './constants';
import { getBestMove, getAIDelay } from './ai';

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

const createPlayers = (playerConfigs) => {
  // playerConfigs: array of { color, isAI, name }
  return playerConfigs.map((config, index) => ({
    id: index,
    color: config.color,
    name: config.name || `${config.color} Player`,
    isAI: config.isAI || false,
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

  // AI state
  isAIThinking: false,
  
  // Actions
  setMode: (mode) => set({ mode }),
  
  startGame: (playerConfigs) => {
    set({
      players: createPlayers(playerConfigs),
      currentPlayerIndex: 0,
      pieces: createInitialPieces(),
      phase: 'roll',
      diceValue: null,
      selectedPieceId: null,
      winner: null,
      lastEvent: null,
      lastEventResult: null,
      isAIThinking: false,
    });
    
    // Check if first player is AI and start its turn
    const state = get();
    if (state.players[0]?.isAI) {
      const delay = getAIDelay('roll');
      setTimeout(() => {
        get().executeAITurn();
      }, delay);
    }
  },
  
  rollDice: () => {
    const value = Math.floor(Math.random() * 6) + 1;
    set({
      diceValue: value,
      isRolling: false,
      phase: 'select',
    });
    
    // Check if current player is AI
    const { players, currentPlayerIndex } = get();
    if (players[currentPlayerIndex]?.isAI) {
      const delay = getAIDelay('select');
      setTimeout(() => {
        get().executeAISelect();
      }, delay);
    }
    
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
    
    // If AI player, execute move after delay
    if (player.isAI) {
      const delay = getAIDelay('move');
      setTimeout(() => {
        get().movePiece(pieceId);
      }, delay);
    }
    
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
    
    // Move to next player if needed (handle the bug: diceValue === 6 was being negated incorrectly)
    if (nextPhase === 'roll' && !(diceValue === 6 && !wasLaunched)) {
      get().nextPlayer();
    } else if (nextPhase === 'roll' && (diceValue === 6 && !wasLaunched)) {
      // Rolled 6, same player gets another turn - if AI, execute
      const { players, currentPlayerIndex } = get();
      if (players[currentPlayerIndex]?.isAI) {
        const delay = getAIDelay('roll');
        setTimeout(() => {
          get().executeAITurn();
        }, delay);
      }
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
    
    // If next player is AI, start their turn
    if (players[nextIndex]?.isAI) {
      const delay = getAIDelay('roll');
      setTimeout(() => {
        get().executeAITurn();
      }, delay);
    }
  },
  
  // AI execution methods
  executeAITurn: () => {
    const { phase, isRolling } = get();
    if (phase !== 'roll') return;
    
    get().startRolling();
    setTimeout(() => {
      get().rollDice();
    }, 800);
  },
  
  executeAISelect: () => {
    const { pieces, diceValue, players, currentPlayerIndex, phase } = get();
    if (phase !== 'select') return;
    
    const player = players[currentPlayerIndex];
    if (!player?.isAI) return;
    
    const bestMove = getBestMove(pieces, diceValue, player.color);
    if (bestMove) {
      get().selectPiece(bestMove.pieceId);
    } else {
      // No valid moves, skip turn
      get().nextPlayer();
    }
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
      isAIThinking: false,
    });
  },
}));
