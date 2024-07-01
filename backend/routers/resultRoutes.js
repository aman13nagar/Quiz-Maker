const express = require('express');
const { getQuizResults, submitQuiz } = require('../utils/quizResults');
const {authMiddleware}=require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/quiz-results/:id',authMiddleware, async (req, res) => {
  try {
    const quizId = req.params.id;
    const result = await getQuizResults(quizId);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/submit-quiz',authMiddleware, async (req, res) => {
  try {
    const { id, userId, answers } = req.body;
    console.log(id,userId,answers);
    const result = await submitQuiz(id, userId, answers);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
