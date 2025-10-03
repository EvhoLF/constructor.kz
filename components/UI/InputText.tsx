import { FC, ReactNode } from 'react';
import { InputAdornment, SxProps, TextField, TextFieldProps, Theme } from '@mui/material';
import Icon from './Icon';
import { IconName } from '@/Icons';

type InputTextProps = Omit<TextFieldProps, 'sx'> & {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  startIcon?: IconName;
  endIcon?: IconName;
  labelActive?: boolean;
  sx?: SxProps<Theme>;
};

const InputText: FC<InputTextProps> = ({ 
  labelActive = false, 
  startAdornment, 
  endAdornment, 
  startIcon, 
  endIcon, 
  sx, 
  ...props 
}) => {
  const InputLabelProps = labelActive ? { shrink: true } : {};

  const getAdornment = (position: 'start' | 'end', icon?: IconName, adornment?: ReactNode) =>
    icon ? (
      <InputAdornment position={position}>
        <Icon icon={icon} />
      </InputAdornment>
    ) : (
      adornment && (
        <InputAdornment position={position}>
          {adornment}
        </InputAdornment>
      )
    );

  const slotProps = {
    input: {
      startAdornment: getAdornment('start', startIcon, startAdornment),
      endAdornment: getAdornment('end', endIcon, endAdornment),
    },
  };

  // Упрощаем стили чтобы избежать сложных типов
  const baseStyles = {
    '& .MuiInputBase-adornedEnd': {
      paddingLeft: startAdornment ? '5px' : undefined,
      paddingRight: endAdornment ? '5px' : undefined,
    },
  };

  return (
    <TextField 
      InputLabelProps={InputLabelProps} 
      slotProps={slotProps} 
      {...props} 
      sx={[baseStyles, ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
};

export default InputText;