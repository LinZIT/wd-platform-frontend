import { Box, darken, lighten, Typography, Theme, useTheme } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { FC } from 'react'
import { useUserStore } from '../../store/user/UserStore';
import { IChat } from './ChatWindow';

interface Props {
    message: IChat;
}
export const MessageBubble: FC<Props> = ({ message }) => {
    const user = useUserStore((state) => state.user)
    const theme: Theme = useTheme();
    return (<Box sx={{ background: message.from === user.id ? darken('#C0ea0f', 0.3) : theme.palette.mode === 'dark' ? lighten(theme.palette.background.default, 0.1) : lighten(theme.palette.background.default, 0.9), mb: 2, borderRadius: 5, p: 2, maxWidth: { xs: '90%', sm: '50%', md: '70%' }, alignSelf: message.from == user.id ? 'end' : 'start' }}>
        <Box sx={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', }}>
            <Typography variant='body1' textAlign={'left'} sx={{ width: '100%', wordWrap: 'break-word' }}>
                {message.message}
            </Typography>
            <Typography variant='subtitle2' color="text.secondary" textAlign={'right'} sx={{ mt: 2, width: '100%' }}>
                Hace {formatDistanceToNow(message.created_at, { locale: es })}
            </Typography>

        </Box>
    </Box>)
}
