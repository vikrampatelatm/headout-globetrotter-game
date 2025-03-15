import './App.css'
import AppRoutes from "./routes";
import { GameProvider } from "./context/GameContext";

const App = () => {
  return (
    <GameProvider>
      <AppRoutes />
    </GameProvider>
  );
};

export default App;

