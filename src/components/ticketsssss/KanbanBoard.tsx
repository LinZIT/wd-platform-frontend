import { useMemo, useState } from "react";
import { ButtonCustom, TypographyCustom } from "../custom"
import { Avatar, AvatarGroup, Box, CircularProgress, Container, darken, Divider, IconButton, lighten, Skeleton, Stack, useTheme } from "@mui/material";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { IUser, useUserStore } from "../../store/user/UserStore";
import { MoveToInboxRounded } from "@mui/icons-material";
import AddRounded from "@mui/icons-material/AddRounded";
import { IDepartment } from "../../interfaces/department-type";
import { IUserTicket } from "../../interfaces/user-type";

type TicketStatus = 'Abierto' | 'En Proceso' | 'Terminado' | 'Cancelado'

interface Column {
    id: number;
    title: string;
    status: TicketStatus;
}
interface Ticket {
    id: number;
    description: string;
    user_id: number;
    user: IUserTicket;
    department_id: number;
    department: IDepartment;
    category: string;
    priority: string;
    number_of_actualizations: number;
    created_at: string;
    updated_at: string;
    status: TicketStatus;
    placeholder?: boolean;
}
export const KanbanBoard = () => {

    const [columns, setColumns] = useState<Column[]>([
        { id: 1, title: 'Abierto', status: 'Abierto' },
        { id: 2, title: 'En Proceso', status: 'En Proceso' },
        { id: 3, title: 'Terminados', status: 'Terminado' },
        { id: 4, title: 'Cancelados', status: 'Cancelado' },
    ]);

    const [tickets, setTickets] = useState<Ticket[]>([
        {
            id: -2,
            description: "",
            user_id: 0,
            user: {} as IUserTicket,
            department_id: 0,
            department: {} as IDepartment,
            category: "",
            priority: "",
            number_of_actualizations: 0,
            created_at: "",
            updated_at: "",
            status: "Abierto",
            placeholder: true
        },
        {
            id: -1,
            description: "",
            user_id: 0,
            user: {} as IUserTicket,
            department_id: 0,
            department: {} as IDepartment,
            category: "",
            priority: "",
            number_of_actualizations: 0,
            created_at: "",
            updated_at: "",
            status: "En Proceso",
            placeholder: true
        },
        {
            id: -3,
            description: "",
            user_id: 0,
            user: {} as IUserTicket,
            department_id: 0,
            department: {} as IDepartment,
            category: "",
            priority: "",
            number_of_actualizations: 0,
            created_at: "",
            updated_at: "",
            status: "Cancelado",
            placeholder: true
        },
        {
            id: -4,
            description: "",
            user_id: 0,
            user: {} as IUserTicket,
            department_id: 0,
            department: {} as IDepartment,
            category: "",
            priority: "",
            number_of_actualizations: 0,
            created_at: "",
            updated_at: "",
            status: "Terminado",
            placeholder: true
        },
        {
            id: 123456789,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aliquam fugit laborum a, voluptas recusandae minima dolore in molestias veritatis quam incidunt fuga aspernatur? Tempora ipsa dolorum expedita iusto nam?',
            user_id: 1,
            user: {
                id: 1,
                names: "Vanessa",
                surnames: "Rodriguez",
                document: "12345",
                created_at: "hoy sdjajdsaj",
                updated_at: "ayer sdajkdasjdkas"
            },
            department_id: 2,
            department: {
                id: 1,
                description: 'Board',
                created_at: "hoy sdjajdsaj",
                updated_at: "ayer sdajkdasjdkas"
            },
            category: "GouCambis",
            priority: "Alta",
            number_of_actualizations: 3,
            created_at: "09/23/2024",
            updated_at: "ma;ana",
            status: "Abierto"
        },
        {
            id: 124456789,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aliquam fugit laborum a, voluptas recusandae minima dolore in molestias veritatis quam incidunt fuga aspernatur? Tempora ipsa dolorum expedita iusto nam?',
            user_id: 1,
            user: {
                id: 1,
                names: "Vanessa",
                surnames: "Rodriguez",
                document: "12345",
                created_at: "hoy sdjajdsaj",
                updated_at: "ayer sdajkdasjdkas"
            },
            department_id: 2,
            department: {
                id: 1,
                description: 'Board',
                created_at: "hoy sdjajdsaj",
                updated_at: "ayer sdajkdasjdkas"
            },
            category: "GouCambis",
            priority: "Alta",
            number_of_actualizations: 3,
            created_at: "09/23/2024",
            updated_at: "ma;ana",
            status: "Abierto"
        },
        {
            id: 223456789,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aliquam fugit laborum a, voluptas recusandae minima dolore in molestias veritatis quam incidunt fuga aspernatur? Tempora ipsa dolorum expedita iusto nam?',
            user_id: 2,
            user: {
                id: 2,
                names: "Isabela",
                surnames: "Mouzo",
                document: "12345",
                created_at: "hoy sdjajdsaj",
                updated_at: "ayer sdajkdasjdkas"
            },
            department_id: 4,
            department: {
                id: 3,
                description: 'Human Resources',
                created_at: "hoy sdjajdsaj",
                updated_at: "ayer sdajkdasjdkas"
            },
            category: "GouCambis",
            priority: "Alta",
            number_of_actualizations: 0,
            created_at: "09/23/2024",
            updated_at: "ma;ana",
            status: "Cancelado"
        },
        {
            id: 233456789,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aliquam fugit laborum a, voluptas recusandae minima dolore in molestias veritatis quam incidunt fuga aspernatur? Tempora ipsa dolorum expedita iusto nam?',
            user_id: 3,
            user: {
                id: 3,
                names: "Glen",
                surnames: "Benitez",
                document: "12345",
                created_at: "hoy sdjajdsaj",
                updated_at: "ayer sdajkdasjdkas"
            },
            department_id: 2,
            department: {
                id: 1,
                description: 'Board',
                created_at: "hoy sdjajdsaj",
                updated_at: "ayer sdajkdasjdkas"
            },
            category: "GouCambis",
            priority: "Alta",
            number_of_actualizations: 20,
            created_at: "09/23/2024",
            updated_at: "ma;ana",
            status: "En Proceso"
        },
        {
            id: 333456789,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aliquam fugit laborum a, voluptas recusandae minima dolore in molestias veritatis quam incidunt fuga aspernatur? Tempora ipsa dolorum expedita iusto nam?',
            user_id: 4,
            user: {
                id: 4,
                names: "Daiaska",
                surnames: "De Franca",
                document: "12345",
                created_at: "hoy sdjajdsaj",
                updated_at: "ayer sdajkdasjdkas"
            },
            department_id: 6,
            department: {
                id: 6,
                description: 'Analysis',
                created_at: "hoy sdjajdsaj",
                updated_at: "ayer sdajkdasjdkas"
            },
            category: "Excel",
            priority: "Alta",
            number_of_actualizations: 8,
            created_at: "09/23/2024",
            updated_at: "ma;ana",
            status: "Terminado"
        },
    ]);
    const columnsId = useMemo(() => columns.map(column => column.id), [columns]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            }
        })
    )
    const generateId = () => Math.floor(Math.random() * 10000);

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'Column') {
            return;
        }
        if (event.active.data.current?.type === 'Ticket') {
            if (event.active.data.current?.ticket.placeholder) return;
            setActiveTicket(event.active.data.current?.ticket);
            return;
        }
    }

    const onDragEnd = (event: DragEndEvent) => {
        setActiveColumn(null);
        setActiveTicket(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATicket = active.data.current?.type === 'Ticket';
        const isOverATicket = active.data.current?.type === 'Ticket';

        if (isActiveATicket && isOverATicket) {
            setTickets((tickets) => {
                const activeIndex = tickets.findIndex((t) => t.id === activeId);
                const overIndex = tickets.findIndex((t) => t.id === overId);
                return arrayMove(tickets, activeIndex, overIndex)
            })
        }
    }
    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATicket = active.data.current?.type === 'Ticket';

        if (isActiveATicket && active.data.current?.ticket.placeholder) return;

        const isOverATicket = active.data.current?.type === 'Ticket';
        const isOverAColumn = active.data.current?.type === 'Column';
        if (isActiveATicket && isOverAColumn) {
            setTickets((tickets) => {
                const activeIndex = tickets.findIndex((t) => t.id === activeId);
                tickets[activeIndex].status = over.data.current?.column.status;
                return arrayMove(tickets, activeIndex, activeIndex)
            })
        }

        if (!isActiveATicket) return;

        if (isActiveATicket && isOverATicket) {
            setTickets((tickets) => {
                const activeIndex = tickets.findIndex((t) => t.id === activeId);
                const overIndex = tickets.findIndex((t) => t.id === overId);
                tickets[activeIndex].status = tickets[overIndex].status;
                return arrayMove(tickets, activeIndex, overIndex)
            })
        }

    }
    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
            <Box sx={{ mt: 5 }}>
                <ColumnList columns={columns} tickets={tickets} columnsId={columnsId} />
            </Box>
            {createPortal(
                <DragOverlay>
                    {activeTicket && !activeTicket.placeholder && <Ticket ticket={activeTicket} />}
                </DragOverlay>
                , document.body
            )}
        </DndContext>
    )
}

