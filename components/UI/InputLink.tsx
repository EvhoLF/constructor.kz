import { FC } from 'react';
import NextLink from 'next/link';
import { Link as MuiLink, LinkProps, Typography, TypographyProps } from '@mui/material';

interface InputLinkProps extends Omit<LinkProps, 'typography'> {
  href: string;
  typography?: TypographyProps;
  variant?: TypographyProps['variant']
}

const InputLink: FC<InputLinkProps> = ({ children, href, underline = 'none', sx, typography, variant, ...props }) => {
  return (
    <MuiLink
      component={NextLink}
      href={href}
      underline={underline}
      sx={{
        transition: 'all .3s',
        '&:hover': {
          color: 'primary.light',
        },
        '&:active': {
          color: 'primary.dark',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
        },
        '@media (hover: none)': {
          '&:active': {
            color: 'secondary.main',
          },
        },
        ...sx,
      }}
      {...props}
    >
      <Typography {...typography} variant={variant}>
        {children}
      </Typography>
    </MuiLink>
  );
};

export default InputLink;
