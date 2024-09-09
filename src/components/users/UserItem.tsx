import { MoreVert } from '@mui/icons-material'
import { Card, CardHeader, Avatar, IconButton, CardActions, useTheme, ListItemButton, ListItemText, Divider, ListItemAvatar, styled, Badge } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { FC, useEffect, useState } from 'react'
import { ChatWindow } from '../chat/ChatWindow'
import useEcho from '../useEcho'
interface Props {
    usuario: any,
}
// const StyledBadge = styled(Badge)(({ theme }) => ());
export const UserItem: FC<Props> = ({ usuario }) => {
    const theme = useTheme();
    const [isOnline, setIsOnline] = useState<boolean>(usuario.isOnline === 1);
    // const echo = useEcho();
    useEffect(() => {
        setIsOnline(usuario.isOnline === 1);
    }, [usuario])

    return (
        <>
            <ListItemButton>
                <ListItemAvatar>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        sx={{
                            '& .MuiBadge-badge': {
                                backgroundColor: isOnline ? '#44b700' : 'grey',
                                color: isOnline ? '#44b700' : 'grey',
                                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                                '&::after': {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    animation: 'ripple 1.2s infinite ease-in-out',
                                    border: '1px solid currentColor',
                                    content: '""',
                                },
                            },
                            '@keyframes ripple': {
                                '0%': {
                                    transform: 'scale(.8)',
                                    opacity: isOnline ? 1 : 0,
                                },
                                '100%': {
                                    transform: 'scale(2.4)',
                                    opacity: 0,
                                },
                            },
                        }}
                    >
                        <Avatar sx={{ bgcolor: usuario.color, color: theme.palette.getContrastText(usuario.color) }} aria-label="recipe">
                            {usuario.names.charAt(0) + usuario.surnames.charAt(0)}
                        </Avatar>
                    </Badge>
                </ListItemAvatar>
                <ListItemText primary={`${usuario.names} ${usuario.surnames}`} secondary={`${usuario.department?.description}`} />
                <ChatWindow usuario={usuario} />
            </ListItemButton >
            <Divider />
        </>
    )
    // return (
    //     <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
    //         <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 5 }}>
    //             <CardHeader
    //                 avatar={
    //                     <Avatar sx={{ bgcolor: usuario.color, color: theme.palette.getContrastText(usuario.color) }} aria-label="recipe">
    //                         {usuario.names.charAt(0) + usuario.surnames.charAt(0)}
    //                     </Avatar>
    //                 }
    //                 action={
    //                     <IconButton aria-label="settings">
    //                         <MoreVert />
    //                     </IconButton>
    //                 }
    //                 title={`${usuario.names} ${usuario.surnames}`}
    //                 subheader={usuario.department?.description}
    //             />
    //             <CardActions disableSpacing>
    //                 <ChatWindow usuario={usuario} />
    //             </CardActions>
    //         </Card>

    //     </Grid>
    // )
}
