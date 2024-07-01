const express = require('express');
const { createQuiz, getAllQuizzes, getQuiz, submitQuiz } = require('../controllers/quizController');
const {authMiddleware} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/',authMiddleware, createQuiz);
router.get('/', getAllQuizzes);
router.get('/:id', getQuiz);
router.post('/:id/submit', authMiddleware, submitQuiz);
// router.get('/user',authMiddleware,getQuizByUserId);

module.exports = router;
