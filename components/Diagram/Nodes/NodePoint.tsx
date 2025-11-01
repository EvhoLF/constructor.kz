'use client';

import { memo } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { Handle, NodeResizer, Position } from '@xyflow/react';
import Icon from '@/components/UI/Icon';
import { NODE_MIN_HEIGHT, NODE_MIN_WIDTH, NodePointData } from '@/components/Diagram/Nodes';

type Props = {
  data: NodePointData;
  selected: boolean;
};

const NodePoint = ({ data, selected }: Props) => {
  const {
    label = '',
    colorPrimary = '#ffffff',
    colorSecondary = '#000000',
    icon = null,
    isLabelVisible = true,
    isIconVisible = false,
    isBorderVisible = true,
    isRequired = true,
    description = '',
  } = data;

  const borderColor = isRequired ? colorSecondary : colorPrimary;
  const backgroundColor = isRequired ? colorPrimary : colorSecondary;
  const textColor = isRequired ? colorSecondary : colorPrimary;

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={NODE_MIN_WIDTH}
        minHeight={NODE_MIN_HEIGHT}
      />
      <Handle type="target" position={Position.Top} style={{ width: '100%', top: '2.2px', opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ width: '100%', bottom: '2px', opacity: 0 }} />

      <Tooltip title={description} enterDelay={500} leaveDelay={200} disableInteractive>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
            border: isBorderVisible ? '2px solid' : '0px solid',
            borderColor,
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxSizing: 'border-box',
            backgroundColor,
            color: textColor,
            padding: '2px',
          }}
        >
          {isIconVisible && icon && (<Icon icon={icon} style={{ width: 25, height: 25 }} />)}
          {isLabelVisible && (
            <Typography
              variant="h6"
              noWrap
              textAlign="center"
              sx={{
                fontSize: 20,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {label}
            </Typography>
          )}
        </Box>
      </Tooltip >
    </>
  );
};

export default memo(NodePoint);
