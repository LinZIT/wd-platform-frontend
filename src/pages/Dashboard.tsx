import { Layout } from '../components/ui/Layout'
import Box from '@mui/material/Box'
import { AppBar, Avatar, Button, Card, CardActions, CardHeader, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid2, IconButton, Paper, TextField, Toolbar, Typography } from '@mui/material'
// import { useEffect } from 'react';
import { useUserStore } from '../store/user/UserStore';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { CloseRounded, MessageRounded, MoreVert } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import ForumRounded from '@mui/icons-material/ForumRounded';
import { UserList } from '../components/users/UserList';
import useEcho from '../components/useEcho';
import { DescripcionDeVista } from '../components/ui/content/DescripcionDeVista';
import moment from 'moment';
// import useEcho from '../components/useEcho';

export const Dashboard = () => {
    // const echo = useEcho();
    const echo = useEcho();
    const user = useUserStore((state) => state.user);
    const validateToken = useUserStore((state) => state.validateToken);
    const [usuarios, setUsuarios] = useState<any>(null);
    useEffect(() => {
        validateToken();
        getAllUsers();
    }, [user.token])
    const getAllUsers = async () => {

        if (!user.token) {
            return;
        }
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/get_users`;
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${user?.token}`,
            },
        }
        try {
            const response = await fetch(url, options);
            const { data } = await response.json();
            // console.log({ data })
            setUsuarios(data);
        } catch (error) {
            console.log(error);
            // setError(error);
        }
    }
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
            {usuarios && (<Box sx={{ mt: 5 }}>
                <Typography variant='h4'>Lista de usuarios</Typography>
                <Divider sx={{ marginBlock: 5 }} />
                <UserList usuarios={usuarios} />
            </Box>)}
            {!usuarios && (<Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>)}
        </Layout>
    )
}
