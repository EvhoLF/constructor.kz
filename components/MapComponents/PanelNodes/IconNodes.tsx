import Icon from '@/components/UI/Icon';
import { Box, Typography } from '@mui/material'
import React from 'react'
import { init_NodePoint_data, NodePointData } from '../Nodes';


type IconNodesType = NodePointData & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sx: any;
  textSize?: number
};

const IconNodes = ({ textSize = 16, sx = {}, ...data }: IconNodesType) => {

  const { label, icon, colorPrimary, colorSecondary, isRequired, isLabelVisible, isIconVisible, isBorderVisible } = init_NodePoint_data(data);

  const borderColor = isRequired ? colorSecondary : colorPrimary;
  const backgroundColor = isRequired ? colorPrimary : colorSecondary;
  const textColor = isRequired ? colorSecondary : colorPrimary;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0.2,
        border: isBorderVisible ? '2px solid' : '0px solid',
        borderColor,
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor,
        color: textColor,
        padding: '2px 4px',
        ...sx,
      }}
    >
      {isIconVisible && icon && (<Icon icon={icon} style={{ width: 20, height: 20 }} />)}
      {isLabelVisible && (
        <Typography
          variant="h6"
          noWrap
          textAlign="center"
          sx={{
            fontSize: textSize,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  )
}

export default IconNodes