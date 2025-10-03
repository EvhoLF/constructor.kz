import { Box, Button, Popover, Slider, TextField, InputAdornment, Typography, IconButton } from '@mui/material'
import { useState } from 'react'
import Icon from './Icon'

interface InputSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

export default function InputSlider({ label, value, min, max, step = 1, onChange }: InputSliderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <TextField
        label={label}
        size="small"
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleOpen}>
                <Icon icon='equalizer' />
              </IconButton>
            </InputAdornment>
          ),
          inputProps: { min, max },
        }}
        sx={{ width: '14ch', '& > div': { paddingRight: '.25rem' } }}
      >
      </TextField>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: '.5rem 1rem', width: 200 }}>
          <Slider
            value={value}
            onChange={(e, newValue) => onChange(newValue as number)}
            min={min}
            max={max}
            step={step}
            size="small"
          />
        </Box>
      </Popover>
    </Box>
  )
}
