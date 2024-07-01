import React, { useState, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import { AuthContext } from '../contexts/authContext';

const CustomAppBar = styled(AppBar)({
  boxShadow: 'none',
});

const CustomToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const Title = styled(Typography)({
  fontWeight: 'bold',
});

const CustomButton = styled(Button)({
  margin: '0 10px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

const Header = () => {
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(theme.palette.mode === 'dark');
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleThemeChange = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.style.backgroundColor = darkMode ? '#fff' : '#303030';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <CustomAppBar position="static" color={darkMode ? 'default' : 'primary'}>
      <CustomToolbar>
        <Title variant="h6" color={darkMode ? 'inherit' : 'white'}>
          Quiz Maker
        </Title>
        <div>
          <CustomButton component={Link} to="/" color="inherit">
            Home
          </CustomButton>
          {isLoggedIn&&(
            <CustomButton component={Link} to="/quiz" color="inherit">
              Quizzes
            </CustomButton>
          )}
          {isLoggedIn && (
            <CustomButton component={Link} to="/admin" color="inherit">
              Add Quiz
            </CustomButton>
          )}
          {isLoggedIn ? (
            <CustomButton onClick={handleLogout} color="inherit">
              Logout
            </CustomButton>
          ) : (
            <CustomButton component={Link} to="/login" color="inherit">
              Login
            </CustomButton>
          )}
          <IconButton onClick={handleThemeChange} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>
      </CustomToolbar>
    </CustomAppBar>
  );
};

export default Header;


