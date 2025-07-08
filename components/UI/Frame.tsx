import React from 'react';
import { Card, CardProps } from '@mui/material';

// interface FrameProps extends BoxProps { }

const Frame = ({ children, sx, ...props }: CardProps) => {
  return (
    <Card sx={{
      borderRadius: '.75rem',
      padding: '.5rem',
      // border: '#6666ee 2px solid',
      backgroundColor: 'uiPanel.main',
      boxShadow: ' 0px 0px 10px 1px rgba(50, 50, 80, 0.2)',
      ...sx
    }} {...props}>
      {children}
    </Card>
  );
};

export default Frame;
