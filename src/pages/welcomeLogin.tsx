import dallas from '../assets/dallas.png';
import { 
  Box, 
  TextField, 
  Button, 
  Container, 
  Paper, 
  Typography,
} from '@mui/material';
import { useState } from 'react';

const WelcomeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement login logic here
    console.log('Login attempt with:', { email, password });
  };

  return (
    <Box 
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          display: 'flex',
          mt: 16,
          mb: 0
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2
          }}
        >
          <Typography 
            component="h1" 
            sx={{ 
              fontSize: '1.75rem',
              fontWeight: 400,
              mb: 1
            }}
          >
            Welcome to Mavs Draft Hub
          </Typography>
          
          <Typography 
            sx={{ 
              color: 'text.secondary',
              mb: 3,
              textAlign: 'center'
            }}
          >
            Your one-stop destination for NBA draft information
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              width: '100%',
              '& .MuiTextField-root': { mb: 2 }
            }}
          >
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              variant="outlined"
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                bgcolor: '#00538C',
                '&:hover': {
                  bgcolor: '#002B5E'
                },
                textTransform: 'none',
                py: 1
              }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Container>
      <Box sx={{ mt: 'auto', bgcolor: '#00234B' }}>
        <Box 
          component="img" 
          src={dallas} 
          alt="Mavs Logo" 
          sx={{ 
            width: '100%',
            display: 'block'
          }} 
        />
      </Box>
    </Box>
  );
};

export default WelcomeLogin;