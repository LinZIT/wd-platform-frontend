import { Avatar, Box, CircularProgress, IconButton, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista";
import { Layout } from "../../components/ui/Layout";
import { useUserStore } from "../../store/user/UserStore"
import { ButtonCustom, TypographyCustom } from "../../components/custom";
import { AvatarCustom } from "../../components/custom/AvatarCustom";
import { EditRounded } from "@mui/icons-material";
import { useEffect } from "react";
// import { ThemeChanger } from "../../components/ui/profile/ThemeChanger";
import buttonStyles from "./Profile.module.css"
import { ThemeChanger } from "../../components/profile/ThemeChanger";
import { ColorPicker } from "../../components/profile/ColorPicker";

export const Profile = () => {

    const user = useUserStore((state) => state.user);
    const validateToken = useUserStore((state) => state.validateToken);

    useEffect(() => {
        validateToken();
    }, [])
    if (!user.logged) return <CircularProgress />
    return (
        <Layout>
            <DescripcionDeVista title={"Perfil"} description={"Podras editar tu informacion de usuario, temas y mas!"} />
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Paper elevation={0} sx={styles.paper}>
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                <Box sx={{ display: 'flex', flexFlow: 'row wrap', gap: 2, }}>
                                    <AvatarCustom customsize={65} />
                                    <Box sx={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'start', textAlign: 'start' }}>
                                        <TypographyCustom>{`${user.names} ${user.surnames}`}</TypographyCustom>
                                        <TypographyCustom variant={'subtitle2'} color="text.secondary">{`${user.department?.description}`}</TypographyCustom>
                                        <TypographyCustom variant={'subtitle2'} color="text.secondary">{`${user.role?.description}`}</TypographyCustom>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: "center" }}>
                                    <Box sx={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', gap: 1 }}>
                                        <ButtonCustom variant={'outlined'} style={{ height: 40 }}>
                                            Cambiar contraseña
                                        </ButtonCustom>
                                        <ColorPicker />
                                        <ThemeChanger />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <Box sx={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                <AvatarCustom customsize={80} />
                                <Box sx={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', alignItems: "center", width: '80%' }}>
                                    <Box sx={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'start', textAlign: 'center', gap: 1 }}>
                                        <TypographyCustom>{`${user.names} ${user.surnames}`}</TypographyCustom>
                                        <TypographyCustom variant={'subtitle2'} color="text.secondary">{`${user.department?.description} Department`}</TypographyCustom>
                                    </Box>
                                    <Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={12}>
                    <Paper elevation={0} sx={styles.paper}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TypographyCustom variant={'body1'} fontSize={22}>Informacion Personal</TypographyCustom>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                                <Box sx={{ display: 'flex', flexFlow: 'column wrap' }}>
                                    <TypographyCustom variant={'subtitle2'} color="text.secondary" fontWeight={200}>Nombres</TypographyCustom>
                                    <TypographyCustom variant={'subtitle1'} fontWeight={400}>{user.names}</TypographyCustom>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                                <Box sx={{ display: 'flex', flexFlow: 'column wrap' }}>
                                    <TypographyCustom variant={'subtitle2'} color="text.secondary" fontWeight={200}>Apellidos</TypographyCustom>
                                    <TypographyCustom variant={'subtitle1'} fontWeight={400}>{user.surnames}</TypographyCustom>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                                <Box sx={{ display: 'flex', flexFlow: 'column wrap' }}>
                                    <TypographyCustom variant={'subtitle2'} color="text.secondary" fontWeight={200}>Telefono</TypographyCustom>
                                    <TypographyCustom variant={'subtitle1'} fontWeight={400}>{user.phone}</TypographyCustom>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                                <Box sx={{ display: 'flex', flexFlow: 'column wrap' }}>
                                    <TypographyCustom variant={'subtitle2'} color="text.secondary" fontWeight={200}>Correo</TypographyCustom>
                                    <TypographyCustom variant={'subtitle1'} fontWeight={400}>{user.email}</TypographyCustom>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Layout>

    )
}
const styles = {
    paper: {
        p: 5,
        borderRadius: 4
    }
}