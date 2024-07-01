import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
  LinearProgress,
  Tooltip,
  IconButton,
  CircularProgress,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import quizService from '../services/quizService';
import authService from '../services/authService';
import { AccessTime, Report, PlayArrow } from '@mui/icons-material';

const StyledContainer = styled(Container)({
  marginTop: '20px',
  padding: '20px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: '16px',
  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  },
});

const StyledTypography = styled(Typography)({
  marginBottom: '20px',
  color: '#333',
  textAlign: 'center',
});

const StyledButton = styled(Button)({
  marginTop: '20px',
  fontWeight: 'bold',
  width: '100%',
  padding: '10px',
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  color: '#fff',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
  },
});

const StartButton = styled(Button)({
  marginTop: '20px',
  fontWeight: 'bold',
  width: '50%',
  padding: '10px',
  background: 'linear-gradient(135deg, #8bc34a 0%, #4caf50 100%)',
  color: '#fff',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
  },
});

const Timer = styled(Typography)({
  fontSize: '1.7rem',
  color: '#ff1744',
  margin: '10px 0',
  marginTop:'-10px',
  textAlign: 'center',
  fontWeight: 'bold',
});

const QuizTaking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const data = await quizService.getQuiz(id);
      setQuiz(data);
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      handleSubmit();
    }
    return () => clearInterval(timerRef.current);
  }, [quizStarted, timeLeft]);

  const handleAnswerChange = (qIndex, value, isMultipleCorrect) => {
    if (isMultipleCorrect) {
      const currentAnswers = answers[qIndex] || [];
      if (currentAnswers.includes(value)) {
        setAnswers({
          ...answers,
          [qIndex]: currentAnswers.filter((answer) => answer !== value),
        });
      } else {
        setAnswers({
          ...answers,
          [qIndex]: [...currentAnswers, value],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [qIndex]: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    if (timeLeft > 0) {
      setWarningOpen(true);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    const userId = (await authService.getUser())._id;
    console.log(userId);
    const response = await quizService.submitQuiz(id, userId, answers);
    navigate(`/result/${id}`);
  };

  const handleReportOpen = () => {
    setReportOpen(true);
  };

  const handleReportClose = () => {
    setReportOpen(false);
    setReportText('');
  };

  const handleReportSubmit = () => {
    console.log('Report submitted:', reportText);
    handleReportClose();
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <StyledContainer>
      {quiz ? (
        <>
          <StyledTypography variant="h4">{quiz.title}</StyledTypography>
          {!quizStarted ? (
            <StartButton
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              onClick={handleStartQuiz}
            >
              Start Quiz
            </StartButton>
          ) : (
            <>
              <Timer>
                <AccessTime /> {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
              </Timer>
              <form onSubmit={handleSubmit}>
                {quiz.questions.map((q, qIndex) => (
                  <div key={qIndex} style={{ marginBottom: '20px' }}>
                    <Typography variant="h6">
                      Q{qIndex + 1}: {q.question}
                      <Tooltip title="Report an issue with this question">
                        <IconButton onClick={handleReportOpen}>
                          <Report color="error" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    {q.multipleCorrect ? (
                      q.options.map((option, oIndex) => (
                        <FormControlLabel
                          key={oIndex}
                          control={
                            <Checkbox
                              checked={answers[q._id]?.includes(option) || false}
                              onChange={() => handleAnswerChange(q._id, option, true)}
                            />
                          }
                          label={option}
                        />
                      ))
                    ) : (
                      <RadioGroup
                        value={answers[q._id] || ''}
                        onChange={(e) => handleAnswerChange(q._id, e.target.value, false)}
                      >
                        {q.options.map((option, oIndex) => (
                          <FormControlLabel key={oIndex} value={option} control={<Radio />} label={option} />
                        ))}
                      </RadioGroup>
                    )}
                  </div>
                ))}
                <StyledButton type="submit" variant="contained" color="primary">
                  Submit
                </StyledButton>
                <LinearProgress
                  variant="determinate"
                  value={(Object.keys(answers).length / quiz.questions.length) * 100}
                  style={{ marginTop: '20px' }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={(Object.keys(answers).length / quiz.questions.length) * 100}
                    size={60}
                    thickness={5}
                  />
                </Box>
              </form>
              <Dialog
                open={warningOpen}
                onClose={() => setWarningOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">Submit Quiz</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    You still have time left. Are you sure you want to submit the quiz?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setWarningOpen(false)} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={submitQuiz} color="primary" autoFocus>
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog
                open={reportOpen}
                onClose={handleReportClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Report an Issue</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please describe the issue with this question.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="report"
                    label="Issue"
                    type="text"
                    fullWidth
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleReportClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleReportSubmit} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </>
      ) : (
        <CircularProgress />
      )}
    </StyledContainer>
  );
};

export default QuizTaking;






