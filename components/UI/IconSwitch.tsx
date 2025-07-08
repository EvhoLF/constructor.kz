import { IconButton, SxProps } from '@mui/material'
import React from 'react'
import Icon from './Icon'
import { IconName } from '@/Icons'


interface IconSwitch {
  value?: boolean,
  iconOn?: IconName,
  iconOff?: IconName,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconProps?: any,
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
  colorOn?: string | null,
  colorOff?: string | null,
  brightnessOn?: number | null,
  brightnessOff?: number | null,
  sx?: SxProps | undefined
}

const IconSwitch = ({ value, onClick, colorOn = null, colorOff = null, brightnessOn = null, brightnessOff = null, iconOn = 'eye', iconOff = 'eyeOff', iconProps, sx, ...props }: IconSwitch) => {

  const conditionalProps = {
    color: value ? colorOn : colorOff,
    filter: value ? (brightnessOn ? `brightness(${brightnessOn}%)` : null) : (brightnessOff ? `brightness(${brightnessOff}%)` : null),
  };

  return (
    <IconButton onClick={onClick} sx={{ ...conditionalProps, ...sx }} {...props} >
      <Icon icon={value ? iconOn : iconOff} {...iconProps} />
    </IconButton >
  )
}

export default IconSwitch