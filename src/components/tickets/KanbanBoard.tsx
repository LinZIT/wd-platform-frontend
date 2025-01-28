import { FC, useEffect } from "react";
import { useTheme, darken, lighten, Box, Skeleton, LinearProgress } from "@mui/material";
import { purple, blue, green, red } from "@mui/material/colors";
import { TypographyCustom } from "../custom";
import { Ticket } from "./Ticket";
import { motion } from "framer-motion";
import { useOpenTicketStore } from "../../store/tickets/OpenTicketsStore";
import { useInProcessTicketStore } from "../../store/tickets/InProcessTicketsStore";
import { useFinishedTicketStore } from "../../store/tickets/FinishedTicketsStore";
import { useCancelledTicketStore } from "../../store/tickets/CancelledTicketsStore";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useUserStore } from "../../store/user/UserStore";
export const KanbanBoard: FC = () => {

    const theme = useTheme();
    const user = useUserStore((state) => state.user);
    const openTickets = useOpenTicketStore((state) => state.pagination);
    const inProcessTickets = useInProcessTicketStore((state) => state.pagination);
    const finishedTickets = useFinishedTicketStore((state) => state.pagination);
    const cancelledTickets = useCancelledTicketStore((state) => state.pagination);

    const openTicketsGetNextPage = useOpenTicketStore((state) => state.getNextPage);
    const inProcessTicketsGetNextPage = useInProcessTicketStore((state) => state.getNextPage);
    const finishedTicketsGetNextPage = useFinishedTicketStore((state) => state.getNextPage);
    const cancelledTicketsGetNextPage = useCancelledTicketStore((state) => state.getNextPage);
    const getOpenTickets = useOpenTicketStore((state) => state.getTickets);
    const getInProcessTickets = useInProcessTicketStore((state) => state.getTickets);
    const getFinishedTickets = useFinishedTicketStore((state) => state.getTickets);
    const getCancelledTickets = useCancelledTicketStore((state) => state.getTickets);
    useEffect(() => {
        getOpenTickets();
        getInProcessTickets();
        getFinishedTickets();
        getCancelledTickets();
    }, [])
    const columns = [
        { id: 1, cod: 'abiertos', codEnglish: 'open', status: 'Abiertos', color: purple[300], pagination: openTickets.data },
        { id: 2, cod: 'en_proceso', codEnglish: 'in_process', status: 'En Proceso', color: blue[500], pagination: inProcessTickets.data },
        { id: 3, cod: 'terminados', codEnglish: 'finished', status: 'Terminados', color: green[500], pagination: finishedTickets.data },
        { id: 4, cod: 'cancelados', codEnglish: 'cancelled', status: 'Cancelados', color: red[500], pagination: cancelledTickets.data },
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
        },
        ticketContainer: { flexGrow: 1, minHeight: 210, borderRadius: 4, borderTopRightRadius: 0, borderTopLeftRadius: 0 },
        variants: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.25 } } },
        ticketHeader: { border: '1px solid rgba(150,150,150,0.5)', borderRadius: 4, minWidth: 400, maxWidth: 400, height: '100%', display: 'flex', flexFlow: 'column wrap' }

    }
    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.scrollContainer}>
                {columns.map((column) => <Box key={column.id}>
                    <Box key={column.id} sx={styles.ticketHeader}>
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

                        {/* Tickets Abiertos */}
                        {column.cod === 'abiertos' && (
                            <InfiniteScroll
                                dataLength={openTickets.data.data.length} //This is important field to render the next data
                                next={() => openTicketsGetNextPage(openTickets.data.next_page_url ?? '')}
                                hasMore={openTickets.data.next_page_url ? true : false}
                                loader={<Box sx={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', width: '100%', height: 50, p: 2 }}>
                                    <LinearProgress sx={{ width: '100%' }} />
                                </Box>}
                                endMessage={
                                    <TypographyCustom style={{ textAlign: 'center' }} color="text.secondary">
                                        {openTickets.status === false && openTickets.data.data.length === 0 ? ('Cargando tickets') : 'No hay mas tickets'}
                                    </TypographyCustom>
                                }
                            >
                                <Box sx={styles.ticketContainer} >
                                    {openTickets.status === false && openTickets.data.data.length === 0 && (<TicketSkeleton />)}
                                    <motion.section initial="hidden" animate="show" variants={styles.variants}>
                                        {openTickets.data.data && openTickets.data.data.length > 0 && openTickets.data.data.map((ticket) => (<Ticket key={ticket.id} ticket={ticket} cod={column.cod as "abiertos" | "en_proceso" | "cancelados" | "finalizados"} />))}
                                    </motion.section>
                                </Box>
                            </InfiniteScroll>
                        )}

                        {/* Tickets Cancelados */}
                        {column.cod === 'cancelados' && (
                            <InfiniteScroll
                                dataLength={cancelledTickets.data.data.length} //This is important field to render the next data
                                next={() => cancelledTicketsGetNextPage(cancelledTickets.data.next_page_url ?? '')}
                                hasMore={cancelledTickets.data.next_page_url ? true : false}
                                loader={<Box sx={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', width: '100%', height: 50, p: 2 }}>
                                    <LinearProgress sx={{ width: '100%' }} />
                                </Box>}
                                endMessage={
                                    <TypographyCustom style={{ textAlign: 'center' }} color="text.secondary">
                                        {cancelledTickets.status === false && cancelledTickets.data.data.length === 0 ? ('Cargando tickets') : 'No hay mas tickets'}
                                    </TypographyCustom>
                                }
                            >

                                <Box sx={styles.ticketContainer} >
                                    {cancelledTickets.status === false && cancelledTickets.data.data.length === 0 && (<TicketSkeleton />)}
                                    <motion.section initial="hidden" animate="show" variants={styles.variants}>
                                        {cancelledTickets.data.data && cancelledTickets.data.data.length > 0 && cancelledTickets.data.data.map((ticket) => (<Ticket key={ticket.id} ticket={ticket} cod={column.cod as "abiertos" | "en_proceso" | "cancelados" | "finalizados"} />))}
                                    </motion.section>
                                </Box>
                            </InfiniteScroll>
                        )}

                        {/* Tickets Finalizados */}
                        {column.cod === 'finalizados' && (

                            <InfiniteScroll
                                dataLength={finishedTickets.data.data.length} //This is important field to render the next data
                                next={() => finishedTicketsGetNextPage(finishedTickets.data.next_page_url ?? '')}
                                hasMore={finishedTickets.data.next_page_url ? true : false}
                                loader={<Box sx={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', width: '100%', height: 50, p: 2 }}>
                                    <LinearProgress sx={{ width: '100%' }} />
                                </Box>}
                                endMessage={
                                    <TypographyCustom style={{ textAlign: 'center' }} color="text.secondary">
                                        {finishedTickets.status === false && finishedTickets.data.data.length === 0 ? ('Cargando tickets') : 'No hay mas tickets'}
                                    </TypographyCustom>
                                }
                            >
                                <Box sx={styles.ticketContainer} >
                                    {finishedTickets.status === false && finishedTickets.data.data.length === 0 && (<TicketSkeleton />)}
                                    <motion.section initial="hidden" animate="show" variants={styles.variants}>
                                        {finishedTickets.data.data && finishedTickets.data.data.length > 0 && finishedTickets.data.data.map((ticket) => (<Ticket key={ticket.id} ticket={ticket} cod={column.cod as "abiertos" | "en_proceso" | "cancelados" | "finalizados"} />))}
                                    </motion.section>
                                </Box>
                            </InfiniteScroll>
                        )}

                        {/* Tickets En Proceso */}
                        {column.cod === 'en_proceso' && (
                            <InfiniteScroll
                                dataLength={inProcessTickets.data.data.length} //This is important field to render the next data
                                next={() => inProcessTicketsGetNextPage(inProcessTickets.data.next_page_url ?? '')}
                                hasMore={inProcessTickets.data.next_page_url ? true : false}
                                loader={<Box sx={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', width: '100%', height: 50, p: 2 }}>
                                    <LinearProgress sx={{ width: '100%' }} />
                                </Box>}
                                endMessage={
                                    <TypographyCustom style={{ textAlign: 'center' }} color="text.secondary">
                                        {inProcessTickets.status === false && inProcessTickets.data.data.length === 0 ? ('Cargando tickets') : 'No hay mas tickets'}
                                    </TypographyCustom>
                                }
                            >
                                <Box sx={styles.ticketContainer} >
                                    {inProcessTickets.status === false && inProcessTickets.data.data.length === 0 && (<TicketSkeleton />)}
                                    <motion.section initial="hidden" animate="show" variants={styles.variants}>
                                        {inProcessTickets.data.data && inProcessTickets.data.data.length > 0 && inProcessTickets.data.data.map((ticket) => (<Ticket key={ticket.id} ticket={ticket} cod={column.cod as "abiertos" | "en_proceso" | "cancelados" | "finalizados"} />))}
                                    </motion.section>
                                </Box>
                            </InfiniteScroll>
                        )}
                    </Box >
                </Box>)}
            </Box>
        </Box>
    )
}

const TicketSkeleton = () => (
    <>
        <Box sx={{ width: 300, height: 200, p: 2, mb: 1 }}>
            <Skeleton variant="rounded" animation="wave" width={370} height={180} />
        </Box>
        <Box sx={{ width: 300, height: 200, p: 2, mb: 1 }}>
            <Skeleton variant="rounded" animation="wave" width={370} height={180} />
        </Box>
    </>
)