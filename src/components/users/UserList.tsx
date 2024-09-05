import { FC } from 'react'
import { useUserStore } from '../../store/user/UserStore'
import { UserItem } from './UserItem';
import { Grid2 } from '@mui/material';

interface Props {
    usuarios: any[];
}

export const UserList: FC<Props> = ({ usuarios }) => {
    const user = useUserStore((state) => state.user)
    return (
        <Grid2 container spacing={2}>
            {usuarios.map((usuario: any) => (usuario.id !== user.id && (<UserItem key={usuario.id} usuario={usuario} />)))}
        </Grid2>
    )
}
