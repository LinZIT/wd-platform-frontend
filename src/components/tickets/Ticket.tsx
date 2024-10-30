import { MoreHorizRounded, Check, CloseRounded } from "@mui/icons-material";
import { Box, Divider, AvatarGroup, Avatar, IconButton, Menu, MenuList, Chip, MenuItem, ListItemIcon, ListItemText, Dialog, DialogContent, CircularProgress, DialogActions, darken, lighten, useTheme } from '@mui/material';
import { purple, blue, green, red, grey, yellow } from "@mui/material/colors";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, FC, useState, useEffect, Fragment } from "react";
import { ITicket, TicketStatus } from "../../interfaces/kanban-type";
import { IUser, useUserStore } from "../../store/user/UserStore";
import { ButtonCustom, TextFieldCustom, TypographyCustom } from "../custom";
import moment from "moment";
import { getCookieValue } from "../../lib/functions";
import { Form, Formik, FormikState, FormikValues } from "formik";

interface TicketProps {
    ticket: ITicket;
    setTickets: Dispatch<SetStateAction<ITicket[]>>
}
export const Ticket: FC<TicketProps> = ({ ticket, setTickets }) => {

    const [open, setOpen] = useState<boolean>(false);

    const user = useUserStore((state) => state.user);
    const changeStatus = (status: TicketStatus) => {
        setTickets((tickets) => {
            const except = tickets.filter((mticket) => mticket.id !== ticket.id);
            const newTickets: ITicket[] = [...except, { ...ticket, status }]
            return newTickets
        });
    }
    const handleOpen = () => {
        setOpen(true);
    }
    return (
        <motion.div variants={{
            hidden: {
                opacity: 0
            }, show: { opacity: 1 }
        }}>
            <Box sx={{
                position: 'relative',
            }}>

                <Box
                    onClick={handleOpen}
                    component={'div'}
                    sx={{
                        transition: '1s ease all',
                        touchAction: 'none',
                        border: '1px solid rgba(150,150,150,0.2)', borderRadius: 4, m: 1, p: 2, cursor: 'pointer',
                        WebkitUserSelect: 'none',
                        msUserSelect: 'none',
                        userSelect: 'none',
                    }}>
                    <Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: 'center', }}>
                        <TypographyCustom variant={'subtitle2'} fontWeight={'200'}>{ticket.id}</TypographyCustom>
                    </Box>
                    <TypographyCustom variant={'body1'} fontWeight={'bold'}>{`${ticket.user.names} ${ticket.user.surnames}`}</TypographyCustom>
                    <TypographyCustom variant={'subtitle2'} fontWeight={'200'}>{`${ticket.department.description}`}</TypographyCustom>
                    <Box sx={{ mt: 2, mb: 2, textAlign: "left" }}>
                        <TypographyCustom variant="subtitle2" fontSize={12}>{`${ticket.description.length > 100 ? ticket.description.substring(0, 97) + '...' : ticket.description}`}</TypographyCustom>
                    </Box>
                    <TypographyCustom variant="subtitle2" color="text.secondary" textAlign={'right'}>{moment(new Date(ticket.created_at)).format('D/M/Y')}</TypographyCustom>
                    <Divider sx={{ marginBlock: 1 }} />
                    <Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                        <AvatarGroup>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12, background: user.color }}>JL</Avatar>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12, background: '#394775' }}>NB</Avatar>
                        </AvatarGroup>
                    </Box>
                </Box>
                <DenseMenu ticket={ticket} changeStatus={changeStatus} />
            </Box>
            <TicketInformation ticket_id={ticket.id} open={open} setOpen={setOpen} />
        </motion.div>
    )
}

interface TicketInformationProps {
    ticket_id: number;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

interface IActualization {
    id: number;
    user_id: number;
    user: IUser;
    description: string;
    created_at: string;
    updated_at: string;
}
const initialValues = {
    actualization: '',
}
interface InitialValues {
    actualization: string;
}
const TicketInformation: FC<TicketInformationProps> = ({ ticket_id, open, setOpen }) => {

    const user = useUserStore((state) => state.user);
    const [ticket, setTicket] = useState<ITicket | null>(null);
    const [actualizations, setActualizations] = useState<IActualization[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const theme = useTheme();
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
            } else {
                console.error('Error fetching ticket information');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    const onSubmit = async (values: InitialValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/ticket/${ticket?.id}/actualization`;

        const body = new URLSearchParams({
            actualization: values.actualization
        })

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token ?? getCookieValue('token')}`
            },
            body
        }
    }


