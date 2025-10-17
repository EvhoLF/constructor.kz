import { IconButton, IconButtonProps, PopperPlacementType, Tooltip } from '@mui/material'
import React from 'react'
import Icon from './Icon'
import Link from 'next/link'
import { IconName } from '@/Icons'

interface LinkButtonIconProps extends IconButtonProps {
  href: string,
  icon?: IconName,
  tooltip?: string,
  placement?: PopperPlacementType,
}

const LinkButtonIcon = ({ href, icon, placement, tooltip = '', ...props }: LinkButtonIconProps) => {
  return (
    <Link href={href}>
      <Tooltip title={tooltip} placement={placement}>
        <IconButton color="inherit" {...props}>
          <Icon icon={icon} />
        </IconButton>
      </Tooltip>
    </Link>
  )
}

export default LinkButtonIcon