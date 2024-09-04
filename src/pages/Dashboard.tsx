import { Layout } from '../components/ui/Layout'
import Box from '@mui/material/Box'
import { AppBar, Avatar, Button, Card, CardActions, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid2, IconButton, TextField, Toolbar, Typography } from '@mui/material'
// import { useEffect } from 'react';
import { useUserStore } from '../store/user/UserStore';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { CloseRounded, MessageRounded, MoreVert } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import ForumRounded from '@mui/icons-material/ForumRounded';
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
                {usuarios && (

                    <Grid2 container spacing={2}>
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h4">Usuarios</Typography>
                            <Divider sx={{ marginBlock: 2 }} />
                        </Box>
                        {usuarios.map((usuario: any) => (usuario.id !== user.id &&
                            (
                                <Box key={usuario.id}>
                                    <UserItem usuario={usuario} openModal={openModal} openModalMessages={openModalMessages} getChatWith={getChatWith} />
                                    <Dialog open={open}>
                                        <DialogTitle>Redacta tu mensaje</DialogTitle>
                                        <DialogContent sx={{ p: 5, mt: 2 }}>
                                            <TextField multiline label="Mensaje" value={text} onChange={(e: ChangeEvent<HTMLInputElement>) => { setText(e.target.value) }} />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose} color='error'>Cancelar</Button>
                                            <Button onClick={() => sendMessage(usuario.id)}>Enviar</Button>
                                        </DialogActions>
                                    </Dialog>
                                    <Dialog open={openMessages} fullScreen onClose={handleCloseMessages}>
                                        <AppBar position="static">
                                            <Toolbar>
                                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                                    Chat Messages
                                                </Typography>
                                                <IconButton onClick={handleCloseMessages}>
                                                    <CloseRounded />
                                                </IconButton>
                                            </Toolbar>
                                        </AppBar>
                                        <DialogContent>
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant='h4'>{`Chat con ${usuario.names} ${usuario.surnames}`}</Typography>
                                            </Box>
                                            <Box sx={{ mt: 2 }}>
                                                <ChatMessages usuario={usuario} />
                                            </Box>
                                        </DialogContent>
                                    </Dialog>
                                </Box>
                            )
                        ))}
                    </Grid2>
                )}
            </Box>
        </Layout>
    )
}
const UserItem: FC<{ usuario: any, openModal: () => void, openModalMessages: () => void, getChatWith: (id: number) => void }> = ({ usuario, openModal, openModalMessages, getChatWith }) => {
    return (
        <Grid2>
            <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 5 }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
                            {usuario.names.charAt(0) + usuario.surnames.charAt(0)}
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVert />
                        </IconButton>
                    }
                    title={`${usuario.names} ${usuario.surnames}`}
                    subheader="2024"
                />
                <CardActions disableSpacing>
                    <IconButton aria-label="Send message">
                        <MessageRounded onClick={openModal} />
                    </IconButton>
                    <IconButton aria-label="Send message">
                        <ForumRounded onClick={openModalMessages} />
                    </IconButton>

                </CardActions>
            </Card>
        </Grid2>

    )
}
