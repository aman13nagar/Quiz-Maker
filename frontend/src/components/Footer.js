import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { styled } from '@mui/system';

const FooterBar = styled(AppBar)({
  top: 'auto',
  bottom: 0,
  backgroundColor: '#3f51b5', // Change the color as needed
  padding: '10px 0',
});

const FooterToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
});

const SocialMediaContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const BackToTopButton = styled(IconButton)({
  color: '#fff',
  '&:hover': {
    backgroundColor: '#303f9f', // Change hover color as needed
  },
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Footer = () => {
  return (
    <FooterBar position="static">
      <FooterToolbar>
        <Typography variant="body1" style={{ flexGrow: 1, color: '#fff' }}>
          &copy; 2024 Quiz Maker. All rights reserved.
        </Typography>
        <SocialMediaContainer>
          <IconButton
            color="inherit"
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            color="inherit"
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
          </IconButton>
        </SocialMediaContainer>
        <BackToTopButton onClick={scrollToTop}>
          <ArrowUpwardIcon />
        </BackToTopButton>
      </FooterToolbar>
    </FooterBar>
  );
};

export default Footer;

