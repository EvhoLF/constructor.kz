import React from 'react';
import { Switch, SwitchProps, styled } from '@mui/material';
import Icon from './Icon'; // твой компонент
import { IconName } from '@/Icons';

interface SwitchIconProps extends SwitchProps {
  iconOff: IconName;
  iconOn: IconName;
}

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      transform: 'translateX(22px)',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.applyStyles?.('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const SwitchIcon: React.FC<SwitchIconProps> = ({
  iconOff,
  iconOn,
  ...props
}) => {
  const checked = Boolean(props.checked);
  return (
    <StyledSwitch
      {...props}
      icon={
        <div className="thumb-content">
          <Icon icon={iconOff} fontSize="small" htmlColor="#fff" />
        </div>
      }
      checkedIcon={
        <div className="thumb-content">
          <Icon icon={iconOn} fontSize="small" htmlColor="#fff" />
        </div>
      }
    />
  );
};

export default SwitchIcon;
