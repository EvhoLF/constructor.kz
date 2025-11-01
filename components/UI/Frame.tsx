'use client'
import React, { useContext } from 'react';
import { Card, CardProps } from '@mui/material';
import { ThemeContext } from '@/hooks/ThemeRegistry';

const Frame = ({ children, sx, elevation = 0, ...props }: CardProps) => {
  const { mode } = useContext(ThemeContext);

  return (
    <Card
      elevation={elevation} // По умолчанию 0, но можно переопределить
      sx={(theme) => ({
        '--Paper-overlay': 'none',
        '--Paper-shadow': 'none',
        borderRadius: '.75rem',
        padding: '.5rem',
        backgroundImage: 'none',
        background: 'uiPanel.main',
        border:
          mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(50, 50, 50, 0.15)',
        boxShadow: `drop-shadow(${mode === 'dark' ? '0px 4px 10px rgba(0, 0, 0, 0.5)' : '0px 3px 7px rgba(0, 0, 0, 0.2)'})`,
        // Дублируем на случай, если вариант не применится
        ...(elevation === 0 && { '--Paper-overlay': 'none' }),
        ...((typeof sx === 'function' ? sx(theme) : sx) as object),
      })}
      {...props}
    >
      {children}
    </Card>
  );
};

export default Frame;