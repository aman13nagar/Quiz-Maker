const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

const getQuizResults = async (quizId) => {
  try {
    const result = await Result.findOne({ quizId }).populate('quizId').populate('userId');
    console.log(result);
    return result;
  } catch (error) {
    throw new Error('Error fetching quiz results');
  }
};

const submitQuiz = async (quizId, userId, answers) => {
    try {
      const quiz = await Quiz.findById({ _id: quizId });
      if (!quiz) {
        throw new Error('Quiz not found');
      }
  
      const processedAnswers = quiz.questions.map((question) => {
        const userAnswer = answers[question._id.toString()];
        const isCorrect = Array.isArray(userAnswer)
          ? question.correctAnswers.every((answer) => userAnswer.includes(answer)) && userAnswer.length === question.correctAnswers.length
          : question.correctAnswers.includes(userAnswer);
        
        return {
          questionId: question._id,
          selectedOptions: userAnswer ? userAnswer : [],
          isCorrect: !!isCorrect,
        };
      });
  
      const correctAnswers = processedAnswers.filter((ans) => ans.isCorrect).length;
      const score = (correctAnswers / quiz.questions.length) * 100;
  
      let result = await Result.findOne({ quizId, userId });
  
      if (result) {
        // Update existing result
        result.answers = processedAnswers;
        result.score = score;
        await result.save();
      } else {
        // Create new result
        result = new Result({
          quizId,
          userId,
          answers: processedAnswers,
          score,
        });
        await result.save();
      }
  
      return result;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw new Error('Error submitting quiz');
    }
};    

module.exports = {
  getQuizResults,
  submitQuiz,
};
