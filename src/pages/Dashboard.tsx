import { Layout } from '../components/ui/Layout'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
// import { useEffect } from 'react';
import { useUserStore } from '../store/user/UserStore';
import { useEffect, useState } from 'react';
// import useEcho from '../components/useEcho';

export const Dashboard = () => {
    // const echo = useEcho();
    const user = useUserStore((state) => state.user);
    const validateToken = useUserStore((state) => state.validateToken);
    const [usuarios, setUsuarios] = useState<any>(null);
    // const handleEchoCallback = () => {
    //     setUnreadMessages(prevUnread => prevUnread + 1)
    //     sound.play()
    // }
    // useEffect(() => {
    //     if (user) {
    //         getAllUsers()
    //         if (echo) {
    //             echo.join(`chat.${user.id}`)
    //                 .here((users: any) => {
    //                     console.log(users)
    //                 })
    //                 .joining((user: any) => {
    //                     console.log(user.name);
    //                 })
    //                 .leaving((user: any) => {
    //                     console.log(user.name);
    //                 })
    //                 .error((error: any) => {
    //                     console.error(error);
    //                 });
    //             echo.private(`chat.${user?.id}`).listen('MessageSent', (event: any) => {
    //                 if (event.receiver.id === user?.id)
    //                     console.log('Real-time event received: ', event)
    //                 handleEchoCallback()
    //             })
    //         }
    //     }

    //     return () => {
    //         if (echo) {
    //             echo.leave(`chat.${user.id}`);
    //         }
    //     };
    // }, [user]);
    const getAllUsers = async () => {

        if (!user) {
            return;
        }
        const url = 'http://localhost:8000/api/get_users';
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${user?.token}`,
            },
        }
        try {
            const response = await fetch(url, options);
            const { data } = await response.json();
            console.log({ data })
            setUsuarios(data);
        } catch (error) {
            console.log(error);
            // setError(error);
        }
    }
    return (
        <Layout>
            <Box>
                <Typography>Inicio de sesion</Typography>
            </Box>
        </Layout>
    )
}
