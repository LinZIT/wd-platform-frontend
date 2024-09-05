import { MoreVert, MessageRounded, ForumRounded, CloseRounded } from '@mui/icons-material'
import { Grid2, Card, CardHeader, Avatar, IconButton, CardActions, AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Toolbar, Typography, Badge } from '@mui/material'
import { blue } from '@mui/material/colors'
import { ChangeEvent, FC, useState } from 'react'
import { ChatWindow } from '../chat/ChatWindow'
interface Props {
    usuario: any,
}
export const UserItem: FC<Props> = ({ usuario }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [openMessages, setOpenMessages] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const openModal = () => {
        setOpen(true);
    }
    const openModalMessages = () => {
        setOpenMessages(true);
    }

    return (
        <Grid2>
            <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 5 }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
                            {usuario.names.charAt(0) + usuario.surnames.charAt(0)}
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVert />
                        </IconButton>
                    }
                    title={`${usuario.names} ${usuario.surnames}`}
                    subheader="2024 ahahah"
                />
                <CardActions disableSpacing>
                    {/* <IconButton aria-label="Send message" onClick={openModal}>
                        <MessageRounded />
                    </IconButton> */}

                    <ChatWindow usuario={usuario} />

                </CardActions>
            </Card>
            {/* <Dialog open={open}>
                      <DialogTitle>Redacta tu mensaje</DialogTitle>
                      <DialogContent sx={{ p: 5, mt: 2 }}>
                        <TextField multiline label="Mensaje" value={text} onChange={(e: ChangeEvent<HTMLInputElement>) => { setText(e.target.value) }} />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} color='error'>Cancelar</Button>
                        <Button onClick={() => sendMessage(usuario.id)}>Enviar</Button>
                      </DialogActions>
                    </Dialog> */}

        </Grid2>
    )
}
