'use client'
import {
    Box,
    Stack,
    Typography,
    Grid,
    useTheme,
    useMediaQuery
} from '@mui/material'
import Frame from '../UI/Frame'

const HowItWorksTimeline = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const steps = [
        {
            label: 'Регистрация и Авторизация',
            description: 'Создайте аккаунт или войдите в систему, чтобы получить доступ к инструментам платформы.',
            icon: '1'
        },
        {
            label: 'Создание проекта',
            description: 'Выберите нужный модуль и создайте проект — диаграммы, онтологию, воронку или доску.',
            icon: '2'
        },
        {
            label: 'Настройка элементов',
            description: 'Добавляйте элементы, связывайте их, описывайте формулы и визуализируйте логику.',
            icon: '3'
        },
        {
            label: 'Сохранение и анализ',
            description: 'Сохраняйте, делитесь и анализируйте результаты в единой среде.',
            icon: '4'
        }
    ]

    if (isMobile) {
        return (
            <Box>
                <Typography variant="h4" fontWeight={700} textAlign="center">
                    Как это работает
                </Typography>
                <Stack spacing={3}>
                    {steps.map((step, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    backgroundColor: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    fontSize: '1.2rem',
                                    color: 'uiPanel.main',
                                    fontWeight: 'bold'
                                }}
                            >
                                {step.icon}
                            </Box>
                            <Box>
                                <Typography variant="h5" gutterBottom>
                                    {step.label}
                                </Typography>
                                <Typography variant="body2" maxWidth='100px'>
                                    {step.description}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Box>
        )
    }

    return (
        <Stack gap={4}>
            <Typography variant="h4" fontWeight={700} textAlign="center">
                Как это работает
            </Typography>

            <Box sx={{ position: 'relative' }}>
                {/* Центральная линия */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        backgroundColor: 'primary.main',
                        transform: 'translateX(-50%)'
                    }}
                />

                <Stack spacing={6}>
                    {steps.map((step, index) => (
                        <Grid
                            key={index}
                            container
                            alignItems="center"
                            sx={{ position: 'relative', zIndex: 2 }}
                        >
                            {/* Левая сторона - текст */}
                            <Grid size='grow'>
                                {index % 2 === 0 && (
                                    <Stack direction='column' alignItems='flex-end' sx={{ textAlign: 'right', pr: 4 }}>
                                        <Typography variant="h5" gutterBottom>
                                            {step.label}
                                        </Typography>
                                        <Typography variant="body1" maxWidth='400px'>
                                            {step.description}
                                        </Typography>
                                    </Stack>
                                )}
                            </Grid>

                            {/* Центральная точка */}
                            <Grid size='auto' sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.3rem',
                                        color: 'uiPanel.main',
                                        fontWeight: 'bold',
                                        boxShadow: 2,
                                        position: 'relative',
                                        zIndex: 3
                                    }}
                                >
                                    {step.icon}
                                </Box>
                            </Grid>

                            {/* Правая сторона - текст */}
                            <Grid size='grow'>
                                {index % 2 === 1 && (
                                    <Box sx={{ textAlign: 'left', pl: 4 }}>
                                        <Typography variant="h5" gutterBottom>
                                            {step.label}
                                        </Typography>
                                        <Typography variant="body1" maxWidth='400px'>
                                            {step.description}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    ))}
                </Stack>
            </Box>
        </Stack>
    )
}

export default HowItWorksTimeline