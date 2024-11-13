import { Box, Divider, AvatarGroup, Avatar, Dialog, IconButton, AppBar, Toolbar, } from '@mui/material';
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, FC, useState } from "react";
import { ITicket, TicketStatus } from "../../interfaces/ticket-type";
import { useUserStore } from "../../store/user/UserStore";
import { TypographyCustom } from "../custom";
import moment from "moment";
import DenseMenu from "./DenseMenu";
import { TicketInformation } from ".";
import { AddRounded, CloseRounded } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import { DescripcionDeVista } from '../ui/content/DescripcionDeVista';

interface Props {
    ticket: ITicket;
    setTickets: Dispatch<SetStateAction<ITicket[]>>
}
export const Ticket: FC<Props> = ({ ticket, setTickets }) => {

    const [open, setOpen] = useState<boolean>(false);

    const user = useUserStore((state) => state.user);
    const changeStatus = async (status: TicketStatus) => {
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/ticket/${ticket.id}/status`;
        const body = new URLSearchParams({ status });
        const options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${user?.token}`
            },
            body
        }

        try {
            const response = await fetch(url, options);

            const { data } = await response.json();
            setTickets((tickets) => {
                const except = tickets.filter((mticket) => mticket.id !== ticket.id);
                const newTickets: ITicket[] = [...except, data];
                return newTickets;
            });
        } catch (error) {
            console.log({ error })
        }
    }
    const changePriority = async (priority: 'Alta' | 'Media' | 'Baja' | 'Critica') => {
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/ticket/${ticket.id}/priority`;
        const body = new URLSearchParams({ priority });
        const options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${user?.token}`
            },
            body
        }

        try {
            const response = await fetch(url, options);

            const { data } = await response.json();
            setTickets((tickets) => {
                const except = tickets.filter((mticket) => mticket.id !== ticket.id);
                const newTickets: ITicket[] = [...except, data];
                return newTickets;
            });
        } catch (error) {
            console.log({ error })
        }
    }
    const handleOpen = () => {
        setOpen(true);
    }
    return (
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
            <Box sx={{
                position: 'relative',
            }}>
                <Box
                    component={'div'}
                    sx={{
                        transition: '1s ease all',
                        touchAction: 'none',
                        border: '1px solid rgba(150,150,150,0.2)', borderRadius: 4, m: 1, p: 2, cursor: 'pointer',
                        WebkitUserSelect: 'none',
                        msUserSelect: 'none',
                        userSelect: 'none',
                    }}>
                    <Box onClick={handleOpen}>
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
                    </Box>
                    <Box sx={{ cursor: 'default', display: 'flex', flexFlow: 'row wrap', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                        <TicketAssignmentDialog />
                        <AvatarGroup>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12, background: user.color }}>JL</Avatar>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12, background: '#394775' }}>NB</Avatar>
                        </AvatarGroup>
                    </Box>
                </Box>
                <DenseMenu ticket={ticket} changeStatus={changeStatus} changePriority={changePriority} />
            </Box>
            <TicketInformation ticket_id={ticket.id} open={open} setOpen={setOpen} />
        </motion.div>
    )
}

const TicketAssignmentDialog = () => {

    const [open, setOpen] = useState<boolean>(false)
    const handleClose = () => {
        setOpen(false);
    }
    const handleOpen = () => {
        setOpen(true);
    }
    return (
        <>
            <IconButton onClick={handleOpen} sx={{ cursor: 'pointer', zIndex: 9999, bgcolor: 'transparent', width: 24, height: 24, fontSize: 12, border: '1px solid', borderColor: blue[800] }}><AddRounded fontSize='small' sx={{ color: blue[800] }} /></IconButton>
            <Dialog fullScreen open={open} onClose={handleClose}>
                <AppBar elevation={0}>
                    <Toolbar>
                        <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'flex-end', width: '100%', margin: 'auto' }}>
                            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                                <CloseRounded />
                            </IconButton>
                        </Box>
                    </Toolbar>
                    {/* Formulario de asignación */}
                    {/*... */}
                </AppBar>
                <Toolbar />
                <Box sx={{ marginInline: 'auto', marginTop: 5, width: '80%', }}>
                    <DescripcionDeVista title={'Asignar responsable'} description={'Aqui podras asignar a uno o mas usuarios responsables del ticket en cuestion'} buttons={false} />
                </Box>
            </Dialog>
        </>
    )
}