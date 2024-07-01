const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  questionType:String,
  multipleCorrect:Boolean,
  options: {
    type: [String],
  },
  correctAnswers: {
    type: [String],
    required: true,
  },
});

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: [QuestionSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Quiz', QuizSchema);
