import { FC, ReactNode } from 'react';
import { InputAdornment, SxProps, TextField, TextFieldProps } from '@mui/material';
import Icon from './Icon';
import { IconName } from '@/Icons';

type InputTextProps = TextFieldProps & {
  startAdornment?: ReactNode,
  endAdornment?: ReactNode,
  startIcon?: IconName,
  endIcon?: IconName,
  labelActive?: boolean,
  sx?: SxProps | undefined,
}

const InputText: FC<InputTextProps> = ({ labelActive = false, startAdornment, endAdornment, startIcon, endIcon, sx, ...props }) => {

  const InputLabelProps = labelActive ? { shrink: true } : {}

  const getAdornment = (position: 'start' | 'end', icon?: IconName, adornment?: ReactNode,) =>
    icon ? <InputAdornment position={position}><Icon icon={icon} /></InputAdornment>
      : adornment && <InputAdornment position={position}>{adornment}</InputAdornment>;

  const slotProps = {
    input: {
      startAdornment: getAdornment('start', startIcon, startAdornment,),
      endAdornment: getAdornment('end', endIcon, endAdornment),
    },
  };

  return (
    <TextField InputLabelProps={InputLabelProps} slotProps={slotProps} {...props} sx={{
      '& .MuiInputBase-adornedEnd': {
        paddingLeft: startAdornment ? '5px' : undefined,
        paddingRight: endAdornment ? '5px' : undefined,
      },
      ...sx
    }} />
  );
};

export default InputText;