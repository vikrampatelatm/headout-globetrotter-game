import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import LandingPage from "./pages/LandingPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/play" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
