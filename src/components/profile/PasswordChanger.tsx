import { Box, Paper } from "@mui/material";
import { useUserStore } from "../../store/user/UserStore";
import { TypographyCustom, ButtonCustom, TextFieldCustom } from "../custom";
import { Form, Formik, FormikState } from "formik";
import Grid from '@mui/material/Grid2';
import { FC } from "react";
import { toast } from "react-toastify";
import { usePassStore } from "../../store/password/PasswordStore";

interface InitialValues {
    password: string;
    confirm: string;
}

const initialValues: InitialValues = {
    password: '',
    confirm: '',
}
interface Props {
    show: boolean;
}
export const PasswordChanger: FC<Props> = ({ show }) => {
    const user = useUserStore((state) => state.user);
    const changePass = usePassStore((state) => state.changePass);
    const onSubmit = async (values: InitialValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const result = await changePass(values.password, values.confirm);
        if (!result.status) {
            if (Array.isArray(result.message)) {
                result.message.map((error: string) => toast.error(error))
            } else {
                toast.error(result.message)
            }
        } else {
            toast.success("Contraseña cambiada correctamente")
            resetForm()
            // window.location.reload() // Reload the page to update the user data in the store.
        }

    }
    if (!show) return <></>;
    return (
        <Paper elevation={0} sx={{ ...styles.paper, position: 'relative' }}>
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextFieldCustom name='password' value={values.password} onChange={handleChange} label="Nueva contraseña" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextFieldCustom name='confirm' value={values.confirm} onChange={handleChange} label="Confirmar contraseña" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                <ButtonCustom variant="contained" fullWidth type='submit'>Guardar cambios</ButtonCustom>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>

    )
}
const styles = {
    paper: {
        p: 5,
        borderRadius: 4
    }
}