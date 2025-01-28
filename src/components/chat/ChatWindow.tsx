import { CloseRounded, SendRounded } from '@mui/icons-material';
import ForumRounded from '@mui/icons-material/ForumRounded'
import { AppBar, Avatar, Badge, Box, CircularProgress, Dialog, DialogActions, DialogContent, IconButton, TextField, Theme, Toolbar, Typography, useTheme } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { useUserStore } from '../../store/user/UserStore';
import useEcho from '../useEcho';
import { useMessagesStore } from '../../store/messages/MessagesStore';
import { MessageBubble } from './MessageBubble';
import { Form, Formik, FormikState } from 'formik';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { TextFieldCustom } from '../custom';
import { request } from '../../common/request';
export interface IChat {
    id: number;
    user_id: number;
    from: number;
    message: string;
    created_at: string;
}
interface Props {
    usuario: any;
}
export const ChatWindow: FC<Props> = ({ usuario }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [chat, setChat] = useState<IChat[]>([]);
    const unreadMessages = useMessagesStore((state) => state.unreadMessages);
    const setUnreadMessages = useMessagesStore((state) => state.setUnreadMessages);
    const getUnreadMessages = useMessagesStore((state) => state.getMessages);
    const setChatWindow = useUserStore((state) => state.setChatWindow);
    const ref = useRef()
    const user = useUserStore((state) => state.user)
    const echo = useEcho();
    const [loading, setLoading] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const theme = useTheme();
    useEffect(() => {
        if (user.token) {
            if (echo) {
                if (open) {
                    echo.private(`chat.${user?.id}`).listen('MessageSent', (event: any) => {
                        if (event.receiver.id === user?.id) {
                            setChat((prevChat) => {
                                const newMessages: IChat[] = [...prevChat, { id: prevChat[prevChat.length - 1].id + 1, created_at: String(new Date()), message: event.message, from: event.sender, user_id: event.receiver.id }]
                                return newMessages
                            })
                            scrollTo(ref)
                            setIsTyping(false);
                        }
                    })
                    getMessages();
                }
            }
        }
        return () => {
            if (user.token) {
                if (echo) {
                    if (open) {
                        echo.leave(`chat.${user.id}`);
                    }
                }
            }
        };
    }, [open, echo, user.token])
    const handleOpen = () => {
        setOpen(true);
        setChatWindow(true);
        const exceptThisUser = getUnreadMessages().filter((message) => message.sender.id !== usuario.id)
        setUnreadMessages(exceptThisUser);
        if (user.token) {
            if (echo) {

                echo.private(`chat.${user?.id}`).listenForWhisper('typing', () => {
                    if (!isTyping) {
                        setIsTyping(true);
                    }
                });
                echo.leave(`chat.${user?.id}`);
            }
        }
    }
    const handleClose = () => {
        const exceptThisUser = unreadMessages.filter((message) => message.sender !== usuario.id);
        setUnreadMessages(exceptThisUser);
        setOpen(false);
        setChat([]);
        setLoading(true);
        setChatWindow(false)
        setIsTyping(false);
    }
    const getMessages = async () => {
        const { status, response, err }: { status: number, response: any, err: any } = await request(`/get/chat/${usuario.id}`, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json();
                setChat(data)
                scrollTo(ref)
                setLoading(false);
                break;
            default:
                console.log(err)
                toast.error('Ocurrio un error inesperado');
                break;
        }
    }
    const scrollTo = (ref: any) => {
        if (ref && ref.current /* + other conditions */) {
            setTimeout(() => {
                ref.current.scrollTo({ top: (ref.current.scrollHeight - ref.current.offsetHeight), behavior: "smooth" });
            }, 500)
        }
    }
    const sendMessage = async (values: { message: string; }, resetForm: (nextState?: Partial<FormikState<{ message: string; }>> | undefined) => void) => {
        const body = new URLSearchParams({ 'message': String(values.message), 'user_id': String(usuario.id), 'from': String(user.id) })
        const { status, err }: { status: number, err: any } = await request('/send-message', 'POST', body);
        switch (status) {
            case 200:
                setChat((prevChat) => {
                    const newMessages: IChat[] = [...prevChat, { id: prevChat[prevChat.length - 1].id + 1, created_at: String(new Date()), message: values.message, from: user.id, user_id: usuario.id }]
                    return newMessages
                })
                scrollTo(ref);
                resetForm();
                break;
            default:
                console.log({ err });
                toast.error('Ocurrio un error inesperado');
        }
    }
    return (
        <>
            <Badge color="primary" badgeContent={unreadMessages.filter((message) => message.sender.id === usuario.id).length}>
                <IconButton onClick={handleOpen}>
                    <ForumRounded />
                </IconButton>
            </Badge>
            <Dialog open={open} fullScreen onClose={handleClose} scroll={'paper'} disableScrollLock>
                <AppBar position="static" >
                    <Toolbar>
                        <Box sx={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between', width: '100%' }}>
                            <Box sx={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', gap: 2, }}>
                                <Avatar alt='User Avatar' sx={{
                                    width: 40, height: 40, bgcolor: usuario.color, color: theme.palette.getContrastText(usuario.color)
                                }}>{usuario.names.substring(0, 1) + usuario.surnames.substring(0, 1)}
                                </Avatar>
                                <Box sx={{ display: 'flex', flexFlow: "column wrap" }}>
                                    <Typography variant="subtitle2" component={'p'} sx={{ display: 'inline-block', maxWidth: { xs: "190px", sm: '100%' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>
                                        {`${usuario.names} ${usuario.surnames}`}
                                    </Typography>
                                    {isTyping && (
                                        <Typography variant="subtitle2" component={'p'} fontWeight={300} sx={{ display: 'inline-block', maxWidth: { xs: "190px", sm: '100%' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>
                                            {`escribiendo...`}
                                        </Typography>
                                    )}
                                </Box>

                            </Box>
                            <IconButton onClick={handleClose}>
                                <CloseRounded />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                <DialogContent id='dialog-content' ref={ref} sx={{ background: (theme: Theme) => (theme.palette.background.default) }}>

                    {loading ? (<Box sx={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>) : (
                        <Box sx={{ display: 'flex', flexFlow: 'column wrap' }} >
                            {chat.length > 0 && chat.map((message) => <MessageBubble key={message.id} message={message} />)}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Formik
                        initialValues={{ message: '' }}
                        onSubmit={(values, { resetForm }) => sendMessage(values, resetForm)}
                    >
                        {({ values, handleChange, handleSubmit }) => (
                            <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                <Grid container sx={{ margin: 'auto', width: '100%', display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Grid size={11}>
                                        <TextFieldCustom
                                            variant='filled'
                                            name="message"
                                            placeholder='Escribe tu mensaje'
                                            value={values.message}
                                            onChange={handleChange}
                                            fullWidth
                                            onKeyDownCapture={() => {
                                                if (user.token) {
                                                    if (echo) {
                                                        try {
                                                            echo.private(`chat.${usuario?.id}`).whisper('typing', { user })
                                                            echo.leave(`chat.${usuario?.id}`)
                                                        } catch (error) {
                                                            echo.private(`chat.${usuario?.id}`).whisper('typing', { user })
                                                            echo.leave(`chat.${usuario?.id}`)
                                                        }
                                                    }
                                                }

                                            }}
                                        />
                                    </Grid>
                                    <Grid size={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <IconButton type='submit'>
                                            <SendRounded />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>

                </DialogActions>
                <ToastContainer
                    containerId={'chat'}
                    stacked
                    position="bottom-right"
                    autoClose={1500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    transition={Bounce}
                />
            </Dialog>
        </>
    )
}