/* eslint-disable react/prop-types */
import React from 'react';
import { Typography, Box } from '@mui/material';
// import { tokens } from "../theme";
import { t } from 'i18next';

// eslint-disable-next-line arrow-body-style
const Header = ({ title, subtitle }) => {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: '5px' }} style={{ textTransform: 'capitalize' }}>
        {t('title')}
      </Typography>
      <Typography variant="body1">{t('subtitle')}</Typography>
    </Box>
  );
};

export default Header;
