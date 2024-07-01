const Quiz = require('../models/Quiz');
const User=require('../models/User');

exports.createQuiz = async (req, res) => {
  const { title, questions } = req.body;
  console.log(title, questions);
  
  // Filter out questions with undefined correctAnswers
  const validQuestions = questions.filter(question => question.correctAnswers !== undefined);

  try {
    const newQuiz = new Quiz({
      title,
      questions: validQuestions,
      user: req.user.id,
    });

    const quiz = await newQuiz.save();
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.submitQuiz = async (req, res) => {
  const { answers } = req.body;
  console.log(answers);
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      console.log(question,index);
      console.log(question.correctAnswers[0],answers[index]);
      if (question.multipleCorrect===false&&question.correctAnswers[0] == answers[index]) {
        score++;
      }
    });
    console.log(score);
    res.json({ score });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// exports.getQuizByUserId = async (req, res) => {
//   try {
//     const userId = await User.findById(req.user.id);
//     console.log(userId);
//     // const quizzes = await Quiz.find({ user: userId }); 
    
//     // if (!quizzes.length) {
//     //   return res.status(200).json('No Quiz found!');
//     // }
    
//     // res.json(quizzes);
//     res.json(" ");
//   } catch (error) {
//     res.status(500).json(error); 
//   }
// }