interface ColumnListProps {
    columns: Column[];
    tickets: Ticket[];
    columnsId: number[];
}
const ColumnList = ({ columns, tickets, columnsId }: ColumnListProps) => {
    return (
        <Box sx={{ display: 'flex', flexFlow: 'row wrap', gap: 2, mb: 2, justifyContent: 'center', width: '100%' }}>
            {columns.map(column => <ColumnItem key={column.id} column={column} tickets={tickets.filter(ti => ti.status === column.status)} />)}
        </Box>
    )
}
interface ColumnItemProps {
    column: Column;
    tickets: Ticket[];
}
const ColumnItem = ({ column, tickets }: ColumnItemProps) => {

    const user = useUserStore(state => state.user);

    const ticketsId = useMemo(() => {
        return tickets.map(t => t.id);
    }, [tickets]);

    return (
        <Box
            sx={{ border: '1px solid rgba(150,150,150,0.5)', borderRadius: 4, width: 350, height: '100%', display: 'flex', flexFlow: 'column wrap' }}
        >
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
                }}>
                <TypographyCustom variant="overline">{column.title}</TypographyCustom>
            </Box>
            <Box sx={{ mt: 5, flexGrow: 1 }}>
                <SortableContext items={ticketsId}>
                    {tickets.map((ticket) => (
                        <Ticket key={ticket.id} ticket={ticket} />
                    ))}
                </SortableContext>
            </Box>
        </Box >
    )
}
const Ticket = ({ ticket }: { ticket: Ticket }) => {

    const user = useUserStore(state => state.user);
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: ticket.id,
        data: {
            type: 'Ticket',
            ticket,
        }
    })
    const theme = useTheme();
    const style = {
        transition,
        transform: CSS.Translate.toString(transform)
    }
    if (isDragging) return <Box
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        sx={{
            touchAction: 'none',
            border: `1px solid ${theme.palette.mode === 'dark' ? user.color : user.darken}`, borderRadius: 4, m: 1, p: 2, cursor: 'grab',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none',
            minHeight: 200,
        }}
    >
    </Box>
    if (ticket.placeholder) return <Box
        ref={setNodeRef}
        style={style}
        sx={{ p: 0.5, mb: 2, background: 'red' }}
    ></Box>
    return (
        <Box
            {...attributes}
            {...listeners}
            ref={setNodeRef}
            style={style}
            sx={{
                touchAction: 'none',
                border: '1px solid rgba(150,150,150,0.2)', borderRadius: 4, m: 1, p: 2, cursor: 'grab',

                WebkitUserSelect: 'none', /* Safari */
                msUserSelect: 'none',
                userSelect: 'none',
                // -ms-user-select: none; /* IE 10 and IE 11 */
                // user-select: none; /* Standard syntax */
            }}>
            <TypographyCustom variant={'subtitle2'} fontWeight={'200'}>{ticket.id}</TypographyCustom>
            <TypographyCustom variant={'body1'} fontWeight={'bold'}>{`${ticket.user.names} ${ticket.user.surnames}`}</TypographyCustom>
            <TypographyCustom variant={'subtitle2'} fontWeight={'200'}>{`${ticket.department.description}`}</TypographyCustom>
            <Box sx={{ mt: 2, mb: 2, textAlign: "left" }}>
                <TypographyCustom variant="subtitle2" fontSize={12}>{`${ticket.description.length > 100 ? ticket.description.substring(0, 97) + '...' : ticket.description}`}</TypographyCustom>
            </Box>
            <TypographyCustom variant="subtitle2" color="text.secondary" textAlign={'right'}>{ticket.created_at}</TypographyCustom>
            <Divider sx={{ marginBlock: 1 }} />
            <Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <AvatarGroup>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12, background: user.color }}>JL</Avatar>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12, background: '#394775' }}>NB</Avatar>
                </AvatarGroup>
            </Box>
        </Box>
    )
}