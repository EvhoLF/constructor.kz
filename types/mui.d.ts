import { TextFieldProps } from '@mui/material/TextField';

declare module '@mui/material/TextField' {
  interface TextFieldPropsSizeOverrides extends TextFieldProps {
    mediumSmall: true;
    extraSmall: true;
  }
}
