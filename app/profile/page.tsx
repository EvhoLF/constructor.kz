import FormProfile from '@/components/Form/FormProfile';
import WrapperHeader from '@/components/Header/WrapperHeader';
import { PAGE_DATA } from '@/constants/pages';


export const metadata = {
  ...PAGE_DATA.profile
}
export default function Page() {
  return (
    <WrapperHeader hide>
      <FormProfile />
    </WrapperHeader>
  );
}
