// AI decision logic for Flight Chess 3D
import { PLAYER_COLORS, START_POSITIONS, RUNWAY_ENTRY } from './constants';

/**
 * Get all movable pieces for a player given dice value
 */
function getMovablePieces(pieces, diceValue, playerColor) {
  const playerPieces = pieces.filter(p => p.color === playerColor && !p.isInFinish);
  const movable = [];

  for (const piece of playerPieces) {
    let canMove = false;
    let newPosition = piece.position;

    if (piece.position === -1 && diceValue === 6) {
      canMove = true;
      newPosition = START_POSITIONS[piece.color];
    } else if (piece.position >= 0 && piece.position < 52) {
      canMove = true;
      newPosition = piece.position + diceValue;
      if (newPosition >= 52) {
        newPosition = newPosition - 52;
      }
    } else if (piece.position >= 52) {
      // In runway
      const runwaySteps = piece.position - 52;
      const playerColorIndex = PLAYER_COLORS.indexOf(playerColor);
      const runwayIndex = runwaySteps - playerColorIndex * 4;
      const stepsNeeded = 4 - runwayIndex;

      if (diceValue >= stepsNeeded) {
        // Can finish
        canMove = true;
        newPosition = 100 + playerColorIndex;
      }
      // Note: Cannot move partially in runway - must roll exact or more to finish
    }

    if (canMove) {
      movable.push({ piece, newPosition });
    }
  }

  return movable;
}

/**
 * Evaluate the strategic value of moving a piece
 * Higher score = better move
 */
function evaluateMove(piece, newPosition, diceValue, allPieces, playerColor) {
  let score = 0;

  // Base score for being closer to finish
  if (piece.position === -1 && newPosition >= 0) {
    // Launching onto the board is valuable
    score += 20;
  }

  if (newPosition >= 52 && newPosition < 100) {
    // In runway - closer to finish
    const runwayIndex = newPosition - 52;
    const playerColorIndex = PLAYER_COLORS.indexOf(playerColor);
    const indexInRunway = runwayIndex - playerColorIndex * 4;
    score += 30 + (3 - indexInRunway) * 10;
  }

  if (newPosition >= 100) {
    // Finished - best possible outcome
    return 1000;
  }

  // Check if move captures an opponent piece
  if (newPosition >= 0 && newPosition < 52) {
    const capturedPiece = allPieces.find(p =>
      p.id !== piece.id &&
      p.position === newPosition &&
      p.color !== playerColor &&
      !p.isInFinish &&
      !p.hasShield
    );
    if (capturedPiece) {
      score += 50; // Capturing is valuable
    }
  }

  // Check if move lands on a safe square (own color's start area)
  const isStartSafe = Object.entries(START_POSITIONS).some(([color, pos]) =>
    pos === newPosition && color === playerColor
  );
  if (isStartSafe) {
    score += 15;
  }

  // Check if move puts opponents at risk (attacking position)
  const opponentPieces = allPieces.filter(p => p.color !== playerColor);
  opponentPieces.forEach(opp => {
    if (opp.position === newPosition && !opp.hasShield) {
      // We're landing on opponent's position (not capturing, but threatening)
      score += 10;
    }
  });

  // Prefer moving pieces that are already on the board (safer to advance)
  if (piece.position >= 0 && piece.position < 52) {
    score += 5;
  }

  // Penalty for being in start area with no move
  if (piece.position === -1 && diceValue !== 6) {
    score -= 100; // Wasted turn
  }

  return score;
}

/**
 * Get the best piece to move for the current dice value
 * difficulty: 'easy' | 'medium' | 'hard'
 */
