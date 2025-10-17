import FormSignin from '@/components/Form/FormSignin';
import WrapperHeader from '@/components/Header/WrapperHeader';
import { PAGE_DATA } from '@/constants/pages';


export const metadata = {
  ...PAGE_DATA.authSignIn
}

export default function Page() {
  return (
    <WrapperHeader hide center>
      <FormSignin />
    </WrapperHeader>
  );
}
