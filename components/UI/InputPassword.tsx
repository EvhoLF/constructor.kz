'use client'
import { FC, ReactNode, useState } from 'react';
import { TextFieldProps } from '@mui/material';
import { IconName } from '@/Icons';
import IconSwitch from './IconSwitch';
import InputText from './InputText';

type InputPassword = TextFieldProps & {
  startAdornment?: ReactNode,
  endAdornment?: ReactNode,
  startIcon?: IconName,
  endIcon?: IconName,
  labelActive?: boolean,
}

const InputPassword: FC<InputPassword> = ({ ...props }) => {

  const [secure, setSecure] = useState(true);

  const setSwitch = () => setSecure(e => !e);

  return (
    <InputText {...props} type={secure ? 'password' : 'text'} endAdornment={<IconSwitch value={secure} onClick={setSwitch} />} />
  );
};

export default InputPassword;