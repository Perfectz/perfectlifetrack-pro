/**
 * frontend/src/App.tsx
 * Main application component with theme provider, routing, and navigation
 */
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// import { Provider } from 'react-redux';
import { responsiveLightTheme, responsiveDarkTheme } from './theme';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import Link from '@mui/material/Link';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import { AuthProvider, useAuth } from './services/AuthContext';
import LoginButton from './components/LoginButton';
import UserMenu from './components/UserMenu';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthModalsProvider } from './hooks/useAuthModals';
// import { store } from './store';
// import { useAppDispatch } from './hooks/redux';
// import { loginSuccess } from './store/authSlice';
import { authService, msalInstance } from './services/authService';

// Header wrapper that only shows on certain routes
const ConditionalHeader = () => {
  const location = useLocation();
  const showHeader = location.pathname === '/' || location.pathname === '/dashboard';
  
  if (!showHeader) return null;
  
  return <Header height={220} marginBottom={3} />;
};

// Auth state initialization component
const AuthStateInitializer = () => {
  // const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Check if the user has an active session
    const account = authService.getAccount();
    
    if (account) {
      // If a user session exists, update the Redux store
      // dispatch(loginSuccess({
      //   name: account.name || null,
      //   email: account.username || null
      // }));
      console.log('User is authenticated:', account);
    }
    
    // Process redirect response if coming back from B2C login
    const handleRedirectResponse = async () => {
      try {
        // This will handle the redirect callback (if we're on the redirect page)
        const result = await msalInstance.handleRedirectPromise();
        
        if (result) {
          // If we have a result, update Redux with the user info
          // dispatch(loginSuccess({
          //   name: account.name || null,
          //   email: account.username || null
          // }));
          console.log('Redirect response handled:', result);
        }
      } catch (error) {
        console.error('Error handling redirect response:', error);
      }
    };
    
    handleRedirectResponse();
  // }, [dispatch]);
  }, []);
  
  return null; // This component doesn't render anything
};

// Navigation component with auth state
const Navigation = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const activeTheme = themeMode === 'light' ? responsiveLightTheme : responsiveDarkTheme;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const navigationLinks = [
    { text: 'Home', path: '/' },
    { text: 'Dashboard', path: '/dashboard', protected: true },
  ];

  // Filter links based on authentication state
  const availableLinks = navigationLinks.filter(
    link => !link.protected || isAuthenticated
  );

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {availableLinks.map(link => (
          <ListItem
            key={link.text}
            component={RouterLink}
            to={link.path}
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
        <ListItem>
          <Button
            onClick={toggleTheme}
            color="inherit"
            startIcon={themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            fullWidth
            sx={{ justifyContent: 'flex-start' }}
          >
            {themeMode === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      {/* Initialize the auth state */}
      <AuthStateInitializer />
      
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Perfect LifeTracker Pro - Vite Edition
            </Typography>
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {availableLinks.map(link => (
                  <Link
                    key={link.text}
                    component={RouterLink}
                    to={link.path}
                    color="inherit"
                    sx={{ textDecoration: 'none' }}
                  >
                    {link.text}
                  </Link>
                ))}
                <Button
                  onClick={toggleTheme}
                  color="inherit"
                  startIcon={themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                >
                  {themeMode === 'light' ? 'Dark' : 'Light'}
                </Button>
              </Box>
            )}
            {/* Auth components */}
            <Box sx={{ ml: 2 }}>
              {isAuthenticated ? <UserMenu /> : <LoginButton />}
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawer}
        </Drawer>
      </Box>

      <Container
        sx={{
          pt: 2,
          pb: 4,
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Add the header back, conditionally based on route */}
        <ConditionalHeader />
        
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </ErrorBoundary>
      </Container>
    </ThemeProvider>
  );
};

// Main App with Authentication Provider and Redux store
function App() {
  return (
    <AuthProvider>
      <AuthModalsProvider>
        <Navigation />
      </AuthModalsProvider>
    </AuthProvider>
  );
}

export default App;
