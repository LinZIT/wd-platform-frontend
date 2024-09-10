import { FC } from 'react';
import { Box, Container, Toolbar } from '@mui/material';
// import { Footer } from './footer';
import { NavBar } from './nav';
import { Chat } from '../chat';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
type Props = {
    children: React.ReactNode;
    noMargin?: boolean;
    chat?: boolean;
}
export const Layout: FC<Props> = ({ children, chat = true }) => {
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
            <Container sx={styles.body}>
                {children}
            </Container>
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
                theme="light"
                transition={Bounce}
            />
        </Box >
    )
}

