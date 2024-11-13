import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista";
import { Layout } from "../../components/ui/Layout";
import { useUserStore } from "../../store/user/UserStore"
import { useEffect } from "react";
import { MobileInfo, PCInfo } from "../../components/profile/info";
import { PersonalInformation } from "../../components/profile/info/PersonalInformation";
import { PasswordChanger } from "../../components/profile";
import { usePassStore } from "../../store/password/PasswordStore";

export const Profile = () => {
    const user = useUserStore((state) => state.user);
    const validateToken = useUserStore((state) => state.validateToken);
    const pass = usePassStore((state) => state.pass);
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
                    <PasswordChanger show={pass.changing} />
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