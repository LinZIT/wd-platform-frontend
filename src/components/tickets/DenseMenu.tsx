import { MoreHorizRounded, Check } from "@mui/icons-material";
import { IconButton, Menu, MenuList, Divider, Chip, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { purple, blue, green, red, grey, yellow } from "@mui/material/colors";
import { useState } from "react";
import { ITicket, TicketStatus } from "../../interfaces/ticket-type";

export default function DenseMenu({ ticket, changeStatus, changePriority }: { ticket: ITicket, changeStatus: (status: TicketStatus) => void, changePriority: (priority: 'Alta' | 'Media' | 'Baja' | 'Critica') => void }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const statuses: { id: number, description: TicketStatus, color: string }[] = [
        {
            id: 1,
            description: 'Abierto',
            color: purple[300],
        },
        {
            id: 2,
            description: 'En Proceso',
            color: blue[500],
        },
        {
            id: 3,
            description: 'Terminado',
            color: green[500],
        },
        {
            id: 4,
            description: 'Cancelado',
            color: red[500],
        },
    ]

    const priorities = [
        {
            id: 1,
            description: 'Alta',
            color: red[300],
        },
        {
            id: 2,
            description: 'Media',
            color: blue[500],
        },
        {
            id: 3,
            description: 'Baja',
            color: grey[500],
        },
        {
            id: 4,
            description: 'Critica',
            color: yellow[500],
        },
    ]
    return (<>
        <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{ position: 'absolute', top: 10, right: 15 }}
        >
            <MoreHorizRounded />
        </IconButton>
        <Menu
            elevation={0}
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    sx: {
                        width: 250,
                        padding: 0,
                        borderRadius: 4,
                        border: '1px solid rgba(150,150,150,0.5)'
                    }
                }
            }}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuList dense>
                <Divider textAlign="left">
                    <Chip label="Status" size="small" />
                </Divider>
                {statuses.map((status) => <MenuItem key={status.id} onClick={() => changeStatus(status.description)}>{status.description === ticket.status.description ? <>
                    <ListItemIcon>
                        <Check sx={{ color: status.color }} />
                    </ListItemIcon>
                    {status.description}
                </>
                    : <ListItemText inset>{status.description}</ListItemText>}</MenuItem>)}
                <Divider textAlign="left">
                    <Chip label="Prioridad" size="small" />
                </Divider>
                {priorities.map((priority) => <MenuItem key={priority.id} onClick={() => changePriority(priority.description as 'Alta' | 'Media' | 'Baja' | 'Critica')}>{priority.description === ticket.priority ? <>
                    <ListItemIcon>
                        <Check sx={{ color: priority.color }} />
                    </ListItemIcon>
                    {priority.description}
                </>
                    : <ListItemText inset>{priority.description}</ListItemText>}</MenuItem>)}
            </MenuList>
        </Menu>
    </>
    );
}
