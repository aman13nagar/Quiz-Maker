
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import QuizTaking from './components/QuizTaking';
import ResultPage from './components/QuizResult';
import { AuthProvider } from './contexts/authContext';
import PrivateRoute from './routes/privateRoute';

const App = () => {
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/quiz/:id" element={<PrivateRoute><QuizTaking/></PrivateRoute>}/>
            <Route path="/result/:id" element={<PrivateRoute><ResultPage/></PrivateRoute>}/>
          </Routes>
          <Footer/>
        </AuthProvider>
    </ThemeProvider>
  );
};

export default App;


