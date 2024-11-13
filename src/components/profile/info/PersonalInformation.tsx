import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import { TypographyCustom } from '../../custom'
import { useUserStore } from '../../../store/user/UserStore';

export const PersonalInformation = () => {
    const user = useUserStore((state) => state.user);
    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <TypographyCustom variant={'body1'} fontSize={22}>Informacion Personal</TypographyCustom>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Box sx={{ display: 'flex', flexFlow: 'column wrap' }}>
                    <TypographyCustom variant={'subtitle2'} color="text.secondary" fontWeight={200}>Nombres</TypographyCustom>
                    <TypographyCustom variant={'subtitle1'} fontWeight={400}>{user.names}</TypographyCustom>
                </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Box sx={{ display: 'flex', flexFlow: 'column wrap' }}>
                    <TypographyCustom variant={'subtitle2'} color="text.secondary" fontWeight={200}>Apellidos</TypographyCustom>
                    <TypographyCustom variant={'subtitle1'} fontWeight={400}>{user.surnames}</TypographyCustom>
                </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Box sx={{ display: 'flex', flexFlow: 'column wrap' }}>
                    <TypographyCustom variant={'subtitle2'} color="text.secondary" fontWeight={200}>Telefono</TypographyCustom>
                    <TypographyCustom variant={'subtitle1'} fontWeight={400}>{user.phone}</TypographyCustom>
                </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Box sx={{ display: 'flex', flexFlow: 'column wrap' }}>
                    <TypographyCustom variant={'subtitle2'} color="text.secondary" fontWeight={200}>Correo</TypographyCustom>
                    <TypographyCustom variant={'subtitle1'} fontWeight={400}>{user.email}</TypographyCustom>
                </Box>
            </Grid>
        </Grid>
    )
}
