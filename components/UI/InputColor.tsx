'use client';
import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { usePickColor } from '@/hooks/usePickColor';

interface InputColorProps {
  color?: string;
  onChange?: (value: string) => void;
  absolute?: boolean;
  sx?: SxProps<Theme>;
}

const InputColor: React.FC<InputColorProps> = ({
  color = '#ffffff',
  onChange = () => {},
  absolute = false,
  sx = {},
}) => {
  const onChangeHandler = usePickColor(onChange);

  return (
    <Box
      sx={{
        position: absolute ? 'absolute' : 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        inset: 0,
        zIndex: 1,
        transition: 'transform 0.1s',
        '&:hover': {
          transform: 'scale(1.1)',
        },
        '&:focus-within .color-box': {
          outline: '1px solid #eeeeff80',
        },
        aspectRatio: '1/1',
        ...sx,
      }}
    >
      <input
        type="color"
        value={color}
        onChange={onChangeHandler}
        style={{
          position: 'absolute',
          opacity: 0,
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
      />
      <Box
        className="color-box"
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 1,
          backgroundColor: color,
          transition: '0.1s',
          border: '#444444 1px solid',
        }}
      />
    </Box>
  );
};

export default InputColor;
