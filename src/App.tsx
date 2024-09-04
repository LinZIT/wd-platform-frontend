import { ChangeEvent, FC, useEffect, useState } from 'react';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import useEcho from './components/useEcho';
import { setBearerToken } from './lib/axios';
import { AppBar, Avatar, Badge, Box, Button, Card, CardActions, CardHeader, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid2, IconButton, TextField, Toolbar, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { CloseRounded, Menu, MessageRounded, MoreVert } from '@mui/icons-material';
import { Howl } from 'howler'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/Dashboard';
import { Theme, ThemeProvider } from '@emotion/react';
import { useUserStore } from './store/user/UserStore';
import { themeDark, themeLight } from './common/theme';
const useGetTheme = () => {
  const user = useUserStore((state) => state.user);
  const [theme, setTheme] = useState<Theme>(themeLight)
  useEffect(() => {
    if (user?.theme === 'dark') {
      setTheme(themeDark);
    } else {
      setTheme(themeLight);
    }
  }, [user?.theme])
  return theme
}
function App() {
  const theme = useGetTheme();
  const [user, setUser] = useState<any>(null);
  const [usuarios, setUsuarios] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const echo = useEcho();
  const [open, setOpen] = useState<boolean>(false);
  const [openMessages, setOpenMessages] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [readMessages, setReadMessages] = useState<any>(null);
  const sound = new Howl({
    src: ['/message.mp3'],
  })

  useEffect(() => {
    if (user) {
      getAllUsers()
      if (echo) {
        echo.join(`chat.${user.id}`)
          .here((users: any) => {
            console.log(users)
          })
          .joining((user: any) => {
            console.log(user.name);
          })
          .leaving((user: any) => {
            console.log(user.name);
          })
          .error((error: any) => {
            console.error(error);
          });
        echo.private(`chat.${user?.id}`).listen('MessageSent', (event: any) => {
          if (event.receiver.id === user?.id)
            console.log('Real-time event received: ', event)
          handleEchoCallback()
        })
      }
    }

    return () => {
      if (echo) {
        echo.leave(`chat.${user.id}`);
      }
    };
  }, [user]);

  const handleEchoCallback = () => {
    setUnreadMessages(prevUnread => prevUnread + 1)
    sound.play()
  }
  const getAllUsers = async () => {

    if (!user) {
      return;
    }
    const url = 'http://localhost:8000/api/get_users';
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }
    try {
      const response = await fetch(url, options);
      const { data } = await response.json();
      console.log({ data })
      setUsuarios(data);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }

  const login = async (id?: number) => {
    const url = 'http://localhost:8000/api/login';
    const body = new URLSearchParams();
    switch (id) {
      case 1:
        body.append('email', 'linz.webdev@gmail.com');
        break;
      case 2:
        body.append('email', 'linz.webdev2@gmail.com');
        break;
      default:
        body.append('email', 'nefjbet@gmail.com');
        break;
    }
    body.append('password', 'v24548539*');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body
    }
    try {
      const response = await fetch(url, options);
      const { user } = await response.json();
      setUser(user);
      setBearerToken(user.token);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }

  const handleClose = () => {
    setOpen(false);
  }
  const handleCloseMessages = () => {
    setOpenMessages(false);
  }
  const openModal = () => {
    setOpen(true)
  }
  const openModalMessages = () => {
    setOpenMessages(true)
  }

  const sendMessage = async (receiver_id: number) => {
    const url = "http://localhost:8000/api/send-message"
    const body = new URLSearchParams()
    body.append('message', String(text))
    body.append('user_id', String(receiver_id))
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
    } catch (error) {
      console.log({ error });
    }
  }

  const getChatWith = async (receiver_id: number) => {
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      {/* <Box sx={{ p: 2 }}>
        <Box>
          {user.token}
          {!user && (<>
            <Typography>Por favor inicia sesion</Typography>
            <Box sx={{ mt: 2 }}>
              <Button sx={{ mr: 2 }} variant="contained" onClick={() => login(1)} color="success">Jose Miguel</Button>
              <Button sx={{ mr: 2 }} variant="contained" onClick={() => login(2)}>JL 2</Button>
              <Button sx={{ mr: 2 }} variant="contained" onClick={() => login(3)} color="secondary">Neftali </Button>
            </Box>
          </>)}
          <br />
          {user && usuarios && (

            <Grid2 container spacing={2}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="h4">Usuarios</Typography>
                <Divider sx={{ marginBlock: 2 }} />
              </Box>
              {usuarios.map((usuario: any) => (usuario.id !== user.id &&
                (
                  <Box key={usuario.id}>
                    <UserItem usuario={usuario} openModal={openModal} openModalMessages={openModalMessages} getChatWith={getChatWith} />
                    <Dialog open={open}>
                      <DialogTitle>Redacta tu mensaje</DialogTitle>
                      <DialogContent sx={{ p: 5, mt: 2 }}>
                        <TextField multiline label="Mensaje" value={text} onChange={(e: ChangeEvent<HTMLInputElement>) => { setText(e.target.value) }} />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} color='error'>Cancelar</Button>
                        <Button onClick={() => sendMessage(usuario.id)}>Enviar</Button>
                      </DialogActions>
                    </Dialog>
                    <Dialog open={openMessages} fullScreen onClose={handleCloseMessages}>
                      <AppBar position="static">
                        <Toolbar>
                          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Chat Messages
                          </Typography>
                          <IconButton onClick={handleCloseMessages}>
                            <CloseRounded />
                          </IconButton>
                        </Toolbar>
                      </AppBar>
                      <DialogContent>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant='h4'>{`Chat con ${usuario.names} ${usuario.surnames}`}</Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                          <ChatMessages usuario={usuario} />
                        </Box>
                      </DialogContent>
                    </Dialog>
                  </Box>
                )
              ))}
            </Grid2>
          )}

        </Box>
      </Box> */}
    </ThemeProvider>
  )
}

const UserItem: FC<{ usuario: any, openModal: () => void, openModalMessages: () => void, getChatWith: (id: number) => void }> = ({ usuario, openModal, openModalMessages, getChatWith }) => {
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
          subheader="2024"
        />
        <CardActions disableSpacing>
          <IconButton aria-label="Send message">
            <MessageRounded onClick={openModal} />
          </IconButton>
          <IconButton aria-label="Send message">
            <ForumRoundedIcon onClick={openModalMessages} />
          </IconButton>

        </CardActions>
      </Card>
    </Grid2>

  )
}

export default App;