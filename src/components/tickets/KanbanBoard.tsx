import { FC, useEffect } from "react";
import { useTheme, darken, lighten, Box } from "@mui/material";
import { purple, blue, green, red } from "@mui/material/colors";
import { useTickets } from "../../hooks/useTickets";
import { TypographyCustom } from "../custom";
import { Ticket } from "./Ticket";
import { motion } from "framer-motion";

export const KanbanBoard: FC = () => {
    const { tickets, setTickets, numbers, setNumbers } = useTickets();
    const theme = useTheme();

    const columns = [
        { id: 1, cod: 'abiertos', status: 'Abiertos', color: purple[300], tickets: tickets.filter((ticket) => ticket.status.description === 'Abierto'), number: numbers['abiertos'] },
        { id: 2, cod: 'en_proceso', status: 'En Proceso', color: blue[500], tickets: tickets.filter((ticket) => ticket.status.description === 'En Proceso'), number: numbers['en_proceso'] },
        { id: 3, cod: 'terminados', status: 'Terminados', color: green[500], tickets: tickets.filter((ticket) => ticket.status.description === 'Terminado'), number: numbers['terminados'] },
        { id: 4, cod: 'cancelados', status: 'Cancelados', color: red[500], tickets: tickets.filter((ticket) => ticket.status.description === 'Cancelado'), number: numbers['cancelados'] },
    ]
    const styles = {
        mainContainer: {
            display: 'flex', flexFlow: 'row nowrap', overflowX: 'hidden', minWidth: '100%', maxWidth: '100vw', alignItems: 'center', justifyContent: 'center', mt: 5
        },
        scrollContainer: {
            display: 'flex', flexFlow: 'row nowrap', pb: 2, gap: 2, mb: 2, width: '100vw', overflowX: 'scroll',
            '&::-webkit-scrollbar': {
                height: '5px',
                width: '5px',
            },
            '&::-webkit-scrollbar-track': {
                borderRadius: '5px',
                backgroundColor: darken(theme.palette.background.default, 0.2),
                cursor: theme.palette.mode === 'dark' ? "url('scroll-white.svg') 25 20, pointer" : "url('scroll.svg') 25 20, pointer",
            },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: '5px',
                backgroundColor: lighten(theme.palette.background.default, 0.2),
                cursor: theme.palette.mode === 'dark' ? "url('scroll-white.svg') 25 20, pointer" : "url('scroll.svg') 25 20, pointer",
            },
        }
    }
    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.scrollContainer}>
                {columns.map((column) => <Box key={column.id}>
                    <Box sx={{ border: '1px solid rgba(150,150,150,0.5)', borderRadius: 4, minWidth: 400, maxWidth: 400, height: '100%', display: 'flex', flexFlow: 'column wrap' }}>
                        <Box
                            sx={{
                                p: 1,
                                background: (theme) => theme.palette.mode === 'dark' ? lighten(theme.palette.background.default, 0.1) : darken(theme.palette.background.default, 0.1),
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: `3px solid ${column.color}`
                            }}>
                            <TypographyCustom variant="overline">{column.status}</TypographyCustom>
                        </Box>
                        <Box sx={{ flexGrow: 1, minHeight: 20, borderRadius: 4, borderTopRightRadius: 0, borderTopLeftRadius: 0 }} >
                            <motion.section initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.25 } } }}>
                                {column.tickets.map((ticket) => (<Ticket key={ticket.id} ticket={ticket} setTickets={setTickets} />))}
                            </motion.section>
                        </Box>
                    </Box >
                </Box>)}
            </Box>
        </Box>
    )
}