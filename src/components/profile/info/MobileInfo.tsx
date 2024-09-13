import { MoreHorizRounded } from '@mui/icons-material'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import { TypographyCustom } from '../../custom'
import { AvatarCustom } from '../../custom/AvatarCustom'
import { ColorPicker } from '../ColorPicker'
import { ThemeChanger } from '../ThemeChanger'
import { useUserStore } from '../../../store/user/UserStore'
import { useState } from 'react'
import { usePassStore } from '../../../store/password/PasswordStore'

export const MobileInfo = () => {
    const user = useUserStore((state) => state.user);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Box sx={{ display: { xs: 'block', md: 'none' }, }}>
            <Box sx={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <IconButton id="options-button" onClick={handleClick} sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <MoreHorizRounded />
                </IconButton>
                <Menu
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    anchorEl={open ? anchorEl : null}
                    id="more"
                >
                    <MenuItem onClick={() => { usePassStore.getState().setIsChanging(!usePassStore.getState().pass.changing) }}>{`${usePassStore.getState().pass.changing ? 'Cerrar' : 'Cambiar contraseña'}`}</MenuItem>
                    <MenuItem disableRipple><ColorPicker /></MenuItem>
                    <MenuItem disableRipple><ThemeChanger /></MenuItem>
                </Menu>
                <AvatarCustom customsize={80} />
                <Box sx={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', alignItems: "center", width: '80%' }}>
                    <Box sx={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'start', textAlign: 'center', gap: 1 }}>
                        <TypographyCustom>{`${user.names} ${user.surnames}`}</TypographyCustom>
                        <TypographyCustom variant={'subtitle2'} color="text.secondary">{`${user.department?.description} Department`}</TypographyCustom>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
