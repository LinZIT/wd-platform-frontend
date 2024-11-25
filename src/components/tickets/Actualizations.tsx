import { FC } from "react";
import { Box, Avatar } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import { TypographyCustom } from "../custom";
import { IActualization } from "../../interfaces/ticket-type";
import moment from "moment";

interface ActualizationsProps {
    actualizations: IActualization[];
    loading: boolean;
}
export const Actualizations: FC<ActualizationsProps> = ({ actualizations, loading }) => {

    if (actualizations?.length === 0 && !loading) return (<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <TypographyCustom>No hay actualizaciones para mostrar</TypographyCustom>
    </Box>)

    return (actualizations && actualizations.length > 0 && actualizations.map((actualization, i: number) => (
        <Fragment key={actualization?.id}>
            <Box sx={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 1, mt: 2 }}>
                {actualization && <Avatar sx={{ bgcolor: actualization.user.color, color: (theme) => theme.palette.getContrastText(actualization.user.color) }}>{`${actualization.user.names.charAt(0)}${actualization.user.surnames.charAt(0)}`}</Avatar>}
                <Box sx={{ display: 'flex', flexFlow: 'column wrap', gap: 1 }}>
                    <TypographyCustom fontWeight={'bold'}>{`${actualization?.user.names} ${actualization?.user.surnames}`}</TypographyCustom>
                    <TypographyCustom textAlign={'justify'}>{actualization?.description}</TypographyCustom>
                    <TypographyCustom variant="subtitle2" fontWeight={'300'} color="text.secondary">{`${moment(new Date(actualization?.created_at ?? '')).format('D/M/Y')}`}</TypographyCustom>
                </Box>
            </Box>
            {i !== actualizations.length - 1 && (<Box sx={{ width: 20, height: 50, borderRight: '1px solid rgba(150,150,150,1)' }}></Box>)}
        </Fragment>
    ))
    )

}