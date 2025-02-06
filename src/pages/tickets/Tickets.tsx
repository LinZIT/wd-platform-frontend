import { useEffect } from "react";
import { Layout } from "../../components/ui/Layout"
import { useUserStore } from "../../store/user/UserStore";
import useEcho from "../../components/useEcho";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import AddRounded from "@mui/icons-material/AddRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import DashboardRounded from "@mui/icons-material/DashboardRounded";
import { SelectCustom, TextFieldCustom } from "../../components/custom";
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista";
import { OptionsList } from "../../components/ui/options/OptionsList";
import { KanbanBoard } from "../../components/tickets/KanbanBoard";
import { ITicket } from "../../interfaces/ticket-type";
import { useOpenTicketStore } from "../../store/tickets/OpenTicketsStore";
import { useSocketStore } from "../../store/sockets/SocketStore";

const options = [
    { text: 'Dashboard', icon: <DashboardRounded />, path: '/stats' },
]

export const Tickets = () => {
    const validateToken = useUserStore((state) => state.validateToken);
    const user = useUserStore((state) => state.user);
    // const echo = useEcho();
    const socket = useSocketStore((state) => state);
    const openTickets = useOpenTicketStore((state) => state);
    const addNewTicket = async (data: ITicket) => {
        openTickets.addNewTicket(data);
    }
    useEffect(() => {
        if (!user.token) {
            validateToken();
        }
        if (user.token) {
            if (socket.echo === null) {
                socket.setSocket();
            } else {
                socket.echo.join(`ticketsRoom.${user?.department_id}`)
                    .listen('TicketCreated', async (data: any) => {
                        await handleCallback(data);
                    })
            }
        }
        return () => {
            if (user.token) {
                if (socket.echo) {
                    socket.echo.leave(`ticketsRoom.${user?.department_id}`);
                }
            }
        };
    }, [socket.echo, user.token]);
    const handleCallback = async (data: any) => {
        await addNewTicket(data);
    }
    return (
        <Layout>
            <Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                <DescripcionDeVista title={"Tickets"} description={"Aquí encontraras todas las tus solicitudes de ayuda y comentarios de los clientes"} />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 0.5, gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 2, gap: 2 }}>
                        <SelectCustom label="Filtro" variant="filled" defaultValue="1" value={'1'} fullWidth  >
                            <MenuItem value="1">
                                Documento
                            </MenuItem>
                            <MenuItem value="2">
                                Filtro 2
                            </MenuItem>
                            <MenuItem value="3">
                                Filtro 3
                            </MenuItem>
                            <MenuItem value="4">
                                Filtro 4
                            </MenuItem>
                        </SelectCustom>
                    </Box>
                    <TextFieldCustom label={'Busqueda'} slotProps={{
                        input: {
                            endAdornment: <SearchRounded />
                        }
                    }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: 2 }}>
                        <IconButton sx={{ background: user.color, color: (theme) => theme.palette.getContrastText(user.color) }}>
                            <AddRounded />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <OptionsList options={options} />
            <KanbanBoard />
        </Layout>
    )
}

