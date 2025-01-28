import { CloseRounded } from "@mui/icons-material";
import ForumRounded from "@mui/icons-material/ForumRounded";
import { AppBar, Badge, Box, Container, Dialog, DialogContent, Fab, IconButton, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { IUser, useUserStore } from "../../store/user/UserStore";
import { UserList } from "../users/UserList";
import useEcho from "../useEcho";
import { useUserListStore } from "../../store/users/UserListStore";
import { Bounce, ToastContainer } from "react-toastify";
import { useMessagesStore } from "../../store/messages/MessagesStore";

export const Chat = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const user = useUserStore((state) => state.user);
    const validateToken = useUserStore((state) => state.validateToken);
    const echo = useEcho();
    const addUsers = useUserListStore((state) => state.addUsers);
    const unreadMessages = useMessagesStore((state) => state.unreadMessages);
    // useEffect(() => {
    //     validateToken();
    //     if (user) {
    //         if (echo) {
    //             const status_channel = echo.private(`status_online.${user?.isOnline}`);
    //             echo.join(`status_online.${user?.isOnline}`)
    //                 .here((users: any[]) => {
    //                     console.log({ users })
    //                 })
    //                 .joining((user: any) => {
    //                     console.log('joining', { user })
    //                     // getAllUsers();
    //                     handleCallbackJoining();
    //                 })
    //                 .leaving((user: any) => {
    //                     console.log('leaving', { user })
    //                     // getAllUsers();
    //                     handleCallbackLeaving();
    //                 })
    //         }
    //     }
    //     getOnlineUsers();
    // }, [])

    const handleCallback = () => {
        console.log('handleCallback');
        getOnlineUsers();
    }

    const handleCallbackLeaving = () => {
        console.log('handleCallbackLeaving');
        getOnlineUsers();
    }
    const handleCallbackJoining = () => {
        console.log('handleCallbackJoining');
        getOnlineUsers();
    }
    const getOnlineUsers = async () => {
        if (!user.token) {
            return;
        }
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/users/online`;
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${user?.token}`,
            },
        }
        try {
            const response = await fetch(url, options);
            const { data } = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (<>
        <Fab aria-label="add" size='medium' onClick={() => setOpen(true)} sx={{
            background: user.color,
            '&:hover': {
                background: user.darken
            },
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 20,
            left: 'auto',
            position: 'fixed',
        }}>
            <Badge badgeContent={unreadMessages.length} variant="dot" color="error" overlap="circular" >
                <ForumRounded sx={{ color: (theme) => theme.palette.getContrastText(user.color) }} />
            </Badge>
        </Fab>
        <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
            <AppBar elevation={0}>
                <Toolbar>
                    <Box sx={{ width: { xs: '100%', md: '80%' }, display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: 'center', margin: 'auto', p: 0 }}>
                        <Box>
                            <Typography>Chat</Typography>
                        </Box>
                        <Box sx={{ margin: 0 }}>
                            <IconButton onClick={() => setOpen(false)}>
                                <CloseRounded />
                            </IconButton>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <DialogContent>
                <Box sx={{ width: { xs: '100%', md: '80%' }, margin: 'auto' }}>
                    {/* {usuarios && (<UserList usuarios={usuarios} />)} */}
                    {usuarios && (<UserList usuarios={usuarios} />)}
                </Box>
            </DialogContent>
        </Dialog>
    </>)
}