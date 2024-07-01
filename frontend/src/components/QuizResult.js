import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CheckCircle, Cancel, EmojiEvents } from '@mui/icons-material';
import quizService from '../services/quizService';
import 'chart.js/auto';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

const ResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      const data = await quizService.getQuizResult(id);
      console.log(data);
      setQuizResult(data);
    };
    fetchResult();
  }, [id]);

  const handleRetry = () => {
    navigate(`/quiz/${id}`);
  };

  const handleHome = () => {
    navigate('/');
  };

  if (!quizResult) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const correctAnswers = quizResult.answers.filter((a) => a.isCorrect).length;
  const incorrectAnswers = quizResult.answers.length - correctAnswers;
  const scorePercentage = (correctAnswers / quizResult.answers.length) * 100;

  const data = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        label: 'Quiz Results',
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  const getPerformanceBadge = () => {
    if (scorePercentage === 100) {
      return <EmojiEvents style={{ color: '#ffd700' }} />;
    } else if (scorePercentage >= 75) {
      return <EmojiEvents style={{ color: '#c0c0c0' }} />;
    } else if (scorePercentage >= 50) {
      return <EmojiEvents style={{ color: '#cd7f32' }} />;
    }
    return null;
  };

  return (
    <StyledContainer>
      <StyledTypography variant="h4">Quiz Results</StyledTypography>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px', position: 'relative' }}>
        <Typography variant="h6">{quizResult.quizId.title}</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">Score: {scorePercentage}%</Typography>
          <Box>{getPerformanceBadge()}</Box>
        </Box>
        <LinearProgress variant="determinate" value={scorePercentage} style={{ marginTop: '10px' }} />
        <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
          Correct Answers: {correctAnswers}
        </Typography>
        <Typography variant="subtitle1">Incorrect Answers: {incorrectAnswers}</Typography>
      </Paper>
      <Box height={400}>
        <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      </Box>
      <Box style={{ marginTop: '20px' }}>
        <Typography variant="h6">Detailed Results</Typography>
        <List>
          {quizResult.quizId.questions.map((question, index) => {
            const answer = quizResult.answers.find(
              (a) => a.questionId === question._id
            );
            return (
              <ListItem key={question._id} style={{ marginBottom: '10px' }}>
                <ListItemIcon>
                  {answer.isCorrect ? (
                    <CheckCircle style={{ color: 'green' }} />
                  ) : (
                    <Cancel style={{ color: 'red' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={`${index + 1}. ${question.question}`}
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" color="textPrimary">
                        Your answer: {answer.selectedOptions.join(', ')}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Correct answer: {question.correctAnswers.join(', ')}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={6}>
          <StyledButton onClick={handleRetry}>Retry Quiz</StyledButton>
        </Grid>
        <Grid item xs={6}>
          <StyledButton onClick={handleHome}>Go to Home</StyledButton>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default ResultPage;



