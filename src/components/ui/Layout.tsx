import { FC } from 'react';
import { Box, Container, Toolbar } from '@mui/material';
// import { Footer } from './footer';
import { NavBar } from './nav';
type Props = {
    children: React.ReactNode;
    noMargin?: boolean;
}

export const Layout: FC<Props> = ({ children, noMargin = false }) => {
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
            {/* <Footer /> */}
        </Box >
    )
}