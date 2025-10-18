"use client";
import { createTheme, CssVarsTheme, Interpolation, Theme } from "@mui/material/styles";
import { palette } from "./variables";
import { TextFieldProps } from "@mui/material";

interface MuiTextFieldVariant {
  props: Partial<TextFieldProps> | ((props: Partial<TextFieldProps> & {
    ownerState: Partial<TextFieldProps>;
  }) => boolean);
  style: Interpolation<{
    theme: Omit<Theme, "components" | "palette"> & CssVarsTheme;
  }>;
}

const MuiTextField_mediumSmall: MuiTextFieldVariant = {
  props: { size: "mediumSmall" },
  style: {
    "& .MuiInputBase-input": {
      padding: ".75rem .5rem",
      fontSize: "1rem",
    },
    "& label": {
      transform: "translate(14px, 12px) scale(1)",
      "&.MuiInputLabel-shrink, &.Mui-focused": {
        transform: "translate(14px, -9px) scale(0.75)",
      },
    },
  },
}

const MuiTextField_extraSmall: MuiTextFieldVariant = {
  props: { size: "extraSmall" },
  style: {
    "& .MuiInputBase-input": {
      padding: "2px 6px",
      fontSize: "1rem",
    },
    "& label": {
      transform: "translate(14px, 12px) scale(1)",
      "&.MuiInputLabel-shrink, &.Mui-focused": {
        transform: "translate(14px, -9px) scale(0.75)",
      },
    },
  },
}

const lightTheme = createTheme({
  palette: {
    mode: "light",
    ...palette.light,
  },
  components: {
    MuiTextField: {
      variants: [
        { ...MuiTextField_mediumSmall },
        { ...MuiTextField_extraSmall },
      ],
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    ...palette.dark,
  },
  components: {
    MuiTextField: {
      variants: [
        { ...MuiTextField_mediumSmall },
        { ...MuiTextField_extraSmall },
      ],
    },
  },
});
export { lightTheme, darkTheme };
