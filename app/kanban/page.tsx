// import styles from "./page.module.css";
// import { v4 as uuid } from 'uuid'

import Kanbans from "@/components/Entity/Entitys/Kanbans";
import WrapperHeader from "@/components/Header/WrapperHeader";
import { PAGE_DATA } from '@/constants/pages';


export const metadata = {
  ...PAGE_DATA.kanban
}
export default function Home() {
  return (
    <div>
      <WrapperHeader pageTitle={PAGE_DATA.kanban.title}>
        <Kanbans />
      </WrapperHeader>
    </div>
  );
}
