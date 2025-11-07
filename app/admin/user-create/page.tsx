import FormCreateUser from '@/components/Form/FormCreateUser';
import WrapperHeader from '@/components/Header/WrapperHeader';
import { PAGE_DATA } from '@/constants/pages';


export const metadata = {
  ...PAGE_DATA.createUser
}
export default function Page() {
  return (
    <WrapperHeader hide center>
      <FormCreateUser />
    </WrapperHeader>
  );
}
