import FormSignup from '@/components/Form/FormSignup';
import WrapperHeader from '@/components/Header/WrapperHeader';
import { PAGE_DATA } from '@/constants/pages';


export const metadata = {
  ...PAGE_DATA.authSignUp
}
export default function Page() {
  return (
    <WrapperHeader hide center>
      <FormSignup />
    </WrapperHeader>
  );
}
