import { AppBar, Toolbar, Box, useTheme, Badge, Container, IconButton, lighten } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { NotificationsOutlined, NotificationsRounded } from "@mui/icons-material";
import { useUserStore } from "../../../store/user/UserStore";
import useEcho from "../../useEcho";
import { Howl } from "howler";
import { useMessagesStore } from "../../../store/messages/MessagesStore";
import { UserMenu } from "./UserMenu";

export const NavBar = () => {
    const theme = useTheme();
    const router = useNavigate();
    const user = useUserStore((state) => state.user);
    // const echo = useEcho();
    // const unreadMessages = useMessagesStore((state) => state.unreadMessages);
    // const setUnreadMessages = useMessagesStore((state) => state.setUnreadMessages);
    // const getMessages = useMessagesStore((state) => state.getMessages);
    // const getChatWindow = useUserStore((state) => state.getChatWindow)
    useEffect(() => {
        // if (user) {
        //     if (echo) {
        //         echo.private(`chat.${user?.id}`).listen('MessageSent', (event: any) => {
        //             if (event.receiver.id === user?.id)
        //                 handleEchoCallback(event)
        //         })
        //         if (user.department?.description === 'IT') {
        //             console.log('intento')
        //             echo.join(`room.${user.department?.id}`)
        //                 .here((users: any) => {
        //                     console.log('Users in IT room:', users);
        //                 })
        //                 .joining((user: any) => {
        //                     console.log('User joined IT room:', user);
        //                 })
        //         }
        //     }
        // }
        // return () => {
        //     if (echo) {
        //         echo.leave(`chat.${user.id}`);
        //         echo.leave(`room.${user.department?.id}`);
        //     }
        // };
    }, []);
    const sound = new Howl({
        src: ['/message.mp3'],
    })
    const sound_open = new Howl({
        src: ['/new_message.mp3'],
    })
    // const handleEchoCallback = (e: any) => {
    //     getChatWindow() ? sound_open.play() : sound.play();
    //     if (getChatWindow()) return;
    //     const value = getMessages();
    //     const newUnreadMessages = [...value, { message: e.message, sender: e.sender, date: new Date() }]
    //     setUnreadMessages(newUnreadMessages);
    // }
    const height = 35;
    const width = 160;
    return (
        <AppBar elevation={0} color="info" sx={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
            <Toolbar>
                <Box sx={{ width: '80%', margin: 'auto' }}>
                    <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                        <Grid size={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexFlow: 'row nowrap' }}>
                                {theme.palette.mode === 'dark'
                                    ? (
                                        <img src='/logo_blanco.webp' width={width} height={height} style={{ cursor: 'pointer' }} onClick={() => router('/dashboard')} />
                                    )
                                    : (
                                        <img src='/logo_azul.webp' width={width} height={height} style={{ cursor: 'pointer' }} onClick={() => router('/dashboard')} />
                                    )}
                            </Box>
                        </Grid>
                        <Grid size={4} >
                            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {/* <IconButton size="small" onClick={() => setUnreadMessages([])} disableRipple sx={{ cursor: 'pointer', background: theme.palette.mode === 'dark' ? lighten(theme.palette.background.default, 0.1) : theme.palette.background.default }}>
                                        <Badge badgeContent={unreadMessages.length} variant="dot" color="error" overlap="circular" >
                                            <NotificationsOutlined sx={{ width: 16, height: 16 }} />
                                        </Badge>
                                    </IconButton> */}
                                </Box>
                                <UserMenu />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Toolbar>
        </AppBar>
    )
}