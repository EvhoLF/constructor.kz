import { Box, BoxProps } from '@mui/material';
import React from 'react';

interface LineProps extends BoxProps {
  color?: string;
  thickness?: number;
  variant?: 'solid' | 'dashed' | 'dotted';
  orientation?: 'horizontal' | 'vertical';
}

const Line: React.FC<LineProps> = ({
  color = '#ccc',
  thickness = 1,
  variant = 'solid',
  orientation = 'horizontal',
  width = '100%',
  height = '100%',
  ...rest
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <Box
      sx={{
        position: 'relative',
        ...(isHorizontal ? { width } : { height })
      }}
      {...rest}
    >
      <Box
        sx={{
          position: 'absolute',
          top: isHorizontal ? '50%' : 0,
          left: isHorizontal ? 0 : '50%',
          transform: isHorizontal ? 'translateY(-50%)' : 'translateX(-50%)',
          width: isHorizontal ? '100%' : `${thickness}px`,
          height: isHorizontal ? `${thickness}px` : '100%',
          borderTop: isHorizontal ? `${thickness}px ${variant} ${color}` : 'none',
          borderLeft: !isHorizontal ? `${thickness}px ${variant} ${color}` : 'none',
        }}
      />
    </Box >
  );
};

export default Line;
