import { Box, darken, lighten, useTheme } from "@mui/material";
import { ITicket } from "../../interfaces/ticket-type";
import { ColumnItem } from "./ColumnItem";
import { SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import { IColumn } from "../../interfaces/kanban-type";

interface Props {
    columns: IColumn[];
    tickets: ITicket[];
    columnsId: string[] | number[];
    numbers: { abiertos: number, en_proceso: number, terminados: number, cancelados: number };
}
export const ColumnList = ({ columns, tickets, columnsId, numbers }: Props) => {
    const [isDraggingATicket, setIsDraggingATicket] = useState<boolean>(false);

    const theme = useTheme();
    const styles = {
        mainContainer: {
            display: 'flex', flexFlow: 'row nowrap', overflowX: 'hidden', minWidth: '100%', maxWidth: '100vw', alignItems: 'center', justifyContent: 'center'
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
        <SortableContext items={columnsId}>
            <Box sx={styles.mainContainer}>
                <Box sx={styles.scrollContainer}>
                    {columns.map(column => <ColumnItem key={column.id} column={column} numbers={numbers} tickets={tickets.filter(ti => ti.status.description === column.status)} isDraggingATicket={isDraggingATicket}
                        setIsDraggingATicket={setIsDraggingATicket} />)}
                </Box>
            </Box>
        </SortableContext>
    )
}

