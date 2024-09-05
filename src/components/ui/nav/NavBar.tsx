import { AppBar, Toolbar, Box, Typography, darken, useTheme, Grid2, Badge } from "@mui/material";
import { SideBar } from ".";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MessageRounded, NotificationsRounded } from "@mui/icons-material";
import { useUserStore } from "../../../store/user/UserStore";
import useEcho from "../../useEcho";
import { useMessagesStore } from "../../../store/messages/MessagesStore";

export const NavBar = () => {
    const theme = useTheme();
    const router = useNavigate();
    const user = useUserStore((state) => state.user);
    const echo = useEcho();
    const unreadMessages = useMessagesStore((state) => state.unreadMessages);
    const setUnreadMessages = useMessagesStore((state) => state.setUnreadMessages);
    const getMessages = useMessagesStore((state) => state.getMessages);
    useEffect(() => {
        if (user) {
            if (echo) {
                echo.join(`chat.${user.id}`)
                    .here((users: any) => {
                        console.log(users)
                    })
                    .joining((user: any) => {
                        console.log(user.name);
                    })
                    .leaving((user: any) => {
                        console.log(user.name);
                    })
                    .error((error: any) => {
                        console.error(error);
                    });
                echo.private(`chat.${user?.id}`).listen('MessageSent', (event: any) => {
                    if (event.receiver.id === user?.id)
                        console.log('Real-time event received: ', event)
                    handleEchoCallback(event)

                })
            }
        }
        return () => {
            if (echo) {
                echo.leave(`chat.${user.id}`);
            }
        };
    }, [user.token]);
    const sound = new Howl({
        src: ['/message.mp3'],
    })
    console.log({ unreadMessages })
    const handleEchoCallback = (e: any) => {
        sound.play()
        const value = getMessages();
        const newUnreadMessages = [...value, { message: e.message, sender: e.sender, date: new Date() }]
        setUnreadMessages(newUnreadMessages);
    }

    return (
        <AppBar elevation={0}>
            <Toolbar>
                <Grid2 container direction='row' justifyContent='space-between' alignItems='center' sx={{ width: '100%', margin: 'auto' }}>
                    <Grid2 size={8}>

                        <Box sx={{ display: 'flex', alignItems: 'center', flexFlow: 'row nowrap' }}>
                            <SideBar />
                            {/* <img src='/logo.png' width={45} height={45} style={{ cursor: 'pointer' }} onClick={() => router('/dashboard')} /> */}
                            <Typography sx={{ ml: 1, cursor: 'pointer' }} onClick={() => router('/dashboard')}>Well Done</Typography>
                        </Box>
                    </Grid2>
                    {/* <UserMenu /> */}
                    <Grid2 size={1}>
                        <Badge badgeContent={unreadMessages.length} color="error">
                            <NotificationsRounded />
                        </Badge>
                    </Grid2>
                </Grid2>
            </Toolbar>
        </AppBar>
    )
}