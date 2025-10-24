import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    uiPanel: {
      main: string;
      hoverMain: string;
    };
    transparent: {
      primaryMain: string;
    };
  }

  interface PaletteOptions {
    uiPanel?: {
      main?: string;
      hoverMain?: string;
    };
    transparent?: {
      primaryMain?: string;
    };
  }
}
