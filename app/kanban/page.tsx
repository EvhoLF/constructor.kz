// import styles from "./page.module.css";
// import { v4 as uuid } from 'uuid'

import WrapperHeader from "@/components/Header/WrapperHeader";
import KanbanFunnels from '@/components/KanbanFunnel/KanbanFunnels';
import { PAGE_DATA } from '@/constants/pages';


export const metadata = {
  ...PAGE_DATA.kanban
}
export default function Home() {
  return (
    <div>
      <WrapperHeader pageTitle={PAGE_DATA.kanban.title}>
        <KanbanFunnels />
      </WrapperHeader>
    </div>
  );
}
