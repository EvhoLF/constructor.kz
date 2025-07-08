import { Stack, StackProps } from '@mui/material'
import React from 'react'

const StackRow = ({ children, ...props }: StackProps) => {
  return (
    <Stack alignItems='center' direction='row' gap={1} overflow='clip' {...props}>{children}</Stack>
  )
}

export default StackRow