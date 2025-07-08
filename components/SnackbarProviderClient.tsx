'use client';

import { SnackbarProvider } from 'notistack';

export default function SnackbarProviderClient({ children }: { children: React.ReactNode }) {
  return <SnackbarProvider maxSnack={5} autoHideDuration={5000}>{children}</SnackbarProvider>;
}
