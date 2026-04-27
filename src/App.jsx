import { useGameStore } from './game/store';
import StartScreen from './components/UI/StartScreen';
import GameBoard from './components/Board/GameBoard';
import GameHUD from './components/UI/GameHUD';
import VictoryScreen from './components/UI/VictoryScreen';

function App() {
  const { phase } = useGameStore();
  
  if (phase === 'setup') {
    return <StartScreen />;
  }
  
  if (phase === 'victory') {
    return <VictoryScreen />;
  }
  
  return (
    <div className="w-full h-full relative">
      <GameBoard />
      <GameHUD />
    </div>
  );
}

export default App;
