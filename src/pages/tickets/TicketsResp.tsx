import { FC, useEffect, useRef, useState } from 'react';
import { useUserStore } from '../../store/user/UserStore';
import { Layout } from '../../components/ui/Layout';
import { AddRounded, ChevronLeftRounded, ChevronRightRounded, DashboardRounded, SearchRounded } from '@mui/icons-material';
import { OptionsList } from '../../components/ui/options';
import { DescripcionDeVista } from '../../components/ui/content/DescripcionDeVista';
import { Box, IconButton, Paper } from '@mui/material';
import { TextFieldCustom, TypographyCustom } from '../../components/custom';
import Grid from '@mui/material/Grid2';
import { closestCenter, DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const options = [
    { text: 'Dashboard', icon: <DashboardRounded />, path: '/stats' },
]

interface Item {
    id: number;
    description: string;
    status: 'abierto' | 'cancelado' | 'en proceso' | 'terminado';
}
const initialItemsAbierto: Item[] = [
    { id: 1, description: '1', status: 'abierto' },
    { id: 2, description: '2', status: 'abierto' },
    { id: 3, description: '3', status: 'abierto' },
    { id: 4, description: '4', status: 'abierto' },
    { id: 5, description: '5', status: 'abierto' },
    { id: 6, description: '6', status: 'abierto' },
]
const initialItemsEnProceso: Item[] = [
    { id: 7, description: '1', status: 'en proceso' },
    { id: 8, description: '2', status: 'en proceso' },
    { id: 9, description: '3', status: 'en proceso' },
    { id: 10, description: '4', status: 'en proceso' },
    { id: 11, description: '5', status: 'en proceso' },
    { id: 12, description: '6', status: 'en proceso' },
]
const initialItemsTerminado: Item[] = [
    { id: 13, description: '1', status: 'terminado' },
    { id: 14, description: '2', status: 'terminado' },
    { id: 15, description: '3', status: 'terminado' },
    { id: 16, description: '4', status: 'terminado' },
    { id: 17, description: '5', status: 'terminado' },
    { id: 18, description: '6', status: 'terminado' },
]
const initialItemsCancelado: Item[] = [
    { id: 19, description: '1', status: 'cancelado' },
    { id: 20, description: '2', status: 'cancelado' },
    { id: 21, description: '3', status: 'cancelado' },
    { id: 22, description: '4', status: 'cancelado' },
    { id: 23, description: '5', status: 'cancelado' },
    { id: 24, description: '6', status: 'cancelado' },
]
export const Tickets: FC = () => {
    const [itemsAbiertos, setItemsAbiertos] = useState<Item[]>(initialItemsAbierto)
    const [itemsEnProceso, setItemsEnProceso] = useState<Item[]>(initialItemsEnProceso)
    const [itemsTerminados, setItemsTerminados] = useState<Item[]>(initialItemsTerminado)
    const [itemsCancelados, setItemsCancelados] = useState<Item[]>(initialItemsCancelado)
    const ref = useRef<any>();
    const user = useUserStore((state) => state.user);
    const validateToken = useUserStore((state) => state.validateToken);
    useEffect(() => {
        validateToken();
    }, [user.token])

    const handleDragEnd = (event: DragEndEvent) => {
        console.log('Ending drag', { event })
        // const { active, over } = event;
        // setItems((prevItems) => {
        //     const oldIndex = items.findIndex((item) => item.id === active.id);
        //     const newIndex = items.findIndex((item) => item.id === over.id);
        //     return arrayMove(prevItems, oldIndex, newIndex);
        // })
    }
    const handleDragStart = (event: DragStartEvent) => {
        console.log('Starting drag', { event })
    }
    return (
        <Layout container={false}>
            <DescripcionDeVista title={"Tickets"} description={"Aquí encontraras todas las tus solicitudes de ayuda y comentarios de los clientes"} />
            <OptionsList options={options} />
            <Grid container sx={{ mt: 5 }}>
                <Grid size={11}>
                    <TextFieldCustom label="Buscar" slotProps={{
                        input: {
                            endAdornment: (<IconButton>
                                <SearchRounded />
                            </IconButton>)
                        }
                    }} />
                </Grid>
                <Grid size={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <IconButton sx={{ background: user.color, color: (theme) => theme.palette.getContrastText(user.color) }}>
                        <AddRounded />
                    </IconButton>
                </Grid>
            </Grid>

            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
            >
                <Box sx={styles.overflowContainer}>
                    <Box id='container-tickets' ref={ref} sx={styles.containerTickets}>
                        <Box sx={styles.ticketCategory}>
                            <Paper
                                elevation={0}
                                sx={{ ...styles.paper, position: 'relative' }}>
                                <Box sx={styles.title}>
                                    <TypographyCustom variant="h6">Abiertos</TypographyCustom>
                                    <TypographyCustom variant='subtitle2'>1</TypographyCustom>
                                </Box>
                                <SortableContext strategy={verticalListSortingStrategy} items={itemsAbiertos}>
                                    {itemsAbiertos.map((item, index) => (
                                        <Item item={item} key={item.id} />
                                    ))}
                                </SortableContext>
                            </Paper>
                        </Box>
                        <Box sx={styles.ticketCategory}>
                            <Paper elevation={0} sx={{ ...styles.paper, position: 'relative' }}>
                                <Box sx={styles.title}>
                                    <TypographyCustom variant="h6">En proceso</TypographyCustom>
                                    <TypographyCustom variant='subtitle2'>1</TypographyCustom>
                                </Box>
                                <SortableContext strategy={verticalListSortingStrategy} items={itemsEnProceso}>
                                    {itemsEnProceso.map((item, index) => (
                                        <Item item={item} key={item.id} />
                                    ))}
                                </SortableContext>
                            </Paper>
                        </Box>
                        <Box sx={styles.ticketCategory}>
                            <Paper elevation={0} sx={{ ...styles.paper, position: 'relative' }}>
                                <Box sx={styles.title}>
                                    <TypographyCustom variant="h6">Terminados</TypographyCustom>
                                    <TypographyCustom variant='subtitle2'>1</TypographyCustom>
                                </Box>
                                <SortableContext strategy={verticalListSortingStrategy} items={itemsTerminados}>
                                    {itemsTerminados.map((item, index) => (
                                        <Item item={item} key={item.id} />
                                    ))}
                                </SortableContext>
                            </Paper>
                        </Box>
                        <Box sx={styles.ticketCategory}>
                            <Paper elevation={0} sx={{ ...styles.paper, position: 'relative' }}>
                                <Box sx={styles.title}>
                                    <TypographyCustom variant="h6">Cancelados</TypographyCustom>
                                    <TypographyCustom variant='subtitle2'>1</TypographyCustom>
                                </Box>
                                <SortableContext strategy={verticalListSortingStrategy} items={itemsCancelados}>
                                    {itemsCancelados.map((item, index) => (
                                        <Item item={item} key={item.id} />
                                    ))}
                                </SortableContext>
                            </Paper>
                        </Box>
                    </Box>
                    <IconButton onClick={() => {
                        if (ref && ref.current) ref.current.scrollTo({ left: 0, behavior: "smooth" })
                    }} sx={{ position: 'absolute', top: 30, left: 0 }}><ChevronLeftRounded /></IconButton>
                    <IconButton onClick={() => {
                        if (ref && ref.current) ref.current.scrollTo({ left: ref.current.scrollWidth, behavior: "smooth" })
                    }} sx={{ position: 'absolute', top: 30, right: 0 }}><ChevronRightRounded /></IconButton>
                </Box>
            </DndContext>

        </Layout>
    )
}
interface Props {
    item: Item;
}
const Item: FC<Props> = ({ item }) => {

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: item.id
    })

    const style = {
        transform: CSS.Transform.toString(transform)
    }

    return (
        <Box ref={setNodeRef} {...attributes} {...listeners} sx={{ p: 5, border: '1px solid white', borderRadius: 4, mt: 2, ...style, cursor: 'grab' }}>
            {item.description}
        </Box>
    )
}
const styles = {
    paper: {
        mt: 5,
        p: 5,
        borderRadius: 4,
        width: '100%',
        minHeight: '100vh'
    },
    overflowContainer: {
        maxWidth: '100vw',
        overflowX: 'hidden',
        position: 'relative'
    },
    containerTickets: {
        mr: 5,
        mt: 5,
        mb: 5,
        minWidth: '100%',
        overflowX: 'scroll',
        display: 'flex',
        flexFlow: 'row nowrap',
        gap: 2,
        pb: 2,
        '&::-webkit-scrollbar': {
            mt: 5,
            height: '10px',
            width: '10px',
        },
        '&::-webkit-scrollbar-track': {
            borderRadius: '5px',
            backgroundColor: '#e6e6e6',
        },

        '&::-webkit-scrollbar-track:hover': {
            backgroundColor: '#b9b9b9',
        }
        ,
        '&::-webkit-scrollbar-track:active': {
            backgroundColor: '#696969',
        }
        ,
        '&::-webkit-scrollbar-thumb': {
            borderRadius: '5px',
            backgroundColor: '#757171',
        },

        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#4f4f4f',
        }
        ,
        '&::-webkit-scrollbar-thumb:active': {
            backgroundColor: '#b1b1b1',
        },
    },
    ticketCategory: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 300,
        minWidth: 300
    },
    title: {
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
    }
}