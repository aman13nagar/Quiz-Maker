import axios from 'axios';
const api = axios.create({
  baseURL: 'https://quiz-maker-ashy.vercel.app/api', 
});


export default api;
