import AddRounded from "@mui/icons-material/AddRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { Dialog, DialogContent, Box, IconButton, Chip, Divider, DialogActions, Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { FormikState, Formik, Form } from "formik";
import moment from "moment";
import { FC, useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { ITicket, ITicketCategory } from "../../interfaces/ticket-type";
import { IActualization } from "../../interfaces/ticket-type";
import { getCookieValue } from "../../lib/functions";
import { useUserStore } from "../../store/user/UserStore";
import { TypographyCustom, TextFieldCustom, ButtonCustom } from "../custom";
import { Actualizations } from "./Actualizations";
import { red, blue, yellow, purple } from "@mui/material/colors";
import { request } from "../../common/request";
import { useTicketCategoryStore } from "../../store/ticket_categories/TicketCategoryStore";
import { toast } from "react-toastify";
import { PopoverPicker } from "./PopoverPicker";

const initialValues = {
    actualization: '',
}
interface InitialValues {
    actualization: string;
}
interface Props {
    ticket_id: number;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}


export const TicketInformation: FC<Props> = ({ ticket_id, open, setOpen }) => {

    const user = useUserStore((state) => state.user);
    const [ticket, setTicket] = useState<ITicket | null>(null);

    const [actualizations, setActualizations] = useState<IActualization[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const ref = useRef();
    useEffect(() => {
        if (open) {
            getTicketInformation();
        } else {
            setTicket(null);
        }
    }, [open]);

    const getTicketInformation = async () => {
        setLoading(true);
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/ticket/${ticket_id}`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${user?.token ?? getCookieValue('token')}`
            },
        }
        try {
            const response = await fetch(url, options);
            if (response.status === 200) {
                const { data, actualizations } = await response.json();
                setTicket(data)
                setActualizations(actualizations);
                scrollTo(ref);
            } else {
                console.error('Error fetching ticket information');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);

        }
    }
    const scrollTo = (ref: any) => {
        if (ref && ref.current) {
            setTimeout(() => {
                ref.current.scrollTo({ top: (ref.current.scrollHeight - ref.current.offsetHeight), behavior: "smooth" });
            }, 500)
        }
    }
    const handleClose = () => {
        setOpen(false);
        setTicket(null);
    }

    const onSubmit = async (values: InitialValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/ticket/${ticket?.id}/actualization`;

        const body = new URLSearchParams({
            description: values.actualization
        })

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${user?.token ?? getCookieValue('token')}`
            },
            body
        }
        try {
            const response = await fetch(url, options);
            switch (response.status) {
                case 200:
                    const { data } = await response.json();
                    setActualizations(data);
                    resetForm();
                    break;
                default:
                    console.log('Ocurrio un error con el registro de la actualizacion');
                    break;
            }
        } catch (error) {
            console.log({ error })
        }
    }




    return (<Dialog fullWidth={true} maxWidth='xl' open={open} PaperProps={{ sx: { borderRadius: 4, }, }} disableScrollLock={false}  >

        <DialogContent sx={{ overflowY: 'auto' }} >
            <Box sx={{ display: 'flex', flexFlow: 'column wrap', width: '100%', margin: 'auto', position: 'relative' }}>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 1, right: 1 }}>
                    <CloseRounded />
                </IconButton>
                {loading ? <Box sx={{ width: 100 }}><Skeleton animation="wave" /> </Box> : <TypographyCustom fontWeight="200" variant="subtitle2">{`Ticket #${ticket?.id}`}</TypographyCustom>}
                {loading ? <Box sx={{ width: 300 }}><Skeleton animation="wave" /> </Box> : <TypographyCustom variant='h6'>{`${ticket?.user.names} ${ticket?.user.surnames}`}</TypographyCustom>}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1, marginBlock: 2 }}>
                    {loading ? <Box sx={{ width: 80 }}><Skeleton animation="wave" /> </Box> : <Chip size="small" label={ticket?.department.description} sx={{ width: 80, background: purple[500] }} />}
                    {loading ? <Box sx={{ width: 80 }}><Skeleton animation="wave" /> </Box> : <CategoriesDialog ticket={ticket} setTicket={setTicket} />}
                    {loading ? <Box sx={{ width: 80 }}><Skeleton animation="wave" /> </Box> :
                        <Chip size="small" label={ticket?.priority}
                            sx={{
                                width: 80,
                                background: ticket?.priority === 'Alta'
                                    ? red[500]
                                    : ticket?.priority === 'Media'
                                        ? blue[500]
                                        : ticket?.priority === 'Critica'
                                            ? yellow[500]
                                            : 'default',
                                color: (theme) => theme.palette.getContrastText(ticket?.priority === 'Alta' ? red[500] : ticket?.priority === 'Media' ? blue[500] : ticket?.priority === 'Critica' ? yellow[500] : theme.palette.background.default) ?? '#FFFFFF'
                            }} />
                    }
                </Box>
                {loading ? <Box sx={{ width: 100 }}><Skeleton animation="wave" /> </Box> : <TypographyCustom variant="subtitle2" color="text.secondary">{`${moment(new Date(ticket?.created_at ?? '')).format('D/M/Y')}`}</TypographyCustom>}

                {loading ? <Box sx={{ width: '100%' }}>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                </Box> : <Box sx={{ marginBlock: 2 }}><TypographyCustom variant="body1">{ticket?.description}</TypographyCustom></Box>}

                <TypographyCustom variant={'h6'} fontWeight={'bold'}>Actualizaciones</TypographyCustom>
                <Divider />
                <Box id="caja" sx={{ overflow: "hidden", height: '300px', maxHeight: '400px', width: "100%", paddingBlock: 2 }}>
                    <Box
                        ref={ref}
                        sx={{
                            height: "250px",
                            width: "100%",
                            boxSizing: "content-box",
                            overflowY: "scroll",
                            paddingRight: 5,
                        }}
                    >
                        {loading && (
                            <Box sx={{ display: 'flex', flexFlow: 'column wrap', gap: 2 }}>

                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', gap: 1 }}>
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Skeleton variant="rounded" width="70%" height={60} />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', gap: 1 }}>
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Skeleton variant="rounded" width="70%" height={60} />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', gap: 1 }}>
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Skeleton variant="rounded" width="70%" height={60} />
                                </Box>
                            </Box>
                        )}
                        {!loading && actualizations && (<Actualizations actualizations={actualizations} loading={loading} />)}
                    </Box>
                </Box>
            </Box>

        </DialogContent>
        <DialogActions>
            <Box sx={{ display: 'flex', flexFlow: 'column wrap', width: '100%', margin: 'auto', mb: 2, p: 2 }}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                >
                    {({ values, handleChange, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexFlow: 'row nowrap', gap: 1, alignItems: 'center' }}>
                                <Avatar sx={{ background: user.color, color: (theme) => theme.palette.getContrastText(user.color) }}>{user.names.charAt(0)}{user.surnames.charAt(0)}</Avatar>
                                <TextFieldCustom value={values.actualization} onChange={handleChange} name="actualization" multiline label="Escribir actualizacion..." />
                            </Box>
                            <Box sx={{ marginTop: 2, display: 'flex', flexFlow: 'row nowrap', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>

                                <Box sx={{ width: 300, display: 'flex', flexFlow: 'row nowrap', gap: 2 }}>
                                    <ButtonCustom style={{ padding: 5 }} size="small" variant="outlined" type="button" onClick={handleClose}>Cancelar</ButtonCustom>
                                    <ButtonCustom style={{ padding: 5 }} size="small" variant="contained" type="submit">Enviar</ButtonCustom>
                                </Box>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </DialogActions>
    </Dialog>)
}

const CategoriesDialog = ({ ticket, setTicket }: { ticket: ITicket | null, setTicket: Dispatch<SetStateAction<ITicket | null>> }) => {
    const [openTicketCategory, setOpenTicketCategory] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const categories = useTicketCategoryStore((state) => state.categories);
    const [color, setColor] = useState("#aabbcc");
    const setCategories = useTicketCategoryStore((state) => state.setCategories)

    const changeCategory = async (category: string) => {
        const body = new URLSearchParams({ description: category });
        const { status, response, err }: { status: number, response: any, err: any } = await request(`/ticket/${ticket?.id}/category`, 'PUT', body)
        switch (status) {
            case 200:
                const { data } = await response.json();
                setTicket(data);
                setOpenTicketCategory(false);
                toast.success('Categoría cambiada correctamente');
                break;
            default:
                toast.error('Error al intentar cambiar la categoria')
                break;
        }
    }

    const initialValues = {
        description: ''
    }

    const onSubmit = async (values: { description: string; }, resetForm: (nextState?: Partial<FormikState<{ description: string; }>> | undefined) => void) => {
        const body = new URLSearchParams({ description: String(values.description), color: String(color) });
        const status = await setCategories(body);
        switch (status) {
            case 200:
                setOpenTicketCategory(false);
                resetForm();
                toast.success('Categoría añadida correctamente');
                break;
            default:
                toast.error('No se creo la categoria');
                break;

        }
    }
    return (
        <>
            <Chip size="small" onClick={() => setOpenTicketCategory(true)} label={ticket?.ticket_category?.description} sx={{ width: 80, background: ticket?.ticket_category?.color, color: (theme) => theme.palette.getContrastText(ticket?.ticket_category?.color ?? '#C0EA0F') }} />
            <Dialog open={openTicketCategory} onClose={() => setOpenTicketCategory(false)} maxWidth="sm">
                <List sx={{ pt: 0 }}>
                    <Box sx={{ maxHeight: 200, overflowY: 'hidden' }}>
                        <Box sx={{ maxHeight: 200, overflowY: 'scroll' }}>
                            {categories && categories.map((category) => (
                                <ListItem disableGutters key={category.id} dense>
                                    <ListItemButton
                                        onClick={() => changeCategory(category.description)}
                                    >
                                        <ListItemAvatar>
                                            <Box sx={{ bgcolor: category.color, borderRadius: '100%', width: 40, height: 40 }} />
                                        </ListItemAvatar>
                                        <ListItemText primary={category.description} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                            {categories && categories.length === 0 && (
                                <Box sx={{ height: 100, display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 2 }}>
                                    <TypographyCustom>No hay categorias disponibles</TypographyCustom>
                                </Box>
                            )}
                        </Box>
                    </Box>
                    {isAdding ?
                        <Formik

                            initialValues={initialValues}
                            onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                        >
                            {({ values, handleSubmit, handleChange }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Grid container sx={{ display: "flex", flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', p: 1, gap: 1 }}>

                                        <Grid><IconButton onClick={() => setIsAdding(false)}><CloseRounded /></IconButton></Grid>
                                        <Grid sx={{ display: 'flex', flexFlow: 'row nowrap', gap: 1, alignItems: 'center' }}>
                                            <PopoverPicker color={color} onChange={setColor} />
                                            <TextFieldCustom disabled label={'Color'} name={'color'} value={color} />
                                        </Grid>
                                        <Grid sx={{ display: 'flex', flexFlow: 'row nowrap', gap: 1, alignItems: 'center' }}>
                                            <Box sx={{ width: 30, height: 30 }}></Box>
                                            <TextFieldCustom fullWidth label={'Descripcion'} name={'description'} value={values.description} onChange={handleChange} />
                                        </Grid>
                                        <Grid>
                                            <ButtonCustom variant="contained" type="submit">Guardar</ButtonCustom>
                                        </Grid>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                        : (<ListItem disableGutters>
                            <ListItemButton
                                autoFocus
                                onClick={() => setIsAdding(true)}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <AddRounded />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Agregar categoria" />
                            </ListItemButton>
                        </ListItem>)}
                </List >
            </Dialog >
        </>
    )
}