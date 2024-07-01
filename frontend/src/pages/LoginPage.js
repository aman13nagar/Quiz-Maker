import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/system';
import { AuthContext } from '../contexts/authContext';

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f0f4f8',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const FormContainer = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '400px',
});

const StyledTextField = styled(TextField)({
  margin: '10px 0',
});

const LoginButton = styled(Button)({
  margin: '20px 0',
  padding: '10px',
});

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <FormContainer onSubmit={handleSubmit}>
        <StyledTextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <StyledTextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        <LoginButton type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </LoginButton>
      </FormContainer>
      <Button
        component={Link}
        to="/signup"
        variant="outlined"
        color="primary"
      >
        Don't have an account? Sign Up
      </Button>
    </StyledContainer>
  );
};

export default LoginPage;



