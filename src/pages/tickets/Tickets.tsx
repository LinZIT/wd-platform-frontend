import { useEffect } from 'react'
import { useUserStore } from '../../store/user/UserStore';
import { Layout } from '../../components/ui/Layout';
import { AddRounded, DashboardRounded, SearchRounded } from '@mui/icons-material';
import { OptionsList } from '../../components/ui/options';
import { DescripcionDeVista } from '../../components/ui/content/DescripcionDeVista';
import { Box, IconButton, Paper } from '@mui/material';
import { TextFieldCustom, TypographyCustom } from '../../components/custom';
import Grid from '@mui/material/Grid2';

const options = [
    { text: 'Dashboard', icon: <DashboardRounded />, path: '/stats' },
]

export const Tickets = () => {

    const user = useUserStore((state) => state.user);
    const validateToken = useUserStore((state) => state.validateToken);
    useEffect(() => {
        validateToken();
    }, [user.token])

    return (
        <Layout container={false}>
            <DescripcionDeVista title={"Tickets"} description={"Aquí encontraras todas las tus solicitudes de ayuda y comentarios de los clientes"} />
            <OptionsList options={options} />
            <Grid container sx={{ mt: 5 }}>
                <Grid size={9}>
                    <TextFieldCustom label="Buscar" slotProps={{
                        input: {
                            endAdornment: (<IconButton>
                                <SearchRounded />
                            </IconButton>)
                        }
                    }} />
                </Grid>
                <Grid size={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <IconButton sx={{ background: user.color, color: (theme) => theme.palette.getContrastText(user.color) }}>
                        <AddRounded />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 5, mb: 5 }} spacing={2}>
                <Grid size={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Paper elevation={0} sx={{ ...styles.paper, position: 'relative' }}>
                        <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                            <TypographyCustom variant="h6">Abiertos</TypographyCustom>
                            <TypographyCustom variant='subtitle2'>1</TypographyCustom>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Paper elevation={0} sx={{ ...styles.paper, position: 'relative' }}>
                        <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                            <TypographyCustom variant="h6">En proceso</TypographyCustom>
                            <TypographyCustom variant='subtitle2'>1</TypographyCustom>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Paper elevation={0} sx={{ ...styles.paper, position: 'relative' }}>
                        <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                            <TypographyCustom variant="h6">Terminados</TypographyCustom>
                            <TypographyCustom variant='subtitle2'>1</TypographyCustom>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Paper elevation={0} sx={{ ...styles.paper, position: 'relative' }}>
                        <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                            <TypographyCustom variant="h6">Cancelados</TypographyCustom>
                            <TypographyCustom variant='subtitle2'>1</TypographyCustom>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Layout>
    )
}
const styles = {
    paper: {
        mt: 5,
        p: 5,
        borderRadius: 4,
        width: '100%',
        minHeight: '100vh'
    }
}
