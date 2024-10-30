import { Layout } from '../components/ui/Layout'
import Box from '@mui/material/Box'
import { CircularProgress, } from '@mui/material'
// import { useEffect } from 'react';
import { useUserStore } from '../store/user/UserStore';
import { useEffect } from 'react';
import { DescripcionDeVista } from '../components/ui/content/DescripcionDeVista';
import moment from 'moment';
import { OptionsList } from '../components/ui/options';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumberRounded';

const options = [
    { text: 'Tickets', icon: <ConfirmationNumberIcon />, path: '/tickets' },
]
export const Dashboard = () => {
    const user = useUserStore((state) => state.user);
    const validateToken = useUserStore((state) => state.validateToken);
    useEffect(() => {
        validateToken();
    }, [])

    const days: any = {
        1: 'Lunes',
        2: 'Martes',
        3: 'Miercoles',
        4: 'Jueves',
        5: 'Viernes',
        6: 'Sabado',
        7: 'Domingo',
    }
    if (!user.names) return (
        <Layout>
            <Box sx={{ minHeight: '100vh', display: 'flex', flexFlow: 'row wrap', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        </Layout>
    )
    return (
        <Layout>
            <DescripcionDeVista title={`Bienvenido, ${user.names.split(' ')[0]} 👋`} description={`¡Feliz ${days[moment().day()]}! 🌞 Selecciona alguna de las opciones disponibles para interactuar con el sistema`} buttons={false} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: user.department?.description === 'IT' ? 4 : options.length > 4 ? 3 : (12 / options.length) }} />
        </Layout>
    )
}
