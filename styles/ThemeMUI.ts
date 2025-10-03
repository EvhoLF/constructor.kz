'use client';
import { createTheme } from '@mui/material/styles';
import { palette } from './variables';

const ThemeMUI = createTheme({
  palette: {
    mode: 'light',
    ...palette,
  },
  components: {
    MuiTextField: {
      variants: [
        {
          props: { size: 'mediumSmall' },
          style: {
            '& .MuiInputBase-input': {
              padding: '.75rem .5rem',
              fontSize: '1rem',
            },
            '& label': {
              transform: 'translate(14px, 12px) scale(1)',
              '&.MuiInputLabel-shrink, &.Mui-focused': {
                transform: 'translate(14px, -9px) scale(0.75)',
              },
            },
          },
        },
      ],
    },
  },
});

export default ThemeMUI;
