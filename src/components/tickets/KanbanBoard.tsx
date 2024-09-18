import { useMemo, useState } from "react";
import { ButtonCustom, TypographyCustom } from "../custom"
import { Box, Container, darken, lighten } from "@mui/material";
import { DndContext, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";


interface Column {
    id: number;
    title: string;
}

export const KanbanBoard = () => {

    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map(column => column.id), [columns]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);


    const createNewColumn = () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`
        }
        setColumns(prevColumns => [...prevColumns, columnToAdd]);
    }

    const generateId = () => Math.floor(Math.random() * 10000);

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current?.column);
        }
    }

    return (
        <DndContext onDragStart={onDragStart}>
            <Container sx={{ mt: 5 }}>
                <ColumnList columns={columns} />
                <ButtonCustom variant={'contained'} onClick={createNewColumn}>Agregar columna</ButtonCustom>
            </Container>
            {createPortal(
                <DragOverlay>
                    {activeColumn && (<ColumnItem
                        column={activeColumn}
                    />
                    )}
                </DragOverlay>
                , document.body
            )}
        </DndContext>
    )
}
const ColumnList = ({ columns }: { columns: Column[] }) => {
    return (
        <Box sx={{ display: 'flex', flexFlow: 'row wrap', gap: 2, mb: 2, justifyContent: 'center', width: '100%' }}>
            <SortableContext items={columns}>
                {columns.map(column => <ColumnItem column={column} />)}
            </SortableContext>
        </Box>
    )
}

const ColumnItem = ({ column }: { column: Column }) => {

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column
        }
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) <>Hola</>
    return (
        <Box
            ref={setNodeRef}
            style={style}
            sx={{ border: '1px solid rgba(150,150,150,0.5)', borderRadius: 4, width: 225, height: 500 }}
        >
            <Box
                {...attributes}
                {...listeners}
                sx={{
                    p: 1,
                    background: (theme) => theme.palette.mode === 'dark' ? lighten(theme.palette.background.default, 0.1) : darken(theme.palette.background.default, 0.1),
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab'
                }}>
                <TypographyCustom variant="overline">{column.title}</TypographyCustom>
            </Box>
            <Box sx={{ mt: 5 }}>
                <TypographyCustom>content</TypographyCustom>
            </Box>
        </Box>
    )
}