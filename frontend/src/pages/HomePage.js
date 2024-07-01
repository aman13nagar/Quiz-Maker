import React, { useContext, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import authService from '../services/authService';

const StyledContainer = styled(Container)({
  padding: '40px 20px',
  textAlign: 'center',
});

const HeroSection = styled('div')({
  padding: '40px 0',
  backgroundColor: '#1976d2', // Primary color
  color: '#fff',
  borderRadius: '8px',
});

const FeaturesSection = styled('div')({
  padding: '40px 0',
  backgroundColor: '#f0f4f8',
  borderRadius: '8px',
  marginTop: '20px',
});

const FeaturePaper = styled(Paper)({
  padding: '20px',
  textAlign: 'center',
  height: '100%',
  backgroundColor: '#e3f2fd', // Light primary color
  color: '#1976d2',
});

const TipsSection = styled('div')({
  padding: '40px 0',
  marginTop: '20px',
  backgroundColor: '#e3f2fd', // Light primary color
  borderRadius: '8px',
});

const TipCard = styled(Card)({
  margin: '20px',
  backgroundColor: '#fff',
});

const TestimonialsSection = styled('div')({
  padding: '40px 0',
  marginTop: '20px',
  backgroundColor: '#e3f2fd', // Light primary color
  borderRadius: '8px',
});

const TestimonialCard = styled(Card)({
  margin: '20px',
  backgroundColor: '#fff',
});

const CTAButton = styled(Button)({
  margin: '20px',
  padding: '10px 20px',
  backgroundColor: '#ff4081', // Secondary color
  color: '#fff',
  '&:hover': {
    backgroundColor: '#f50057',
  },
});

const HomePage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [loading,isLoading]=useState(true);

  useEffect(() => {
    const getUser = async () => {
      if (isLoggedIn) {
        const response = await authService.getUser();
        setUser(response); // Ensure the response structure matches this
        isLoading(false);
      }
    };

    getUser();
  }, [isLoggedIn]);
  if(loading&&isLoggedIn){
    return (
      <CircularProgress size={24} />
    )
  }

  return (
    <StyledContainer>
      <HeroSection>
        <Typography variant="h2" gutterBottom>
          {isLoggedIn ? `Hey, ${user.firstName}` : 'Welcome to Quiz Maker'}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Create, take, and share quizzes with ease.
        </Typography>
        {!isLoggedIn ? (
          <CTAButton
            variant="contained"
            size="large"
            component={Link}
            to="/signup"
          >
            Get Started
          </CTAButton>
        ) : (
          <>
            <CTAButton
              variant="contained"
              size="large"
              component={Link}
              to="/admin"
            >
              Create a Quiz
            </CTAButton>
            <CTAButton
              variant="outlined"
              size="large"
              component={Link}
              to="/quiz"
            >
              Take a Quiz
            </CTAButton>
          </>
        )}
      </HeroSection>

      <FeaturesSection>
        <Typography variant="h4" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FeaturePaper>
              <Typography variant="h6" gutterBottom>
                Easy to Use
              </Typography>
              <Typography>
                Our intuitive interface allows you to create quizzes quickly and easily.
              </Typography>
            </FeaturePaper>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeaturePaper>
              <Typography variant="h6" gutterBottom>
                Customizable
              </Typography>
              <Typography>
                Customize your quizzes with different question types and themes.
              </Typography>
            </FeaturePaper>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeaturePaper>
              <Typography variant="h6" gutterBottom>
                Shareable
              </Typography>
              <Typography>
                Share your quizzes with friends and track their results.
              </Typography>
            </FeaturePaper>
          </Grid>
        </Grid>
      </FeaturesSection>

      {isLoggedIn && (
        <TipsSection>
          <Typography variant="h4" gutterBottom>
            Quiz Tips & Tricks
          </Typography>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={4}>
              <TipCard>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    "Keep your questions clear and concise to ensure participants understand them easily."
                  </Typography>
                </CardContent>
              </TipCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <TipCard>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    "Use a mix of question types to keep your quizzes engaging and challenging."
                  </Typography>
                </CardContent>
              </TipCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <TipCard>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    "Add images and videos to make your quizzes more interactive and visually appealing."
                  </Typography>
                </CardContent>
              </TipCard>
            </Grid>
          </Grid>
        </TipsSection>
      )}

      {!isLoggedIn && (
        <TestimonialsSection>
          <Typography variant="h4" gutterBottom>
            What Our Users Say
          </Typography>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={4}>
              <TestimonialCard>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    "Quiz Maker has revolutionized the way we study! The ease of creating and sharing quizzes is amazing."
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    - Alex P.
                  </Typography>
                </CardContent>
              </TestimonialCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <TestimonialCard>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    "I love the customization options. It allows me to create quizzes that are engaging and fun!"
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    - Jamie L.
                  </Typography>
                </CardContent>
              </TestimonialCard>
            </Grid>
          </Grid>
        </TestimonialsSection>
      )}
    </StyledContainer>
  );
};

export default HomePage;




