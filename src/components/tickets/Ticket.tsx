import { Box, Divider, AvatarGroup, Avatar, Dialog, IconButton, AppBar, Toolbar, Tooltip, Popover, Chip, useTheme, List, ListItem, ListItemIcon, CircularProgress, ListItemText, LinearProgress, lighten, } from '@mui/material';
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, FC, useState, useEffect } from "react";
import { Assignment, ITicket, TicketStatus } from '../../interfaces/ticket-type';
import { IUser, useUserStore } from "../../store/user/UserStore";
import { TextFieldCustom, TypographyCustom } from "../custom";
import moment from "moment";
import DenseMenu from "./DenseMenu";
import { TicketInformation } from ".";
import { AddRounded } from '@mui/icons-material';
import { request } from '../../common/request';
import { toast } from 'react-toastify';
import { useOpenTicketStore } from '../../store/tickets/OpenTicketsStore';
import { useCancelledTicketStore } from '../../store/tickets/CancelledTicketsStore';
import { useFinishedTicketStore } from '../../store/tickets/FinishedTicketsStore';
import { useInProcessTicketStore } from '../../store/tickets/InProcessTicketsStore';

interface Props {
    ticket: ITicket;
    cod: 'abiertos' | 'en_proceso' | 'cancelados' | 'finalizados'
}
export const Ticket: FC<Props> = ({ ticket }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<IUser | null>(null);
    const user = useUserStore((state) => state.user);
    const [assignments, setAssignments] = useState<Assignment[]>(ticket.assignments);
    const setOpenTicket = useOpenTicketStore(state => state.setTicket);
    const setCancelledTicket = useCancelledTicketStore(state => state.setTicket);
    const setInProcessTicket = useInProcessTicketStore(state => state.setTicket);
    const setFinishedTicket = useFinishedTicketStore(state => state.setTicket);
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

            if (status === 'Abierto') {
                setOpenTicket(data, ticket.status.description as 'Terminado' | 'Cancelado' | 'En Proceso');
            }

            if (status === 'Terminado') {
                setFinishedTicket(data, ticket.status.description as 'Abierto' | 'Cancelado' | 'En Proceso');
            }

            if (status === 'Cancelado') {
                setCancelledTicket(data, ticket.status.description as 'Terminado' | 'Abierto' | 'En Proceso');
            }

            if (status === 'En Proceso') {
                setInProcessTicket(data, ticket.status.description as 'Terminado' | 'Cancelado' | 'Abierto');
            }
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
            // setTickets((tickets) => {
            //     const except = tickets.filter((mticket) => mticket.id !== ticket.id);
            //     const newTickets: ITicket[] = [...except, data];
            //     return newTickets;
            // });
        } catch (error) {
            console.log({ error })
        }
    }
    const handleOpen = () => {
        setOpen(true);
    }
    const customHead = [
        'ID',
        'Nombres',
        'Apellidos',
    ];
    const hashTable = {
        'ID': 'id',
        'Nombres': 'names',
        'Apellidos': 'surnames',
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
                        <AvatarGroup>
                            <TicketAssignmentDialog ticket_id={ticket.id} assignments={assignments} setAssignments={setAssignments} />
                            {assignments && assignments.length > 0 && assignments.map((assignment) => (
                                <Tooltip key={assignment.id} title={`${assignment.user.names} ${assignment.user.surnames}`} >
                                    <Avatar sx={{ width: 24, height: 24, fontSize: 12, background: assignment.user.color, color: (theme) => `${theme.palette.getContrastText(assignment.user.color)} !important` }}>  {`${assignment.user.names.charAt(0)}${assignment.user.surnames.charAt(0)}`}</Avatar>
                                </Tooltip>
                            ))}
                        </AvatarGroup>
                    </Box>
                </Box>
                <DenseMenu ticket={ticket} changeStatus={changeStatus} changePriority={changePriority} />
            </Box>
            <TicketInformation ticket_id={ticket.id} open={open} setOpen={setOpen} />
        </motion.div>
    )
}
interface TicketAssignmentDialogProps {
    ticket_id: number;
    assignments: Assignment[];
    setAssignments: Dispatch<SetStateAction<Assignment[]>>;
}
const TicketAssignmentDialog: FC<TicketAssignmentDialogProps> = ({ ticket_id, assignments, setAssignments }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<IUser[] | null>(null);
    const user = useUserStore((state) => state.user);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const getUsers = async () => {
        setLoading(true);
        const { status, response, err }: { status: number, response: any, err: any } = await request(`/users/it/for/ticket/${ticket_id}/paginated`, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json();
                console.log({ data })
                setUsers(data.data);
                setLoading(false);
                return status;
            default:
                setLoading(false);
                return status;
        }
    }
    const assignUser = async (user_id: number) => {
        const { status, response, err }: { status: number, response: any, err: any } = await request(`/ticket/${ticket_id}/assign/${user_id}`, 'PUT')

        switch (status) {
            case 200:
                const { data } = await response.json();
                setAssignments(data);
                toast.success('Usuario asignado correctamente');
                handleClose();
                break;
            default:
                toast.error('No se logro asignar el usuario');
                break;
        }
    }
    const deleteAssignment = async (user_id: number) => {
        const { status, response, err }: { status: number, response: any, err: any } = await request(`/ticket/${ticket_id}/assign/${user_id}`, 'PUT')

        switch (status) {
            case 200:
                const { data } = await response.json();
                setAssignments(data);
                toast.success('Usuario eliminado correctamente');
                handleClose();
                break;
            default:
                toast.error('No se logro eliminar el usuario');
                break;
        }
    }
    const open = Boolean(anchorEl);
    useEffect(() => {
        if (open) getUsers();
    }, [anchorEl]);
    const id = open ? 'simple-popover' : undefined;
    const theme = useTheme();
    return (
        <>
            <Avatar onClick={(e: any) => handleClick(e)} sx={{ cursor: 'pointer', width: 24, height: 24, fontSize: 12 }}>
                <AddRounded fontSize='small' />
            </Avatar>
            <Popover
                elevation={0}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ width: 300, display: 'flex', flexFlow: 'column wrap', p: 2, gap: 2 }}>

                    {/* Usuarios asignados */}
                    <Box sx={{ gap: 1, display: 'flex', flexFlow: 'row wrap' }}>
                        {assignments && assignments.length > 0 && assignments.map((assignment) => (
                            <Chip
                                key={assignment.id}
                                onClick={() => deleteAssignment(assignment.user.id)}
                                size='small'
                                avatar={
                                    <Avatar sx={{ background: assignment.user.color, color: `${theme.palette.getContrastText(assignment.user.color)} !important` }}>
                                        {`${assignment.user.names.charAt(0)}${assignment.user.surnames.charAt(0)}`}
                                    </Avatar>}
                                label={`${assignment.user.names} ${assignment.user.surnames}`}
                            />
                        ))}
                    </Box>
                    <TextFieldCustom label="Buscar usuario" />
                    <Box>
                        {loading && (<LinearProgress sx={{ background: lighten(user.color, 0.2) }} />)}
                        <List>
                            {!loading && users && users.length > 0 && users.map((user) => (
                                <ListItem>
                                    <Chip onClick={() => assignUser(user.id)} label={`${user.names} ${user.surnames}`} avatar={<Avatar sx={{ background: user.color, color: `${theme.palette.getContrastText(user.color)} !important` }}>{`${user.names.charAt(0)}${user.surnames.charAt(0)}`}</Avatar>} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>
            </Popover>

        </>
    )
}