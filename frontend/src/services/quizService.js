import api from '../utils/api';

const API_URL = '/quizzes';

const createQuiz = async (title,questions) => {
  console.log(localStorage.getItem('token'))
  console.log(title,questions);
  const res = await api.post(API_URL,{title,questions}, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return res.data;
};

const getAllQuizzes = async () => {
  const res = await api.get(API_URL);
  return res.data;
};

const getQuiz = async (id) => {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
};

const submitQuiz = async (id,userId, answers) => {
  console.log(id,answers);
  const res = await api.post(`/submit-quiz`, {id,userId, answers },{
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return res.data;
};
const getQuizResult=async(id)=>{
  const res=await api.get(`/quiz-results/${id}`,{
    headers:{
      'x-auth-token':localStorage.getItem('token'),
    }
  })
  return res.data;
}
const getQuizzesByUserId = async () => {
  const response = await api.get(`${API_URL}/user`);
  return response.data;
};
export default {
  createQuiz,
  getAllQuizzes,
  getQuiz,
  submitQuiz,
  getQuizResult,
  getQuizzesByUserId
};
