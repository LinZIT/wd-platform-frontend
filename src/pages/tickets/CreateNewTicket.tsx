import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid2"
import { useUserStore } from "../../store/user/UserStore";
import { ButtonCustom, TextFieldCustom } from "../../components/custom"
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista"
import { Layout } from "../../components/ui/Layout"
import { Form, Formik, FormikState } from "formik"
import { request } from "../../common/request"
import { toast } from "react-toastify"

interface InitialValues {
    description: string;
    department: string;
}

const initialValues = {
    description: "",
    department: "",
}

export const CreateNewTicket = () => {

    const user = useUserStore((state) => state.user);
    const onSubmit = async (values: InitialValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const body = new URLSearchParams({ description: String(values.description), user_id: String(user.id) })
        const { status, response, err } = await request('/ticket', 'POST', body)
        switch (status) {
            case 200:
                toast.success('Nuevo ticket creado');
                resetForm();
                break;
            case 400:
                toast.error('Datos incorrectos, revise por favor los datos enviados');
                break;
            case 500:
                toast.error('Ocurrio un error en el servidor, informe enviado a soporte.');
                break;
            default:
                console.log({ err });
                toast.error('Ocurrio un error inesperado, intente mas tarde');
                break;
        }
    }

    return (
        <Layout>
            <Box sx={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                <DescripcionDeVista title={"Crear nuevo ticket"} description={"En esta vista podrás crear un nuevo ticket"} />
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                >
                    {({ values, handleChange, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Grid container direction={'column'} gap={4}>
                                <Grid>
                                    <TextFieldCustom label="Departamento" disabled value={user.department?.description} />
                                </Grid>
                                <Grid>
                                    <TextFieldCustom label="Nombre y Apellido" disabled value={`${user.names} ${user.surnames}`} />
                                </Grid>
                                <Grid>
                                    <TextFieldCustom label="Email" disabled value={user.email} />
                                </Grid>
                                <Grid>
                                    <TextFieldCustom label="Descripcion de problema" value={values.description} onChange={handleChange} name="description" multiline />
                                </Grid>
                                <Grid>
                                    <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                        <ButtonCustom type='button' variant="outlined" style={{ width: '200px' }}>Reiniciar</ButtonCustom>
                                        <ButtonCustom type='submit' variant="contained" style={{ width: '200px' }}>Crear Ticket</ButtonCustom>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Layout>
    )
}
