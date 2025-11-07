import React from 'react'
import InputText, { InputTextProps } from './InputText'
import InputColor from './InputColor'


interface InputColorTextProps extends InputTextProps {
  label?: string,
  value: string,
  pickColor: (e: string) => void,
  setColor: (value: string) => void,
  maxLength?: number,
  textTransform: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width' | 'full-size-kan',
}
const InputColorText = ({ label = '', maxLength = 7, value, pickColor, setColor, sx, textTransform = 'lowercase', ...props }: InputColorTextProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toLowerCase()

    // Добавляем #, если пользователь его удалил
    if (!val.startsWith('#')) val = '#' + val.replace(/#/g, '')

    // Убираем все символы кроме hex
    val = '#' + val.replace(/[^0-9a-f]/g, '').slice(0, 6)

    pickColor(val)
  }
  return (
    <InputText label={label}
      sx={{
        '& .MuiOutlinedInput-root': { padding: ' 0px 10px !important' },
        '& input': { paddingRight: '0px !important', textTransform: textTransform, fontSize: '.9rem' },
        '& input[type="type="color"]': { padding: '0' },
        ...sx
      }}
      value={value}
      inputProps={{ maxLength }}
      onChange={handleChange} size='small' placeholder='Color: #------'
      startAdornment={<InputColor sx={{ width: '1rem' }} color={value} onChange={setColor} />}
      {...props}
    />
  )
}

export default InputColorText