import { Link, useLocation } from 'react-router-dom';
import { Tabs, Tab, Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import mavsLogo from '../assets/logo3.png';
import mavsLogo2 from '../assets/mavs.png';
import '../styles/mavsHeader.css';
import { useState } from 'react';

const MavsHeader = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const getCurrentTabValue = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/draft-hub') return 1;
    if (path === '/mock-draft') return 2;
    return 0;
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
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
      
      <IconButton 
        className="menu-button"
        onClick={toggleDrawer(true)}
        sx={{ 
          color: 'white',
          position: 'absolute',
          right: '2rem',
          top: '2rem'
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            backgroundColor: '#002B5E',
            color: 'white',
            padding: '2rem'
          }
        }}
      >
        <div className="drawer-content">
          <h3>Menu</h3>
          <div className="drawer-links">
            <Link to="/" className="drawer-link" onClick={toggleDrawer(false)}>Home</Link>
            <Link to="/draft-hub" className="drawer-link" onClick={toggleDrawer(false)}>Draft Hub</Link>
            <Link to="/mock-draft" className="drawer-link" onClick={toggleDrawer(false)}>Mock Draft</Link>
          </div>
        </div>
      </Drawer>
      
      <div className="nav-container">
        <Tabs 
          value={getCurrentTabValue()} 
          textColor="inherit"
          sx={{
            '& .MuiTab-root': {
              color: 'white',
              fontSize: '1rem',
              minWidth: 120,
              '&.Mui-selected': {
                color: 'white'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'white'
            }
          }}
        >
          <Tab label="Home" component={Link} to="/" />
          <Tab label="Draft Hub" component={Link} to="/draft-hub" />
          <Tab label="Mock Draft" component={Link} to="/mock-draft" />
        </Tabs>
      </div>
    </header>
  );
};

export default MavsHeader;

// make the header a flex container and center the text
// put draft hub in a new font below the image
// make the options closer together and also responsive