export function getBestMove(pieces, diceValue, playerColor, difficulty = 'medium') {
  const playerPieces = pieces.filter(p => p.color === playerColor && !p.isInFinish);

  if (playerPieces.length === 0) return null;

  // Easy: Random selection of movable pieces
  if (difficulty === 'easy') {
    const movable = getMovablePieces(pieces, diceValue, playerColor);
    if (movable.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * movable.length);
    const chosen = movable[randomIndex];
    return { pieceId: chosen.piece.id, position: chosen.newPosition, score: 0 };
  }

  // Medium: Strategic priority selection
  if (difficulty === 'medium') {
    const movable = getMovablePieces(pieces, diceValue, playerColor);
    if (movable.length === 0) return null;

    // Priority: 1. Capture > 2. Finish > 3. Safe zone > 4. Event square > 5. Closest to finish
    let bestMove = null;
    let bestPriority = -1;
    let bestProgress = -1;

    for (const { piece, newPosition } of movable) {
      let priority = 0;
      let progress = 0;

      // Priority 5: Can finish (highest priority)
      if (newPosition >= 100) {
        priority = 5;
        progress = 100;
      }
      // Priority 4: Capture opponent
      else if (newPosition >= 0 && newPosition < 52) {
        const capturedPiece = pieces.find(p =>
          p.id !== piece.id &&
          p.position === newPosition &&
          p.color !== playerColor &&
          !p.isInFinish &&
          !p.hasShield
        );
        if (capturedPiece) {
          priority = 4;
        }
      }

      // Priority 3: Safe zone (own start)
      if (priority === 0) {
        const isStartSafe = Object.entries(START_POSITIONS).some(([color, pos]) =>
          pos === newPosition && color === playerColor
        );
        if (isStartSafe) {
          priority = 3;
        }
      }

      // Priority 2: Event square
      if (priority === 0 && newPosition >= 0 && newPosition < 52) {
        // Simple event detection - in a real implementation, check event squares
        // For now, treat specific positions as event squares
        const eventSquares = [5, 12, 18, 25, 33, 40, 46]; // Example positions
        if (eventSquares.includes(newPosition)) {
          priority = 2;
        }
      }

      // Priority 1: Closest to finish (lowest priority)
      if (priority === 0) {
        priority = 1;
        if (newPosition >= 52) {
          progress = 52 + (4 - (newPosition - 52)) * 10; // In runway, higher progress
        } else {
          progress = newPosition;
        }
      }

      // Update best move based on priority and progress
      if (priority > bestPriority || (priority === bestPriority && progress > bestProgress)) {
        bestPriority = priority;
        bestProgress = progress;
        bestMove = { pieceId: piece.id, position: newPosition, score: priority * 100 + progress };
      }
    }

    return bestMove;
  }

  // Hard: Full evaluation logic (original implementation)
  let bestPiece = null;
  let bestScore = -Infinity;
  let bestPosition = null;

  for (const piece of playerPieces) {
    // Check if piece can move
    let canMove = false;
    let newPosition = piece.position;

    if (piece.position === -1 && diceValue === 6) {
      canMove = true;
      newPosition = START_POSITIONS[piece.color];
    } else if (piece.position >= 0 && piece.position < 52) {
      canMove = true;
      newPosition = piece.position + diceValue;
      if (newPosition >= 52) {
        newPosition = newPosition - 52;
      }
    } else if (piece.position >= 52) {
      // In runway
      const runwaySteps = piece.position - 52;
      const playerColorIndex = PLAYER_COLORS.indexOf(piece.color);
      const runwayIndex = runwaySteps - playerColorIndex * 4;
      const stepsNeeded = 4 - runwayIndex;

      if (diceValue >= stepsNeeded) {
        // Can finish
        canMove = true;
        newPosition = 100 + playerColorIndex;
      }
      // Note: Cannot move partially in runway - must roll exact or more to finish
    }

    if (canMove) {
      const score = evaluateMove(piece, newPosition, diceValue, pieces, playerColor);
      if (score > bestScore) {
        bestScore = score;
        bestPiece = piece;
        bestPosition = newPosition;
      }
    }
  }

  return bestPiece ? { pieceId: bestPiece.id, position: bestPosition, score: bestScore } : null;
}

/**
 * Determine if AI should roll (always yes for AI)
 */
export function shouldAIRoll() {
  return true;
}

/**
 * Calculate delay for AI actions (to make it feel natural)
 * Delay varies by difficulty
 */
export function getAIDelay(actionType, difficulty = 'medium') {
  const baseDelay = {
    easy: { roll: 400, select: 300, move: 200 },
    medium: { roll: 800, select: 600, move: 400 },
    hard: { roll: 1200, select: 900, move: 600 },
  };

  const delays = baseDelay[difficulty] || baseDelay.medium;
  const base = delays[actionType] || 500;

  return base + Math.random() * (base * 0.5);
}
