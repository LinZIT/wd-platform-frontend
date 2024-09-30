import { useSortable } from "@dnd-kit/sortable";
import { Box, Divider, AvatarGroup, Avatar, useTheme } from "@mui/material";
import { ITicket } from "../../interfaces/kanban-type";
import { useUserStore } from "../../store/user/UserStore";
import { TypographyCustom } from "../custom";
import { CSS } from "@dnd-kit/utilities";
import { SetStateAction, Dispatch, useEffect } from 'react';
import AddRounded from "@mui/icons-material/AddRounded";

interface Props {
    ticket: ITicket;
    setIsDraggingATicket?: Dispatch<SetStateAction<boolean>>;
}
export const Ticket = ({ ticket, setIsDraggingATicket }: Props) => {
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

    useEffect(() => {
        if (setIsDraggingATicket) {
            if (isDragging) setIsDraggingATicket(true);
        }
        return () => {
            setIsDraggingATicket && setIsDraggingATicket(false);
        }
    }, [isDragging])

    if (isDragging) return <Box
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        sx={{
            touchAction: 'none',
            border: `1px solid ${theme.palette.mode === 'dark' ? user.color : user.darken}`, borderRadius: 4, m: 1, p: 2, cursor: 'grab',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            color: user.color,
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none',
            minHeight: 200,
        }}
    >
        <AddRounded />
    </Box>
    return (
        <Box
            {...attributes}
            {...listeners}
            ref={setNodeRef}
            style={style}
            sx={{
                touchAction: 'none',
                border: '1px solid rgba(150,150,150,0.2)', borderRadius: 4, m: 1, p: 2, cursor: 'grab',
                WebkitUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',
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