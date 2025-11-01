

'use client'
import { ThemeContext } from "@/hooks/ThemeRegistry";
import { Box, Typography, Stack, Grid, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

export default function Hero() {
    const { mode, toggleMode } = useContext(ThemeContext);


    return (
        <Grid
            container
            alignItems='center'
            spacing={2}
            p={2}
        >
            <Grid size={{ xs: 12, sm: 6 }}>
                <Stack gap={2}>
                    <Typography variant="h4" fontWeight={700}>
                        Добро пожаловать в <Box component="span" textTransform='uppercase' fontFamily='Unbounded' color="primary.main">Konstruktor</Box>
                    </Typography>
                    <Typography>
                        Универсальная платформа для визуализации, анализа и систематизации данных.
                        Создавайте диаграммы, воронки и канбан-доски — всё в одном интуитивном пространстве.
                    </Typography>
                    <Stack direction="row" spacing={2} mt={2}>
                        <Button size='medium' variant="contained" LinkComponent={Link} href="/diagram">
                            Перейти к диаграммам
                        </Button>
                        <Button size='medium' variant="outlined" LinkComponent={Link} href="/profile">
                            Профиль
                        </Button>
                    </Stack>
                </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} p={1}>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: { xs: 200, sm: 250 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                }}>
                    <Image src={mode == 'light' ? '/images/home_diagram_light.png' : '/images/home_diagram_dark.png' } alt='' layout="fill" objectFit="contain" />
                </Box>
            </Grid>
        </Grid>
    );
}

