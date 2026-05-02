// AI decision logic for Flight Chess 3D
import { PLAYER_COLORS, START_POSITIONS, RUNWAY_ENTRY } from './constants';

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
 */
export function getBestMove(pieces, diceValue, playerColor) {
  const playerPieces = pieces.filter(p => p.color === playerColor && !p.isInFinish);
  
  if (playerPieces.length === 0) return null;
  
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
      const playerColorIndex = PLAYER_COLORS.indexOf(playerColor);
      const runwayIndex = runwaySteps - playerColorIndex * 4;
      const newRunwayIndex = runwayIndex + diceValue;
      
      if (newRunwayIndex >= 4) {
        // Can finish
        canMove = true;
        newPosition = 100 + playerColorIndex;
      } else if (diceValue >= newRunwayIndex + 1) {
        canMove = true;
        newPosition = 52 + playerColorIndex * 4 + newRunwayIndex;
      }
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
 */
export function getAIDelay(actionType) {
  switch (actionType) {
    case 'roll':
      return 800 + Math.random() * 600; // 0.8-1.4 seconds to "think" before rolling
    case 'select':
      return 600 + Math.random() * 800; // 0.6-1.4 seconds to "decide" which piece
    case 'move':
      return 400 + Math.random() * 400; // 0.4-0.8 seconds to "confirm"
    default:
      return 500;
  }
}
