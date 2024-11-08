import CloseRounded from "@mui/icons-material/CloseRounded";
import { Dialog, DialogContent, Box, IconButton, Chip, Divider, CircularProgress, DialogActions, Avatar } from "@mui/material";
import { FormikState, Formik, Form } from "formik";
import moment from "moment";
import { FC, useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { ITicket } from "../../interfaces/ticket-type";
import { IActualization } from "../../interfaces/ticket-type";
import { getCookieValue } from "../../lib/functions";
import { useUserStore } from "../../store/user/UserStore";
import { TypographyCustom, TextFieldCustom, ButtonCustom } from "../custom";
import { Actualizations } from "./Actualizations";
import { red, blue, yellow, grey, purple } from "@mui/material/colors";

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
            console.log({ chuchuwa: ref.current.scrollHeight, chuchuwa2: ref.current.offsetHeight })
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
            <Box sx={{ display: 'flex', flexFlow: 'column wrap', width: '100%', margin: 'auto', position: 'relative', }}>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 1, right: 1 }}>
                    <CloseRounded />
                </IconButton>
                <TypographyCustom fontWeight="200" variant="subtitle2">{`Ticket #${ticket?.id}`}</TypographyCustom>
                <TypographyCustom variant='h6'>{`${ticket?.user.names} ${ticket?.user.surnames}`}</TypographyCustom>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1, marginBlock: 2 }}>
                    <Chip size="small" label={ticket?.department.description} sx={{ width: 80, background: purple[500] }} />
                    <Chip size="small" label={ticket?.ticket_category?.description} sx={{ width: 80, background: ticket?.ticket_category?.color, color: (theme) => theme.palette.getContrastText(ticket?.ticket_category?.color ?? '#C0EA0F') }} />
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
                </Box>
                <TypographyCustom variant="subtitle2" color="text.secondary">{`${moment(new Date(ticket?.created_at ?? '')).format('D/M/Y')}`}</TypographyCustom>

                <Box sx={{ marginBlock: 2 }}>
                    <TypographyCustom variant="body1">{ticket?.description}</TypographyCustom>
                </Box>

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
                        {!loading && actualizations && (<Actualizations actualizations={actualizations} loading={loading} />)}
                    </Box>
                </Box>
            </Box>
            {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <CircularProgress />
                </Box>
            )}

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