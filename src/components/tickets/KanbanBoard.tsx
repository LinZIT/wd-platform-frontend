import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { IDepartment } from "../../interfaces/department-type";
import { IUserTicket } from "../../interfaces/user-type";
import { IColumn, ITicket } from "../../interfaces/kanban-type";
import { Ticket } from "./Ticket";
import { ColumnList } from "./ColumnList";
import { useUserStore } from "../../store/user/UserStore";
import { getCookieValue } from "../../lib/functions";

const initialValues: ITicket[] = [
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
]

const columns: IColumn[] = [
    { id: 'columna-1', title: 'Abierto', status: 'Abierto' },
    { id: 'columna-2', title: 'En Proceso', status: 'En Proceso' },
    { id: 'columna-3', title: 'Terminados', status: 'Terminado' },
    { id: 'columna-4', title: 'Cancelados', status: 'Cancelado' },
]

const useTickets = () => {

    const [tickets, setTickets] = useState<ITicket[]>([]);

    const user = useUserStore((state) => state.user);

    useEffect(() => {
        getTickets();
    }, [])

    const getTickets = async () => {
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/tickets`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${user?.token ?? getCookieValue('token')}`,
            },
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const { data } = await response.json();
            console.log({ data })
            setTickets(data.tickets);
        } catch (error) {
            console.log(error);
        }
    }
    return { tickets, setTickets }
}

export const KanbanBoard = () => {

    const { tickets, setTickets } = useTickets();
    const columnsId = useMemo(() => columns.map(column => column.id), [columns]);

    const [activeTicket, setActiveTicket] = useState<ITicket | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            }
        })
    )

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
        setActiveTicket(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATicket = active.data.current?.type === 'Ticket';
        const isOverATicket = over.data.current?.type === 'Ticket';
        const isOverAColumn = over.data.current?.type === 'Column';
        if (isActiveATicket && isOverAColumn) {
            const activeIndex = tickets.findIndex((t) => t.id === activeId);
            const overIndex = tickets.findIndex((t) => t.id === overId);
            tickets[activeIndex].status = over.data.current?.column.status;
            return arrayMove(tickets, activeIndex, overIndex)

        }
        if (isActiveATicket && isOverATicket) {
            setTickets((tickets) => {
                const activeIndex = tickets.findIndex((t) => t.id === activeId);
                return arrayMove(tickets, activeIndex, activeIndex)
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

        // Si el elemento en el drag no es un ticket no hacemos nada
        if (!isActiveATicket) return;

        if (isActiveATicket && active.data.current?.ticket.placeholder) return;

        const isOverATicket = over.data.current?.type === 'Ticket';
        const isOverAColumn = over.data.current?.type === 'Column';



        // Si el elemento en el drag es un ticket y esta encima de una columna
        if (isActiveATicket && isOverAColumn) {
            setTickets((tickets) => {
                const activeIndex = tickets.findIndex((t) => t.id === activeId);
                const overIndex = tickets.findIndex((t) => t.id === overId);
                tickets[activeIndex].status = over.data.current?.column.status;
                return arrayMove(tickets, activeIndex, overIndex)
            })
        }

        // Si el elemento en el drag es un ticket y esta encima de un ticket
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
                    {activeTicket && <Ticket ticket={activeTicket} />}
                </DragOverlay>
                , document.body
            )}
        </DndContext>
    )
}

