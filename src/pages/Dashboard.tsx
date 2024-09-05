import { Layout } from '../components/ui/Layout'
import Box from '@mui/material/Box'
import { AppBar, Avatar, Button, Card, CardActions, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid2, IconButton, TextField, Toolbar, Typography } from '@mui/material'
// import { useEffect } from 'react';
import { useUserStore } from '../store/user/UserStore';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { CloseRounded, MessageRounded, MoreVert } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import ForumRounded from '@mui/icons-material/ForumRounded';
import { UserList } from '../components/users/UserList';
import useEcho from '../components/useEcho';
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
                {usuarios && (<Box sx={{ mt: 5 }}>
                    <Typography variant='h4'>Lista de usuarios</Typography>
                    <Divider sx={{ marginBlock: 5 }} />
                    <UserList usuarios={usuarios} />
                </Box>)}
            </Box>
        </Layout>
    )
}
