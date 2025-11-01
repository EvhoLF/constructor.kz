// import styles from "./page.module.css";
// import { v4 as uuid } from 'uuid'
import Funnels from '@/components/Entity/Entitys/Funnels';
import WrapperHeader from "@/components/Header/WrapperHeader";
import { PAGE_DATA } from '@/constants/pages';


export const metadata = {
  ...PAGE_DATA.funnel
}
export default function Home() {
  return (
    <div>
      <WrapperHeader pageTitle={PAGE_DATA.funnel.title}>
        <Funnels />
      </WrapperHeader>
    </div>
  );
}
