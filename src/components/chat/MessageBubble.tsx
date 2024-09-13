import { Box, darken, lighten, Typography, Theme, useTheme, IconButton } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { FC } from 'react'
import { useUserStore } from '../../store/user/UserStore';
import { IChat } from './ChatWindow';
import { ContentCopyRounded } from '@mui/icons-material';
import { toast } from 'react-toastify';

interface Props {
    message: IChat;
}
export const MessageBubble: FC<Props> = ({ message }) => {
    const user = useUserStore((state) => state.user)
    const theme: Theme = useTheme();
    const styles = {
        mainContainer: {
            cursor: 'pointer',
            background: message.from === user.id
                ? darken('#C0ea0f', 0.3)
                : theme.palette.mode === 'dark'
                    ? lighten(theme.palette.background.default, 0.1)
                    : lighten(theme.palette.background.default, 0.9),
            mb: 1,
            // borderRadius: 5,
            borderRadius: `1.2em 1.2em ${message.from === user.id ? '0em' : '1.2em'} ${message.from === user.id ? '1.2em' : '0em'}`,
            p: 2,
            maxWidth: { xs: '90%', sm: '50%', md: '70%' },
            alignSelf: message.from == user.id ? 'end' : 'start'
        },
        subContainer: {
            display: 'flex',
            flexFlow: 'column wrap',
            alignItems: 'center',
            justifyContent: 'center'
        },
        message: {
            width: '100%',
            wordWrap: 'break-word',
            '&::selection': {
                background: darken(user.darken, 0.3)
            }
        },
        date: {
            mt: 2,
            width: '100%'
        }
    }
    return (
        <Box
            sx={styles.mainContainer}
            onDoubleClick={() => {
                toast.info('Mensaje copiado al portapapeles', { containerId: 'chat' });
                navigator.clipboard.writeText(String(message.message));
            }
            }>
            <Box sx={styles.subContainer}>
                <Typography
                    variant='body1'
                    textAlign={'left'}
                    sx={styles.message}


                >
                    {message.message}
                </Typography>
                <Typography
                    variant='subtitle2'
                    color="text.secondary"
                    textAlign={'right'}
                    sx={styles.date}>
                    Hace {formatDistanceToNow(new Date(message.created_at), { locale: es })}
                </Typography>
            </Box>
        </Box>)
}
