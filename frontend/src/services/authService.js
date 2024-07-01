import api from '../utils/api';

const API_URL = '/auth';

const isLoggedIn = () => !!localStorage.getItem('token');

const logout = () => {
  localStorage.removeItem('token');
};

const signup = async (firstName, lastName, email, password) => {
  try {
    const res = await api.post(`${API_URL}/signup`, { firstName, lastName, email, password });
    localStorage.setItem('token', res.data.token);
  } catch (error) {
    console.error('Error during signup:', error);
    throw new Error('Signup failed');
  }
};

const login = async (email, password) => {
  try {
    const res = await api.post(`${API_URL}/login`, { email, password });
    localStorage.setItem('token', res.data.token);
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Login failed');
  }
};

const getUser = async () => {
  try {
    const res = await api.get(`${API_URL}/user`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user data');
  }
};

export default {
  signup,
  login,
  getUser,
  isLoggedIn,
  logout,
};

