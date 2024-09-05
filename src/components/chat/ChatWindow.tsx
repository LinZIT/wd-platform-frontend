import { CloseRounded, SendRounded } from '@mui/icons-material';
import ForumRounded from '@mui/icons-material/ForumRounded'
import { AppBar, Avatar, Badge, Box, Dialog, DialogActions, DialogContent, Divider, IconButton, Paper, TextField, Toolbar, Typography } from '@mui/material';
import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { useUserStore } from '../../store/user/UserStore';
import { blue, green } from '@mui/material/colors';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';
import useEcho from '../useEcho';
import { UnreadMessage, useMessagesStore } from '../../store/messages/MessagesStore';
interface Props {
    usuario: any;
}
interface IChat {
    id: number;
    user_id: number;
    from: number;
    message: string;
    created_at: string;
}
export const ChatWindow: FC<Props> = ({ usuario }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [chat, setChat] = useState<IChat[]>([]);
    const unreadMessages = useMessagesStore((state) => state.unreadMessages);
    const setUnreadMessages = useMessagesStore((state) => state.setUnreadMessages);
    const ref = useRef()
    const user = useUserStore((state) => state.user)
    const echo = useEcho();

    useEffect(() => {
        if (open) {
            echo.private(`chat.${user?.id}`).listen('MessageSent', (event: any) => {
                if (event.receiver.id === user?.id) {
                    getMessages();
                }
            })
            getMessages();
        }

    }, [open])
    const handleOpen = () => {
        setOpen(true);
        const exceptThisUser = unreadMessages.filter((message) => message.sender.id !== usuario.id)
        setUnreadMessages(exceptThisUser);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const getMessages = async () => {
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/get/chat/${usuario.id}`;
        console.log(url)
        const options = {
            method: 'GET',
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${user?.token}`
            },
        }
        try {
            const response = await fetch(url, options);
            const { data } = await response.json();
            setChat(data)
            scrollTo(ref)
        } catch (error) {
            console.log(error)
        }
    }
    const scrollTo = (ref: any) => {
        if (ref && ref.current /* + other conditions */) {
            setTimeout(() => {
                ref.current.scrollTo({ top: (ref.current.scrollHeight - ref.current.offsetHeight), behavior: "smooth" });
            }, 500)
        }
    }
    const sendMessage = async () => {
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/send-message`
        const body = new URLSearchParams()
        body.append('message', String(text))
        body.append('user_id', String(usuario.id))
        body.append('from', String(user.id))
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${user?.token}`,
            },
            body
        }
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log({ data })
            setText('');
            getMessages();
        } catch (error) {
            console.log({ usuario, user });

        }
    }

    console.log({ unreadMessages })
    return (
        <>
            <Badge color="primary" badgeContent={unreadMessages.filter((message) => message.sender.id === usuario.id).length}>
                <IconButton onClick={handleOpen}>
                    <ForumRounded />
                </IconButton>
            </Badge>
            <Dialog open={open} fullScreen onClose={handleClose} scroll={'paper'} disableScrollLock>
                <AppBar position="static">
                    <Toolbar>
                        <Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', width: '100%' }}>
                            <Box sx={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', gap: 2 }}>
                                <Avatar alt='User Avatar' sx={{
                                    width: 40, height: 40, bgcolor: '#2c375c'
                                }}>{usuario.names.substring(0, 1) + usuario.surnames.substring(0, 1)}</Avatar>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    {`${usuario.names} ${usuario.surnames}`}
                                </Typography>
                            </Box>
                            <IconButton onClick={handleClose}>
                                <CloseRounded />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                <DialogContent sx={{ background: '#fbfbfb' }} id='dialog-content' ref={ref}>
                    <Box sx={{ display: 'flex', flexFlow: 'column wrap', }} >
                        {chat.length > 0 && chat.map((message) => <MessageBubble key={message.id} message={message} usuario={usuario} />)}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <Grid container sx={{ margin: 'auto', width: '100%', display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Grid size={11}>
                            <TextField multiline placeholder='Escribe tu mensaje' value={text} onChange={(e: ChangeEvent<HTMLInputElement>) => { setText(e.target.value) }} fullWidth />

                        </Grid>
                        <Grid size={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton onClick={sendMessage}>
                                <SendRounded />
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </>
    )
}
interface MessageProps {
    message: IChat;
    usuario: any;
}
const MessageBubble: FC<MessageProps> = ({ message, usuario }) => {
    const user = useUserStore((state) => state.user)
    return (<Box sx={{ background: message.from === user.id ? '#394775bd' : '#beea0f70', mb: 2, borderRadius: 5, p: 2, width: '40%', alignSelf: message.from == user.id ? 'end' : 'start' }}>
        <Box sx={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant='body1' textAlign={'left'} sx={{ width: '100%' }}>
                {message.message}
            </Typography>
            <Typography variant='subtitle2' color="text.secondary" textAlign={'right'} sx={{ mt: 2, width: '100%' }}>
                Hace {formatDistanceToNow(message.created_at, { locale: es })}
            </Typography>

        </Box>
    </Box>)
}