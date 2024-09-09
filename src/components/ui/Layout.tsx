import { FC, useEffect } from 'react';
import { Box, Container, Fab, Toolbar } from '@mui/material';
// import { Footer } from './footer';
import { NavBar } from './nav';
import { ForumRounded } from '@mui/icons-material';
import { Chat } from '../chat';
import { useUserStore } from '../../store/user/UserStore';
type Props = {
    children: React.ReactNode;
    noMargin?: boolean;
    chat?: boolean;
}

export const Layout: FC<Props> = ({ children, noMargin = false, chat = true }) => {
    const logout = useUserStore((state) => state.logout);
    const styles = {
        body: {
            width: '100%',
            margin: 'auto',
            minHeight: '100vh',
            maxheight: '100%',
        }
    }
    // useEffect(() => {
    //     window.addEventListener("beforeunload", (ev: any) => {

    //         ev.preventDefault();
    //         logout();
    //         return ev.returnValue = 'Are you sure you want to close?';
    //     });

    // }, [])
    return (
        <Box>
            <NavBar />
            <Toolbar />
            <Container sx={styles.body}>
                {children}
            </Container>
            {chat && (
                <Chat />
            )}
            {/* <Footer /> */}
        </Box >
    )
}

