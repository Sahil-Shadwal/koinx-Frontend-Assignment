import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import CoinPage from "./pages/CoinPage";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/:token" element={<CoinPage />} />
          <Route path="/" element={<Navigate to="/bitcoin" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
