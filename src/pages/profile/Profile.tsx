import { Avatar, Box, CircularProgress, IconButton, Menu, MenuItem, Paper, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista";
import { Layout } from "../../components/ui/Layout";
import { useUserStore } from "../../store/user/UserStore"
import { TypographyCustom } from "../../components/custom";
import { useEffect } from "react";
import { MobileInfo, PCInfo } from "../../components/profile/info";
import { PersonalInformation } from "../../components/profile/info/PersonalInformation";

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
                    <Paper elevation={0} sx={{ ...styles.paper, position: 'relative' }}>
                        <PCInfo />
                        <MobileInfo />
                    </Paper>
                </Grid>
                <Grid size={12}>
                    <Paper elevation={0} sx={styles.paper}>
                        <PersonalInformation />
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