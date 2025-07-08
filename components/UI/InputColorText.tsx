import React from 'react'
import InputText from './InputText'
import InputColor from './InputColor'

interface InputColorTextProps {
  label?: string,
  value: string,
  pickColor: (e: string) => void,
  setColor: (value: string) => void,
}
const InputColorText = ({ label = '', value, pickColor, setColor }: InputColorTextProps) => {
  return (
    <InputText label={label}
      sx={{ '& .MuiOutlinedInput-root': { padding: ' 0px 10px !important' }, '& input': { paddingRight: '0px !important', textTransform: 'lowercase', fontSize: '.9rem' } }}
      value={value}
      inputProps={{ maxLength: 7 }}
      onChange={(e) => pickColor(e.target.value)} size='small' placeholder='Color: #------'
      startAdornment={<InputColor sx={{ width: '1rem' }} color={value} onChange={setColor} />}
    />
  )
}

export default InputColorText