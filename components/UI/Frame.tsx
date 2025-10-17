'use client'
import React, { useContext } from 'react';
import { Card, CardProps } from '@mui/material';
import { ThemeContext } from '@/hooks/ThemeRegistry';

const Frame = ({ children, sx, ...props }: CardProps) => {
  const { mode } = useContext(ThemeContext);

  return (
    <Card
      sx={(theme) => ({
        borderRadius: '.75rem',
        padding: '.5rem',
        backgroundImage: 'none !important',
        background: theme.palette.uiPanel.main, // ✅ доступ через theme
        border:
          mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(50, 50, 50, 0.15)',
        boxShadow:
          mode === 'dark'
            ? '0px 4px 10px rgba(0, 0, 0, 0.5)'
            : '0px 3px 7px rgba(0, 0, 0, 0.2)',
        ...((typeof sx === 'function' ? sx(theme) : sx) as object),
      })}
      {...props}
    >
      {children}
    </Card>
  );
};

export default Frame;
