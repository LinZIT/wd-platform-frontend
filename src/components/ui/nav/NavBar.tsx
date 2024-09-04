import { AppBar, Toolbar, Box, Typography, darken, useTheme, Grid2, Badge } from "@mui/material";
import { SideBar } from ".";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MessageRounded, NotificationsRounded } from "@mui/icons-material";
import { useUserStore } from "../../../store/user/UserStore";
import useEcho from "../../useEcho";

export const NavBar = () => {
    const theme = useTheme();
    const router = useNavigate();
    const user = useUserStore((state) => state.user);
    const echo = useEcho()
    const [unreadMessages, setUnreadMessages] = useState<number>(0)
    useEffect(() => {
        if (user) {
            //   getAllUsers()
            if (echo) {
                // echo.join(`chat.${user.id}`)
                //     .here((users: any) => {
                //         console.log(users)
                //     })
                //     .joining((user: any) => {
                //         console.log(user.name);
                //     })
                //     .leaving((user: any) => {
                //         console.log(user.name);
                //     })
                //     .error((error: any) => {
                //         console.error(error);
                //     });
                echo.private(`chat.${user?.id}`).listen('MessageSent', (event: any) => {
                    if (event.receiver.id === user?.id)
                        console.log('Real-time event received: ', event)
                    handleEchoCallback()
                })
            }
        }

        return () => {
            if (echo) {
                echo.leave(`chat.${user.id}`);
            }
        };
    }, [user]);
    const sound = new Howl({
        src: ['/message.mp3'],
    })

    const handleEchoCallback = () => {
        setUnreadMessages(prevUnread => prevUnread + 1)
        sound.play()
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
                        <Badge badgeContent={unreadMessages} color="error">
                            <NotificationsRounded />
                        </Badge>
                    </Grid2>
                </Grid2>
            </Toolbar>
        </AppBar>
    )
}