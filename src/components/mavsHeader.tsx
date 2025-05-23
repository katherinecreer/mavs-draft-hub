import { Link } from 'react-router-dom';
import { useState } from 'react';
import mavsLogo from '../assets/logo2.png';
import mavsLogo2 from '../assets/mavs.png';
import '../styles/mavsHeader.css';

const MavsHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div>
        <Link to="/">
          <img src={mavsLogo2} alt="Mavericks Logo Small" className="mavs-logo" style={{ width: '125px', height: '125px' }} />
        </Link>
      </div>
      <div className="header-content">
        <img src={mavsLogo} alt="Mavericks Logo Large" className="mavs-logo" />
      </div>
      
      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <nav className={`header-right ${isMenuOpen ? 'menu-open' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/draft-hub" className="nav-link" onClick={() => setIsMenuOpen(false)}>Draft Hub</Link>
        <Link to="/mock-draft" className="nav-link" onClick={() => setIsMenuOpen(false)}>Mock Draft</Link>
      </nav>
    </header>
  );
};

export default MavsHeader;

// make the header a flex container and center the text
// put draft hub in a new font below the image
// make the options closer together and also responsive