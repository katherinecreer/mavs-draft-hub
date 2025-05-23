import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MavsHeader from './components/mavsHeader';
import DraftHub from './pages/draftHub';
import PlayerProfile from './pages/playerProfile';
import WelcomeLogin from './pages/welcomeLogin';
import MockDraft from './pages/mockDraft';
import MavsFooter from './components/mavsFooter';
function App() {
  return (
    <Router>
      <MavsHeader />
      <Routes>
        <Route path="/" element={<WelcomeLogin />} />
        <Route path="/draft-hub" element={<DraftHub />} />
        <Route path="/mock-draft" element={<MockDraft />} />
        <Route path="/player/:playerId" element={<PlayerProfile />} />
      </Routes>
      <MavsFooter />
    </Router>
  );
}

export default App;
