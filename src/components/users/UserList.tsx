import { FC } from 'react'
import { UserItem } from './UserItem';
import { List } from '@mui/material';
import { useUserStore } from '../../store/user/UserStore';

interface Props {
    usuarios: any[];
}

export const UserList: FC<Props> = ({ usuarios }) => {

    const user = useUserStore((state) => state.user);
    return (
        <List>
            {usuarios.map((usuario: any) => (usuario.id !== user.id && <UserItem key={usuario.id} usuario={usuario} />))}
        </List>
    )
    // return (
    //     <Grid2 container spacing={2}>
    //         {usuarios.map((usuario: any) => (usuario.id !== user.id && (<UserItem key={usuario.id} usuario={usuario} />)))}
    //     </Grid2>
    // )
}
