import React from 'react';
import { Grid, Typography, Box, Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './FeatureSection.css'; 

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Box className="feature-card">
      <Avatar className="feature-avatar" style={{fontSize:''}}>
        {icon}
      </Avatar>

      <Box>
        <Typography fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

const FeatureSection = () => {
  const features = [
    {
      icon: <StarIcon color="primary" />,
      title: 'Trending Styles',
      description: 'from Top Brands',
    },
    {
      icon: <LocalOfferIcon color="primary" />,
      title: 'Best Prices',
      description: 'on Top Products',
    },
    {
      icon: <CheckCircleIcon color="primary" />,
      title: 'Easy Returns',
      description: 'on every order',
    },
  ];

  return (
    <Grid container spacing={1} justifyContent="center" sx={{ padding: '40px 0', backgroundColor: '' }}>
      {features.map((feature, index) => (
        <Grid item key={index} xs={1} sm={2} md={4}>
          <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
        </Grid>
      ))}
    </Grid>
  );
};

export default FeatureSection;
