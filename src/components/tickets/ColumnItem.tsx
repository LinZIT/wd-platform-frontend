import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Box, lighten, darken } from "@mui/material";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useUserStore } from "../../store/user/UserStore";
import { TypographyCustom } from "../custom";
import { IColumn, ITicket } from "../../interfaces/kanban-type";
import { Ticket } from "./Ticket";
import AddRounded from "@mui/icons-material/AddRounded";
import ArrowDownward from "@mui/icons-material/ArrowDownward";

interface Props {
    column: IColumn;
    tickets: ITicket[];
    isDraggingATicket: boolean;
    setIsDraggingATicket: Dispatch<SetStateAction<boolean>>;
}
export const ColumnItem = ({ column, tickets, isDraggingATicket, setIsDraggingATicket }: Props) => {

    const user = useUserStore(state => state.user);
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        }
    });
    const ticketsId = useMemo(() => {
        return tickets.map(t => t.id);
    }, [tickets]);

    return (
        <Box
            sx={{ border: '1px solid rgba(150,150,150,0.5)', borderRadius: 4, minWidth: 400, maxWidth: 400, height: '100%', display: 'flex', flexFlow: 'column wrap' }}
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
            <Box sx={{ flexGrow: 1, minHeight: isDraggingATicket ? 250 : 20, border: isDraggingATicket ? `2px dashed ${user.color}` : '0px solid black', borderRadius: 4, borderTopRightRadius: 0, borderTopLeftRadius: 0 }} id={column.status} {...attributes} {...listeners} ref={setNodeRef}>
                {isDraggingATicket && <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'center', marginBlock: 2, color: user.color }}>
                    <ArrowDownward />
                </Box>
                }
                <SortableContext items={ticketsId}>
                    {tickets.map((ticket) => (
                        <Ticket key={ticket.id} ticket={ticket} setIsDraggingATicket={setIsDraggingATicket} />
                    ))}
                </SortableContext>
            </Box>
        </Box >
    )
}