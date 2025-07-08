import { IconButton, IconButtonProps, Tooltip } from '@mui/material'
import React from 'react'
import Icon from './Icon'
import Link from 'next/link'
import { IconName } from '@/Icons'

interface LinkButtonIconProps extends IconButtonProps {
  href: string,
  icon?: IconName,
  tooltip?: string,
}

const LinkButtonIcon = ({ href, icon, tooltip = '', ...props }: LinkButtonIconProps) => {
  return (
    <Link href={href}>
      <Tooltip title={tooltip}>
        <IconButton color="inherit" {...props}>
          <Icon icon={icon} />
        </IconButton>
      </Tooltip>
    </Link>
  )
}

export default LinkButtonIcon