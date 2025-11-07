import FormSignup from '@/components/Form/FormSignup';
import WrapperHeader from '@/components/Header/WrapperHeader';
import Frame from '@/components/UI/Frame';
import { PAGE_DATA } from '@/constants/pages';
import { Stack, Typography } from '@mui/material';


export const metadata = {
  ...PAGE_DATA.authSignUp
}
export default function Page() {
  return (
    <WrapperHeader hide center>
      <Frame sx={{ padding: '1rem' }}>
        <Stack maxWidth={400} justifyContent='center' alignItems='center' gap={1}>
          <Typography variant="h4">Регистрация недоступна</Typography>
          <Typography variant="body1">Для создания учётной записи обратитесь к администратору.</Typography>
        </Stack>
      </Frame>
    </WrapperHeader>
  );
}
