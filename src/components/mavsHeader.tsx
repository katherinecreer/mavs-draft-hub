import { Link } from 'react-router-dom';
import mavsLogo from '../assets/logo2.png';
import '../styles/mavsHeader.css';

const mavsHeader = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={mavsLogo} alt="Mavericks Logo" className="mavs-logo" />
      </div>
      <nav className="header-right">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/draft-hub" className="nav-link">Draft Hub</Link>
        <Link to="/mock-draft" className="nav-link">Mock Draft</Link>
      </nav>
    </header>
  );
};

export default mavsHeader;

// make the header a flex container and center the text
// put draft hub in a new font below the image
// make the options closer together and also responsive