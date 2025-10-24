import { Box, BoxProps, useTheme } from '@mui/material';

interface DotsProps extends BoxProps {
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
}

const Dots = ({
  dotColor = 'white', // MUI цвет по умолчанию
  dotSize = 4,
  spacing = 10,
  sx,
  ...props
}: DotsProps) => {
  const theme = useTheme();
  
  // Функция для получения цвета из MUI темы
  const getColorFromTheme = (colorPath: string): string => {
    const path = colorPath.split('.');
    let color: any = theme.palette;
    
    for (const key of path) {
      color = color[key];
      if (!color) break;
    }
    
    return typeof color === 'string' ? color : '#ffffff'; // fallback
  };

  // Определяем финальный цвет
  const finalColor = dotColor.includes('.') 
    ? getColorFromTheme(dotColor) 
    : dotColor;

  const calculatedSpacing = Math.max(spacing, dotSize + 2);
  const radius = dotSize / 2;

  const svgPattern = `url("data:image/svg+xml,%3Csvg width='${calculatedSpacing}' height='${calculatedSpacing}' viewBox='0 0 ${calculatedSpacing} ${calculatedSpacing}' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='${calculatedSpacing / 2}' cy='${calculatedSpacing / 2}' r='${radius}' fill='${encodeURIComponent(finalColor)}'/%3E%3C/svg%3E")`;

  return (
    <Box
      {...props}
      sx={{
        height: '100%',
        width: '100%',
        backgroundImage: svgPattern,
        backgroundSize: `${calculatedSpacing}px ${calculatedSpacing}px`,
        ...sx,
      }}
    />
  );
};

export default Dots;