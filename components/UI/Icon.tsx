import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { IconName, Icons } from '@/Icons';

interface IconProps extends SvgIconProps {
  icon: IconName | undefined | null | undefined;
}

const Icon: React.FC<IconProps> = ({ icon = 'noImage', ...props }) => {
  const DataIcon = Icons[icon ?? 'noImage'] as React.JSX.Element;
  return (
    <SvgIcon {...props}>
      {/* <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> */}
        {DataIcon}
      {/* </svg> */}
    </SvgIcon>
  );
};

export default React.memo(Icon);