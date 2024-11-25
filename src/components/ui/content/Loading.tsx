import { Box, CircularProgress } from '@mui/material';
import { useUserStore } from '../../../store/user/UserStore';

export const Loading = () => {
    const user = useUserStore((state) => state.user);
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <CircularProgress sx={{ color: user.color }} />
        </Box>
    )
}