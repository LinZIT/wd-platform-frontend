import Button, { ButtonProps } from "@mui/material/Button";
import { lighten, darken, useTheme } from "@mui/material";
import { Dispatch } from "react";
const { default: Swal } = await import('sweetalert2');
import { blue, red } from "@mui/material/colors";
import { useUserStore } from "../../store/user/UserStore";

export function ButtonCancelCustom<C extends React.ElementType>(
    props: ButtonProps<C, { component?: C, customcolor?: string, nofull?: boolean, setValues: Dispatch<any>, initialValues: any }>
) {
    const { children, ...rest } = props;
    const user = useUserStore((state) => state.user);
    const { customcolor } = rest;
    const theme = useTheme();
    const onClick = () => {
        Swal.fire({
            title: '¿Deseas borrar todos los campos?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: red[500],
            confirmButtonColor: blue[500],
            confirmButtonText: 'Si, deseo borrar todos los campos',
            cancelButtonText: 'Cancelar',
            focusCancel: true
        }).then((click) => {
            if (click.isConfirmed) {
                rest.setValues(rest.initialValues)
            }
        })
    }
    return <Button
        onClick={onClick}
        disableElevation
        sx={{
            fontFamily: 'Geologica',
            borderRadius: 4,
            textTransform: 'none',
            p: 1.5,
            fontSize: 16,
            borderColor: customcolor ? lighten(customcolor, 0.2) : user.lighten,
            color: rest.variant && rest.variant !== 'outlined' ? '#FFF' : customcolor ? darken(customcolor, 0.2) : user.darken,
            '&:hover': {
                borderColor: customcolor ? customcolor : theme.palette.mode === 'dark' ? user.darken : user.color,
                background:
                    rest.variant && rest.variant === 'outlined'
                        ? customcolor ? lighten(customcolor, 0.2) : theme.palette.mode === 'dark' ? user.color : user.lighten
                        : customcolor ? customcolor : theme.palette.mode === 'dark' ? user.lighten : user.color
                ,
                color: theme.palette.getContrastText(
                    rest.variant && rest.variant === 'outlined'
                        ? customcolor ? lighten(customcolor, 0.2) : theme.palette.mode === 'dark' ? user.color : user.lighten
                        : customcolor ? customcolor : theme.palette.mode === 'dark' ? user.lighten : user.color
                )
            }
        }} {...rest} >{children}</Button>;
}