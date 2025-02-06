import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/ui/Layout'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { darken } from '@mui/material'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumberRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import { grey } from '@mui/material/colors';

import { OptionsList } from '../components/ui/options';
import { TypographyCustom } from '../components/custom';
import { DescripcionDeVista } from '../components/ui/content/DescripcionDeVista';

import { useUserStore } from '../store/user/UserStore';

import moment from 'moment';
import { useTicketCategoryStore } from '../store/ticket_categories/TicketCategoryStore';
import { useSocketStore } from '../store/sockets/SocketStore';
const options = [
    { text: 'Tickets', icon: <ConfirmationNumberIcon />, path: '/tickets' },
]
export const Dashboard = () => {
    const user = useUserStore((state) => state.user);
    const validateToken = useUserStore((state) => state.validateToken);
    const getCategories = useTicketCategoryStore((state) => state.getCategories);
    const socket = useSocketStore((state) => state);
    useEffect(() => {
        validateToken();
        // getCategories();
        if (user.id !== 0) {
            if (socket.echo === null) {
                socket.setSocket();
            } else {
                console.log({ socket })
                socket.echo.join(`ticketsRoom.${user?.department_id}`)
            }
        }
        return () => {
            if (socket.echo) {
                socket.echo.leave(`ticketsRoom.${user?.department_id}`)
            }
        }
    }, [user.id, socket.echo])
    const router = useNavigate();
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
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CircularProgress />
            </Box>
        </Layout>
    )
    return (
        <Layout >
            <DescripcionDeVista title={`Bienvenido, ${user.names.split(' ')[0]} 👋`} description={`¡Feliz ${days[moment().day()]}! 🌞 Selecciona alguna de las opciones disponibles para interactuar con el sistema`} buttons={false} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: user.department?.description === 'IT' ? 4 : options.length > 4 ? 3 : (12 / options.length) }} />
            <Box
                onClick={() => router('/ticket/new')}
                sx={{
                    alignItems: "center",
                    background: (theme) => theme.palette.mode === 'dark' ? darken(theme.palette.background.default, 0.2) : '#FFF',
                    border: '1px solid rgba(150,150,150,0.2)',
                    borderRadius: 5,
                    color: grey[600],
                    cursor: 'pointer',
                    display: 'flex',
                    flexFlow: 'column wrap',
                    height: 150,
                    justifyContent: 'center',
                    mt: 5,
                    p: 2,
                    width: 150,
                }}>
                <AddRounded />
                <TypographyCustom variant="subtitle2">Crear ticket</TypographyCustom>
            </Box>
        </Layout>
    )
}
