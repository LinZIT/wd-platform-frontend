import { useState, ReactElement } from "react";
import { Drawer, Box, Toolbar, Grid, IconButton, Divider, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuRounded from "@mui/icons-material/MenuRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";

interface LinkProps {
    text: string;
    path: string;
    icon: ReactElement;
}

/**
 * Este componente se encarga del menu lateral izquierdo, cada case es el que esta encargado de mostrar los links segun el nivel del
 * usuario loggeado. En caso de querer cambiar los links del menu lateral izq, debe seleccionar el nivel correspondiente y modificarlo
 */

const useSideBarLinks = () => {
    const theme = useTheme();
    const [links, setLinks] = useState<LinkProps[]>([])
    // const getLinksByLevel = () => {
    //     switch (Number(authState.level)) {
    //         case 1:
    //             setLinks(
    //                 [
    //                     { text: 'Dashboard', path: '/dashboard', icon: <DashboardRounded /> },
    //                     { text: 'Perfil', path: '/profile', icon: <ProfileRounded /> },
    //                     { text: 'Lvl 1', path: '/profile', icon: <ProfileRounded /> },
    //                 ]
    //             )
    //             break;
    //         case 2:
    //             setLinks(
    //                 [
    //                     { text: 'Dashboard', path: '/dashboard', icon: <DashboardRounded /> },
    //                     { text: 'Perfil', path: '/profile', icon: <ProfileRounded /> },
    //                     { text: 'Lvl 2', path: '/profile', icon: <ProfileRounded /> },
    //                 ]
    //             )
    //             break;
    //         case 3:
    //             setLinks(
    //                 [
    //                     { text: 'Dashboard', path: '/dashboard', icon: <DashboardRounded /> },
    //                     { text: 'Perfil', path: '/profile', icon: <ProfileRounded /> },
    //                     { text: 'Lvl 3', path: '/profile', icon: <ProfileRounded /> },
    //                 ]
    //             )
    //             break;
    //         case 4:
    //             setLinks(
    //                 [
    //                     { text: 'Dashboard', path: '/dashboard', icon: <DashboardRounded /> },
    //                     { text: 'Perfil', path: '/profile', icon: <ProfileRounded /> },
    //                     { text: 'Lvl 4', path: '/profile', icon: <ProfileRounded /> },
    //                 ]
    //             )
    //             break;
    //         case 5:
    //             setLinks(
    //                 [
    //                     { text: 'Dashboard', path: '/dashboard', icon: <DashboardRounded /> },
    //                     { text: 'Perfil', path: '/profile', icon: <ProfileRounded /> },
    //                     { text: 'Ejecutivo', path: '/profile', icon: <ProfileRounded /> },
    //                 ]
    //             )
    //             break;
    //         case 6:
    //             setLinks(
    //                 [
    //                     { text: 'Dashboard', path: '/dashboard', icon: <DashboardRounded /> },
    //                     { text: 'Perfil', path: '/profile', icon: <ProfileRounded /> },
    //                     { text: 'Gerente de Venta', path: '/profile', icon: <ProfileRounded /> },
    //                 ]
    //             )
    //             break;
    //         case 7:
    //             setLinks(
    //                 [
    //                     { text: 'Dashboard', path: '/dashboard', icon: <DashboardRounded /> },
    //                     { text: 'Perfil', path: '/profile', icon: <ProfileRounded /> },
    //                     { text: 'SAC', path: '/profile', icon: <ProfileRounded /> },
    //                 ]
    //             )
    //             break;
    //         case 8:
    //             setLinks(
    //                 [
    //                     { text: 'Dashboard', path: '/dashboard', icon: <DashboardRounded /> },
    //                     { text: 'Perfil', path: '/profile', icon: <ProfileRounded /> },
    //                     { text: 'Protocolizacion', path: '/profile', icon: <ProfileRounded /> },
    //                 ]
    //             )
    //             break;
    //         case 9:
    //             setLinks(
    //                 [
    //                     { text: 'Dashboard', path: '/dashboard', icon: <DashboardRounded /> },
    //                     { text: 'Perfil', path: '/profile', icon: <ProfileRounded /> },
    //                     { text: 'Gerencia', path: '/profile', icon: <ProfileRounded /> },
    //                 ]
    //             )
    //             break;
    //         case 10:
    //             setLinks(
    //                 [
    //                     { text: 'Dashboard', path: '/dashboard', icon: <DashboardRounded /> },
    //                     { text: 'Perfil', path: '/profile', icon: <ProfileRounded /> },
    //                     { text: 'Master', path: '/profile', icon: <ProfileRounded /> },
    //                 ]
    //             )
    //             break;
    //         default:
    //             setLinks(
    //                 [
    //                     { text: 'Dashboard', path: '/dashboard', icon: <DashboardRounded /> },
    //                     { text: 'Perfil', path: '/profile', icon: <ProfileRounded /> },
    //                     { text: 'Lvl unknown', path: '/profile', icon: <ProfileRounded /> },
    //                 ]
    //             )
    //             break;
    //     }
    // }
    // useEffect(() => {
    //     getLinksByLevel();
    // }, [authState.level, authState.color])
    return { links }
}

export const SideBar = () => {
    const [open, setOpen] = useState<boolean>(false)
    // const { authState } = useContext(AuthContext);
    // const { links } = useSideBarLinks();
    const router = useNavigate();
    const onClick = () => {
        setOpen(true);
    }
    const theme = useTheme();
    return (
        <>
            <IconButton onClick={onClick}>
                <MenuRounded sx={{ color: '#FFF' }} />
            </IconButton>
            <Drawer open={open} PaperProps={{ sx: { background: theme.palette.mode === 'dark' ? '#191919' : '#fbfbfb' } }}>
                <Box sx={{ width: 240 }}>
                    <Toolbar>
                        <Grid container direction='row' justifyContent='space-between' alignItems='center' sx={{ width: '100%' }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                flexFlow: 'row nowrap'
                            }}>
                                <img src='/logo.png' width={45} height={45} />
                            </Box>
                            <IconButton onClick={() => setOpen(false)}>
                                <CloseRounded />
                            </IconButton>
                        </Grid>
                    </Toolbar>
                    <Divider />
                    {/* {links.map((item) => (
                        <Box key={item.text}>
                            <Button
                                fullWidth
                                variant='text'
                                startIcon={item.icon}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    color: theme.palette.text.primary,
                                    textTransform: 'none',
                                    p: 2,
                                    '&:hover': {
                                        background: authState.darken
                                    }
                                }}
                                onClick={() => router(item.path)}
                            >
                                {item.text}
                            </Button>
                            <Divider />
                        </Box>
                    ))} */}
                </Box>
            </Drawer>
        </>
    )
}