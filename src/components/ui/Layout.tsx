import { FC } from 'react';
import { Box, Container, Toolbar } from '@mui/material';
// import { Footer } from './footer';
import { NavBar } from './nav';
import { Chat } from '../chat';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserStore } from '../../store/user/UserStore';
type Props = {
    children: React.ReactNode;
    noMargin?: boolean;
    chat?: boolean;
    container?: boolean;
}
export const Layout: FC<Props> = ({ children, chat = true, container = true }) => {
    const styles = {
        body: {
            width: '100%',
            margin: 'auto',
            minHeight: '100vh',
            maxheight: '100%',
        }
    }

    return (
        <Box>
            <NavBar />
            <Toolbar />
            {container ? (
                <Container sx={styles.body}>
                    {children}
                </Container>
            ) : (
                <Box sx={{ ...styles.body, width: '90%' }}>
                    {children}
                </Box>
            )}
            {chat && (
                <Chat />
            )}
            {/* <Footer /> */}
            <ToastContainer
                stacked
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={useUserStore.getState().user.theme}
                transition={Bounce}
            />
        </Box >
    )
}

