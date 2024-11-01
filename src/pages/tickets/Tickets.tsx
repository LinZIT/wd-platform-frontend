import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Layout } from "../../components/ui/Layout"
import { useUserStore } from "../../store/user/UserStore";
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista";
import { OptionsList } from "../../components/ui/options/OptionsList";
import DashboardRounded from "@mui/icons-material/DashboardRounded";
import { Avatar, AvatarGroup, Box, Button, Chip, darken, Divider, IconButton, lighten, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper, useTheme } from "@mui/material";
import { SelectCustom, TextFieldCustom, TypographyCustom } from "../../components/custom";
import AddRounded from "@mui/icons-material/AddRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import useEcho from "../../components/useEcho";
import { ITicket, TicketStatus } from "../../interfaces/kanban-type";
import { purple, blue, green, red, yellow, grey } from "@mui/material/colors";
import { useTickets } from "../../hooks/useTickets";
import { Check, MoreHorizRounded, MoreRounded } from "@mui/icons-material";
import { motion } from 'framer-motion';
import { KanbanBoard } from "../../components/tickets/KanbanBoard";
const options = [
    { text: 'Dashboard', icon: <DashboardRounded />, path: '/stats' },
]

export const Tickets = () => {
    const validateToken = useUserStore((state) => state.validateToken);
    const user = useUserStore((state) => state.user);
    const echo = useEcho();
    useEffect(() => {
        validateToken();
        if (user) {
            if (echo) {
                echo.join(`status_online.${user?.isOnline}`)
                    .here((users: any[]) => {
                        console.log({ users })
                    })
            }
        }

    }, []);
    return (
        <Layout container={false}>
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