    return (<Dialog fullWidth={true} maxWidth='xl' open={open} PaperProps={{ sx: { borderRadius: 4, }, }} disableScrollLock={false}  >

        <DialogContent sx={{ overflowY: 'auto' }} >

            {!loading && (

                <Box sx={{ display: 'flex', flexFlow: 'column wrap', width: '100%', margin: 'auto', position: 'relative', }}>
                    <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 1, right: 1 }}>
                        <CloseRounded />
                    </IconButton>
                    <TypographyCustom fontWeight="200" variant="subtitle2">{`Ticket #${ticket?.id}`}</TypographyCustom>
                    <TypographyCustom variant='h6'>{`${ticket?.user.names} ${ticket?.user.surnames}`}</TypographyCustom>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1, marginBlock: 2 }}>
                        <Chip size="small" label={ticket?.department.description} sx={{ width: 80 }} />
                        <Chip size="small" label={ticket?.category} sx={{ width: 80 }} />
                        <Chip size="small" label={ticket?.priority} sx={{ width: 80 }} />
                    </Box>
                    <TypographyCustom variant="subtitle2" color="text.secondary">{`${moment(new Date(ticket?.created_at ?? '')).format('D/M/Y')}`}</TypographyCustom>

                    <Box sx={{ marginBlock: 2 }}>
                        <TypographyCustom variant="body1">{ticket?.description}</TypographyCustom>
                    </Box>

                    <TypographyCustom variant={'h6'} fontWeight={'bold'}>Actualizaciones</TypographyCustom>
                    <Divider />
                    <Box sx={{ overflow: "hidden", height: '300px', maxHeight: '400px', width: "100%", paddingBlock: 2 }}>
                        <Box
                            sx={{
                                height: "250px",
                                width: "100%",
                                boxSizing: "content-box",
                                overflowY: "scroll",
                                paddingRight: 5
                            }}
                        >
                            <Actualizations actualizations={actualizations} loading={loading} />
                        </Box>
                    </Box>
                </Box>
            )}
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
                                    <ButtonCustom style={{ padding: 5 }} size="small" variant="outlined" type="button">Cancelar</ButtonCustom>
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

export default function DenseMenu({ ticket, changeStatus }: { ticket: ITicket, changeStatus: (status: TicketStatus) => void }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const statuses: { id: number, description: TicketStatus, color: string }[] = [
        {
            id: 1,
            description: 'Abierto',
            color: purple[300],
        },
        {
            id: 2,
            description: 'En Proceso',
            color: blue[500],
        },
        {
            id: 3,
            description: 'Terminado',
            color: green[500],
        },
        {
            id: 4,
            description: 'Cancelado',
            color: red[500],
        },
    ]

    const priorities = [
        {
            id: 1,
            description: 'Alta',
            color: red[300],
        },
        {
            id: 2,
            description: 'Media',
            color: blue[500],
        },
        {
            id: 3,
            description: 'Baja',
            color: grey[500],
        },
        {
            id: 4,
            description: 'Critica',
            color: yellow[500],
        },
    ]
    return (<>
        <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{ position: 'absolute', top: 10, right: 15 }}
        >
            <MoreHorizRounded />
        </IconButton>
        <Menu
            elevation={0}
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    sx: {
                        width: 250,
                        padding: 0,
                        borderRadius: 4,
                        border: '1px solid rgba(150,150,150,0.5)'
                    }
                }
            }}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuList dense>
                <Divider textAlign="left">
                    <Chip label="Status" size="small" />
                </Divider>
                {statuses.map((status) => <MenuItem key={status.id} onClick={() => changeStatus(status.description)}>{status.description === ticket.status ? <>
                    <ListItemIcon>
                        <Check sx={{ color: status.color }} />
                    </ListItemIcon>
                    {status.description}
                </>
                    : <ListItemText inset>{status.description}</ListItemText>}</MenuItem>)}
                <Divider textAlign="left">
                    <Chip label="Prioridad" size="small" />
                </Divider>
                {priorities.map((priority) => <MenuItem key={priority.id}>{priority.description === ticket.priority ? <>
                    <ListItemIcon>
                        <Check sx={{ color: priority.color }} />
                    </ListItemIcon>
                    {priority.description}
                </>
                    : <ListItemText inset>{priority.description}</ListItemText>}</MenuItem>)}
            </MenuList>
        </Menu>
    </>
    );
}

interface ActualizationsProps {
    actualizations: IActualization[] | null;
    loading: boolean;
}
const Actualizations: FC<ActualizationsProps> = ({ actualizations, loading }) => {

    if (actualizations?.length === 0 && !loading) return (<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <TypographyCustom>No hay actualizaciones para mostrar</TypographyCustom>
    </Box>)

    return (actualizations && actualizations.length > 0 && actualizations.map((actualization, i: number) => (
        <Fragment key={actualization.id}>
            <Box sx={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 1, mt: 2 }}>
                <Avatar>{`${actualization.user.names.charAt(0)}${actualization.user.surnames.charAt(0)}`}</Avatar>
                <Box sx={{ display: 'flex', flexFlow: 'column wrap', gap: 1 }}>
                    <TypographyCustom fontWeight={'bold'}>{`${actualization.user.names} ${actualization.user.surnames}`}</TypographyCustom>
                    <TypographyCustom textAlign={'justify'}>{actualization.description}</TypographyCustom>
                    <TypographyCustom variant="subtitle2" fontWeight={'300'} color="text.secondary">{`${moment(new Date(actualization.created_at ?? '')).format('D/M/Y')}`}</TypographyCustom>
                </Box>
            </Box>
            {i !== actualizations.length - 1 && (<Box sx={{ width: 20, height: 50, borderRight: '1px solid rgba(150,150,150,1)' }}></Box>)}
        </Fragment>
    ))
    )

}