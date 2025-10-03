// import styles from "./page.module.css";

import WrapperHeader from "@/components/Header/WrapperHeader";
import { PAGE_DATA } from '@/constants/pages';


export const metadata = {
  ...PAGE_DATA.home
}
export default function Home() {
  return (
    <div>
      <WrapperHeader />
    </div>
  );
}
