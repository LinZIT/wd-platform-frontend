import { MoreVert } from '@mui/icons-material'
import { Card, CardHeader, Avatar, IconButton, CardActions, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { FC } from 'react'
import { ChatWindow } from '../chat/ChatWindow'
interface Props {
    usuario: any,
}
export const UserItem: FC<Props> = ({ usuario }) => {
    const theme = useTheme();
    return (
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
            <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 5 }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: usuario.color, color: theme.palette.getContrastText(usuario.color) }} aria-label="recipe">
                            {usuario.names.charAt(0) + usuario.surnames.charAt(0)}
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVert />
                        </IconButton>
                    }
                    title={`${usuario.names} ${usuario.surnames}`}
                    subheader={usuario.department.description}
                />
                <CardActions disableSpacing>
                    <ChatWindow usuario={usuario} />
                </CardActions>
            </Card>

        </Grid>
    )
}
