// import styles from "./page.module.css";

import WrapperHeader from "@/components/Header/WrapperHeader";
import ForWhomBlock from "@/components/Home/ForWhomBlock";
import Hero from "@/components/Home/Hero";
import HowItWorksTimeline from "@/components/Home/HowItWorksTimeline";
import ModulesBlock from "@/components/Home/ModulesBlock";
import { PAGE_DATA } from "@/constants/pages";
import { Button, Stack, Typography, } from "@mui/material";
import Link from "next/link";

export const metadata = {
  ...PAGE_DATA.home,
};


export default function Home() {
  return (
    <div>
      <WrapperHeader pageTitle={PAGE_DATA.home.title}>
        <Stack paddingX={{ xs: 2, sm: 4, md: 10, }} spacing={3} gap={7}>
          <Hero />
          <Stack justifyContent='center' gap={1}>
            <Typography variant="h4" fontWeight={700}>Что такое Konstruktor</Typography>
            <Typography variant="body1">
              <strong>Konstruktor</strong> — это универсальная платформа, объединяющая инструменты визуализации, анализа и управления.
              Она помогает командам любого размера превращать сложные идеи и данные в понятные визуальные схемы, ускоряя принятие решений и повышая прозрачность процессов.
            </Typography>
          </Stack>

          {/* ОСНОВНЫЕ РАЗДЕЛЫ */}
          <ModulesBlock />
          <HowItWorksTimeline />
          <ForWhomBlock />

          <Stack alignItems='center' justifyContent='center' gap={3} paddingBottom={7}>
            <Typography variant="h4" fontWeight={700}>Готовы начать?</Typography>
            <Typography variant="h6">
              Присоединяйтесь к пользователей, которые уже используют наши решения для достижения своих целей.
            </Typography>
            <Button fullWidth sx={{ maxWidth: '250px' }} size='large' variant='contained' LinkComponent={Link} href="/profile">
              Начать
            </Button>
          </Stack>
        </Stack>
      </WrapperHeader>
    </div>
  );
}