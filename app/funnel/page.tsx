// import styles from "./page.module.css";
// import { v4 as uuid } from 'uuid'

import Funnel from "@/components/Funnel/Funnel";
import WrapperHeader from "@/components/Header/WrapperHeader";

export default function Home() {
  return (
    <div>
      <WrapperHeader>
        <Funnel/>
      </WrapperHeader>
    </div>
  );
}
