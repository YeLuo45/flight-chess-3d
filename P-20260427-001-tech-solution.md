# Technical Solution - Flight Chess 3D

## 1. Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | React 18 + Vite 5 | Fast HMR, ESBuild, modern ecosystem |
| 3D Engine | Three.js + @react-three/fiber | React declarative 3D, R3F ecosystem |
| 3D Helpers | @react-three/drei | OrbitControls, Html, useGLTF helpers |
| State | Zustand | Minimal, performant, React-agnostic |
| Audio | Howler.js | Cross-browser audio, simple API |
| Styling | Tailwind CSS 3 | Rapid UI development |

## 2. 3D Board Implementation

### Board Geometry
- Board built from `THREE.Group` containing individual square meshes
- Each square: `RoundedBoxGeometry` (from drei) or custom low-poly geometry
- Colors applied via `MeshStandardMaterial` with emissive for glow
- Board floats on invisible platform (just visual grounding)

### Camera
- Fixed isometric angle as default
- `OrbitControls` enabled for player to rotate view
- Constrained: min polar angle 30°, max 80° (no top-down or under-board)
- Smooth damping on controls

### Lighting
```javascript
<ambientLight intensity={0.6} color="#FFF5E6" />
<directionalLight
  position={[10, 20, 10]}
  intensity={1.2}
  castShadow
  shadow-mapSize={[2048, 2048]}
/>
```

### Special Square Effects
- Event squares have floating 3D icons (simple geometry, not models)
- Pulsing glow via `emissiveIntensity` animation in `useFrame`
- Point light child under each event square

## 3. Dice Implementation

### 3D Dice
- Rounded cube using `RoundedBoxGeometry`
- Dot pips as dark inset planes or texture
- Physics: use `useFrame` to rotate randomly for 0.8s, then settle
- Settle detection: lerp to nearest valid face (1-6)
- Or: CSS 3D transform fallback for simpler animation

### Alternative: CSS 3D Dice
- Pure HTML/CSS 3D transforms for dice
- Simpler, lighter, easier to animate
- Use React state for dice result
- Can animate with CSS keyframes + JS random rotation

**Decision**: Use CSS 3D dice for simplicity, reserve Three.js for board only

## 4. Game State (Zustand)

```typescript
interface GameState {
  mode: 'classic' | 'event';
  players: Player[];           // 2-4 players
  currentPlayerIndex: number;
  pieces: Piece[];              // all 16 pieces
  diceValue: number | null;
  phase: 'roll' | 'select' | 'move' | 'event' | 'victory';
  eventModePowerUps: PowerUp[];
  winner: Player | null;
}

interface Piece {
  id: string;                   // 'red-1', 'blue-2', etc.
  color: 'red' | 'blue' | 'yellow' | 'green';
  playerId: number;
  position: number;             // 0-51 main track, -1 = start, -2 = finish
  isInFinish: boolean;
  hasShield: boolean;
}
```

## 5. Board Position Data

52 main track positions, then 4 color runways (each 4 squares):
```
Main track: positions 0-51 (clockwise)
Red runway: positions 52-55 (final stretch)
Blue runway: positions 56-59
Yellow runway: positions 60-63
Green runway: positions 64-67
```

Special positions:
- Start positions per color (index into main track)
- Event squares at specific indices (e.g., positions 5, 18, 31, 44)

## 6. Movement Logic

```typescript
function calculateNewPosition(piece: Piece, diceValue: number): number {
  // 1. If piece at start (position=-1) and dice=6 → launch to first color square
  // 2. Otherwise move forward by diceValue
  // 3. If exceeds finish entry → check exact count rule
  // 4. For runway: different rules apply
}

function checkCapture(pieces: Piece[], newPos: number): Piece | null {
  // Check if any opponent piece is at newPos
  // Return that piece to start if found
}

function checkVictory(pieces: Piece[]): boolean {
  // All 4 pieces of a player in finish zone
}
```

## 7. File Structure

```
flight-chess-3d/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Board.jsx          # 3D board container
│   │   ├── Square.jsx         # Individual board square
│   │   ├── Piece.jsx          # 3D chess piece
│   │   ├── Dice.jsx           # CSS 3D dice
│   │   ├── UI/
│   │   │   ├── StartScreen.jsx
│   │   │   ├── GameHUD.jsx
│   │   │   ├── TurnIndicator.jsx
│   │   │   └── VictoryScreen.jsx
│   │   └── Effects/
│   │       └── Particles.jsx  # Confetti, capture effects
│   ├── game/
│   │   ├── store.js           # Zustand store
│   │   ├── rules.js           # Game rules
│   │   └── constants.js       # Board data, colors
│   ├── assets/
│   │   └── audio/             # .mp3 sound files
│   └── hooks/
│       └── useDiceRoll.js
```

## 8. Audio Implementation

Using Howler.js for cross-browser audio:

```javascript
const sounds = {
  diceRoll: new Howl({ src: ['/audio/dice.mp3'] }),
  pieceMove: new Howl({ src: ['/audio/move.mp3'] }),
  capture: new Howl({ src: ['/audio/capture.mp3'] }),
  lucky: new Howl({ src: ['/audio/lucky.mp3'] }),
  curse: new Howl({ src: ['/audio/curse.mp3'] }),
  victory: new Howl({ src: ['/audio/victory.mp3'] }),
};
```

**Note**: For MVP, audio files can be generated via Web Audio API synthesis instead of loading external files. This avoids needing audio assets.

## 9. Animation Strategy

| Element | Approach |
|---------|----------|
| Dice roll | CSS 3D keyframes + JS settle |
| Piece movement | React Spring or Framer Motion for smooth transitions |
| Capture | Scale down + particle burst, then reset position |
| Victory | Confetti particles (canvas or Three.js) |
| Event square | Emissive pulse via useFrame |
| Turn change | Color flash on player indicator |

## 10. Deployment

- Static build → GitHub Pages (gh-pages branch)
- `npm run build` outputs to `dist/`
- Single-page app (no router needed for MVP)
- URL: `https://yeluo45.github.io/flight-chess-3d/`

## 11. GitHub Repo

Create new repo: `https://github.com/YeLuo45/flight-chess-3d`
