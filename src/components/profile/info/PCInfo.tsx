import Box from '@mui/material/Box'
import { TypographyCustom, ButtonCustom } from '../../custom'
import { AvatarCustom } from '../../custom/AvatarCustom'
import { ColorPicker } from '../ColorPicker'
import { ThemeChanger } from '../ThemeChanger'
import { useUserStore } from '../../../store/user/UserStore'
import { usePassStore } from '../../../store/password/PasswordStore'

export const PCInfo = () => {
    const user = useUserStore((state) => state.user);
    return (
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ display: 'flex', flexFlow: 'row wrap', gap: 2, }}>
                    <AvatarCustom customsize={65} />
                    <Box sx={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'start', textAlign: 'start' }}>
                        <TypographyCustom>{`${user.names} ${user.surnames}`}</TypographyCustom>
                        <TypographyCustom variant={'subtitle2'} color="text.secondary">{`${user.department?.description}`}</TypographyCustom>
                        <TypographyCustom variant={'subtitle2'} color="text.secondary">{`${user.role?.description}`}</TypographyCustom>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: "center" }}>
                    <Box sx={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', gap: 1 }}>
                        <ButtonCustom variant={'outlined'} style={{ height: 40 }} onClick={() => usePassStore.getState().setIsChanging(!usePassStore.getState().pass.changing)}>
                            {`${usePassStore.getState().pass.changing ? 'Cerrar' : 'Cambiar contraseña'}`}
                        </ButtonCustom>
                        <ColorPicker />
                        <ThemeChanger />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
