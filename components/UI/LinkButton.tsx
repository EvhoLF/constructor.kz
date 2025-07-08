import { Button, ButtonProps, StackProps, Typography } from '@mui/material'
import React from 'react'
import Icon from './Icon'
import StackRow from './StackRow'
import Link from 'next/link'
import { IconName } from '@/Icons'

interface LinkButtonProps extends ButtonProps {
  href: string,
  icon?: IconName,
  stackProps?: StackProps,
  label: string,
}

const LinkButton = ({ href, icon, label, stackProps, ...props }: LinkButtonProps) => {
  return (
    <Button
      fullWidth
      color="inherit"
      component={Link}
      href={href}
      {...props}
    >
      <StackRow
        width="100%"
        justifyContent="start"
        alignItems="center"
        gap={1}
        {...stackProps}
      >
        {icon && <Icon icon={icon} />}
        <Typography>{label}</Typography>
      </StackRow>
    </Button>

  )
}

export default LinkButton