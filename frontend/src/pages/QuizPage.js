import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';
import quizService from '../services/quizService';
import img from '../assets/images/nguyen-dang-hoang-nhu-qDgTQOYk6B8-unsplash.jpg'

const StyledContainer = styled(Container)({
  padding: '40px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
});

const StyledCard = styled(Card)({
  maxWidth: 345,
  margin: '20px',
  borderRadius: '15px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
  transition: '0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const StyledCardMedia = styled(CardMedia)({
  height: 180,
});

const ControlsContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  flexWrap: 'wrap',
});

const ControlItem = styled('div')({
  margin: '10px',
  flex: '1',
});

const ITEMS_PER_PAGE = 9;

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sortOrder, setSortOrder] = useState('title');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
      setFilteredQuizzes(data);
    };
    fetchQuizzes();
  }, []);

  const handleQuizClick = (id) => {
    navigate(`/quiz/${id}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterQuizzes(value, category, difficulty, sortOrder);
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setCategory(value);
    filterQuizzes(searchTerm, value, difficulty, sortOrder);
  };

  const handleDifficultyChange = (event) => {
    const value = event.target.value;
    setDifficulty(value);
    filterQuizzes(searchTerm, category, value, sortOrder);
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortOrder(value);
    filterQuizzes(searchTerm, category, difficulty, value);
  };

  const filterQuizzes = (searchTerm, category, difficulty, sortOrder) => {
    let filtered = quizzes.filter((quiz) => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm);
      const matchesCategory = category === 'All' || quiz.category === category;
      const matchesDifficulty = difficulty === 'All' || quiz.difficulty === difficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    if (sortOrder === 'title') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'date') {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === 'popularity') {
      filtered = filtered.sort((a, b) => b.popularity - a.popularity);
    }

    setFilteredQuizzes(filtered);
  };

  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <StyledContainer>
      <Typography variant="h3" gutterBottom align="center" style={{ marginBottom: '40px', color: '#3f51b5' }}>
        Available Quizzes
      </Typography>
      <ControlsContainer>
        <ControlItem>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
          />
        </ControlItem>
        <ControlItem>
          <TextField
            select
            label="Category"
            value={category}
            onChange={handleCategoryChange}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Math">Math</MenuItem>
            <MenuItem value="History">History</MenuItem>
            {/* Add more categories as needed */}
          </TextField>
        </ControlItem>
        <ControlItem>
          <TextField
            select
            label="Difficulty"
            value={difficulty}
            onChange={handleDifficultyChange}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </TextField>
        </ControlItem>
        <ControlItem>
          <TextField
            select
            label="Sort By"
            value={sortOrder}
            onChange={handleSortChange}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="popularity">Popularity</MenuItem>
          </TextField>
        </ControlItem>
      </ControlsContainer>
      <Grid container spacing={4}>
        {paginatedQuizzes.map((quiz, index) => (
          <Grid item key={quiz._id} xs={12} sm={6} md={4}>
            <Tooltip title={`Difficulty: ${quiz.difficulty}`} placement="top">
              <StyledCard onClick={() => handleQuizClick(quiz._id)}>
                <CardActionArea>
                  <StyledCardMedia
                    image={img}
                    title={quiz.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                      {`Quiz #${index + 1}`}
                    </Typography>
                    <Typography variant="h6" component="div" style={{ color: '#3f51b5' }}>
                      {quiz.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="div">
                      {quiz.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </StyledCard>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />
    </StyledContainer>
  );
};

export default QuizPage;



