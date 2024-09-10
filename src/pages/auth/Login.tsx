import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import { Form, Formik, FormikState } from 'formik';
import { useUserStore } from '../../store/user/UserStore';
import { ButtonCustom, TextFieldCustom } from '../../components/custom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const initialValues: FormData = {
    email: '',
    password: '',
}
interface FormData {
    email: string;
    password: string;
}
export const Login = () => {
    const login = useUserStore((state) => state.login);
    const onSubmit = async (values: FormData, resetForm: (nextState?: Partial<FormikState<FormData>> | undefined) => void) => {
        const result = await login(values.email, values.password);
        if (result.status) {
            resetForm()
            toast.success(result.message);
            window.location.href = '/dashboard'
        } else {
            toast.error(result.message);
        }

    }
    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.formContainer}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                >
                    {({ handleSubmit, handleChange, values }) => (
                        <Form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid size={12} sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box component={'div'} sx={{ width: '100%', height: 70 }}>
                                        <img src="/logo_azul.webp" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </Box>
                                </Grid>
                                <Grid size={12}>
                                    <TextFieldCustom name="email" label='Correo' value={values.email} onChange={handleChange} fullWidth />
                                </Grid>
                                <Grid size={12}>
                                    <TextFieldCustom name="password" label='Contraseña' value={values.password} onChange={handleChange} fullWidth />
                                </Grid >
                                <Grid size={12}>
                                    <ButtonCustom variant="contained" fullWidth type='submit'>Iniciar</ButtonCustom>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
            <ToastContainer
                stacked
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </Box >
    )
}
const styles = {
    mainContainer: {
        minWidth: '100%',
        minHeight: '100vh',
        maxHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fbfbfb',
    },
    formContainer: {
        background: 'white',
        borderRadius: 5,
        width: { xs: '100%', sm: '50%', md: '30%', lg: '20%' },
        height: { xs: '100vh', sm: 400 },
        display: 'flex',
        flexFlow: 'column wrap',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(200,200,200,0.1)',
        margin: '0',
        paddingInline: 5
    }
}