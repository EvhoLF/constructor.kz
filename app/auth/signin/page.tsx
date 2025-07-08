import FormSignin from '@/components/Form/FormSignin';
import WrapperHeader from '@/components/Header/WrapperHeader';

export default function Page() {
  return (
    <WrapperHeader hide>
      <FormSignin />
    </WrapperHeader>
  );
}
