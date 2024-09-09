import { Button, Container, Grid2, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { Form, Formik, FormikState } from 'formik';
import { ChangeEvent, useState } from 'react'
import { useUserStore } from '../../store/user/UserStore';
import { useNavigate } from 'react-router-dom';
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
    const router = useNavigate();
    const onSubmit = async (values: FormData, resetForm: (nextState?: Partial<FormikState<FormData>> | undefined) => void) => {
        const result = await login(values.email, values.password);
        if (result.status) {
            resetForm()
            window.location.href = '/dashboard'
            // router('/dashboard')
        } else {
            alert('Error al iniciar sesión')
        }

    }
    return (
        <Container sx={styles.mainContainer}>
            <Box sx={styles.formContainer}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                >
                    {({ handleSubmit, handleChange, values }) => (
                        <Form onSubmit={handleSubmit}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={12}>
                                    <Typography variant="h2">⌂ Well Done</Typography>
                                </Grid2>
                                <Grid2 size={12}>
                                    <TextField name="email" label='Correo' value={values.email} onChange={handleChange} fullWidth />
                                </Grid2>
                                <Grid2 size={12}>
                                    <TextField name="password" label='Contraseña' value={values.password} onChange={handleChange} fullWidth />
                                </Grid2 >
                                <Grid2 size={12}>
                                    <Button variant={'contained'} sx={{ textTransform: 'none', p: 2 }} fullWidth type='submit'>Iniciar</Button>
                                </Grid2>
                            </Grid2>
                        </Form>
                    )}
                </Formik>

            </Box>
        </Container>
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
        background: '#fbfbfb'
    },
    formContainer: {
        background: 'white',
        borderRadius: 5,
        width: 500,
        height: 500,
        paddingInline: 10,
        display: 'flex',
        flexFlow: 'column wrap',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(200,200,200,0.1)'
    }
}