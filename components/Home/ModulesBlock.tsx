'use client'
import { Grid, Stack, Typography, Button, Collapse, Box } from "@mui/material";
import Frame from "@/components/UI/Frame";
import Icon from "@/components/UI/Icon";
import Link from "next/link";
import { useState } from "react";
import { IconName } from "@/Icons";
// import { ThemeContext } from "@/hooks/ThemeRegistry";

const MODULES: {
    icon: IconName,
    title: string,
    description: string,
    href: string,
}[] = [
        {
            icon: 'mindMap',
            title: "Диаграммы",
            description: "Создавайте диаграмм, интеллект-карты и визуальные модели процессов. Настраивайте цвета, иконки, шрифты и связи, чтобы визуализировать архитектуру проекта, структуру команды или пользовательский путь. Идеально подходит для документирования, анализа и презентаций.",
            href: "/diagram",
        },
        {
            icon: 'layout_tree',
            title: "Онтологии",
            description: "Определяйте структуры через текстовые формулы с мгновенной визуализацией. Удобный способ описывать онтологии через текстовые формулы или блок-схем. Используйте интуитивный синтаксис для построения сложных логических структур и связей. Любое изменение в формуле мгновенно отображается на диаграммы — и наоборот.",
            href: "/ontology",
        },
        {
            icon: "filter",
            title: "Воронки",
            description: "Визуализируйте этапы процессов и анализируйте эффективность на каждом уровне. Настраивайте направление, количество слоёв, метрики и описание этапов, чтобы находить узкие места и повышать эффективность бизнес-процессов.",
            href: "/funnel",
        },
        {
            icon: "clipboard",
            title: "Канбан",
            description: "Управляйте задачами и не только в гибком формате. Создавайте колонки, карточки, чек-листы и дедлайны. Перетаскивайте задачи между стадиями и следите за прогрессом команды. Простой интерфейс помогает держать фокус и прозрачность рабочего процесса.",
            href: "/kanban",
        },
    ];

export default function ModulesBlock() {
    // const { mode } = useContext(ThemeContext);

    const [open, setOpen] = useState<string[]>([]);

    const toggle = (title: string) => {
        setOpen((prev) =>
            prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
        );
    };

    return (
        <Grid container spacing={2} >
            {MODULES.map((item) => {
                const isOpen = open.includes(item.title);
                return (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.title}>
                        <Frame
                            sx={{
                                height: "max-content",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                p: 2.5,
                                gap: 1,
                                transition: ".25s",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                                },
                            }}
                        >
                            <Stack gap={1}>
                                <Stack direction='row' alignContent='center' gap={1}>
                                    <Icon icon={item.icon as any} fontSize="large" />
                                    <Typography variant="h6" textTransform='uppercase' alignContent='center'>{item.title}</Typography>
                                </Stack>

                                <Box sx={{ position: 'relative', minHeight: '50px' }}>
                                    <Collapse
                                        in={isOpen}
                                        collapsedSize={50}
                                        timeout={400}
                                        easing={{
                                            enter: 'ease-in-out',
                                            exit: 'ease-in-out',
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                        >
                                            {item.description}
                                        </Typography>
                                    </Collapse>

                                    {/* {!isOpen && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: '1em',
                                                background: `linear-gradient(transparent, ${mode == 'light' ? '#ffffff' : '#252525' })`,
                                                pointerEvents: 'none',
                                                transition: 'opacity 0.3s ease-in-out',
                                            }}
                                        />
                                    )} */}
                                </Box>
                            </Stack>

                            <Stack direction={{ md: 'column', lg: 'row' }} gap={1}>
                                <Button
                                    fullWidth
                                    variant='contained'
                                    size='medium'
                                    onClick={() => toggle(item.title)}
                                    sx={{
                                        width: '100%',
                                        maxWidth: { md: '100%', lg: '120px' },
                                        textTransform: "none",
                                        transition: 'all 0.3s ease-in-out',
                                    }}
                                >
                                    {isOpen ? "Скрыть" : "Подробнее"}
                                </Button>
                                <Button
                                    fullWidth
                                    LinkComponent={Link}
                                    href={item.href}
                                    size="medium"
                                    variant='outlined'
                                    sx={{
                                        width: '100%',
                                        maxWidth: { md: '100%', lg: '120px' },
                                        textWrap: 'nowrap',
                                        textTransform: "none",
                                        transition: 'all 0.3s ease-in-out',
                                    }}
                                >
                                    Перейти →
                                </Button>
                            </Stack>
                        </Frame>
                    </Grid>
                );
            })}
        </Grid>
    );
}