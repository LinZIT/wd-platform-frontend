import { ButtonProps, Button, useTheme } from "@mui/material";
import { lighten, darken, } from "@mui/material";
import { useUserStore } from "../../store/user/UserStore";

export function ButtonCustom<C extends React.ElementType>(
    props: ButtonProps<C, { component?: C, customcolor?: string, nofull?: boolean }>
) {
    const { children, ...rest } = props;
    const user = useUserStore((state) => state.user);

    const { customcolor, nofull } = rest;
    const theme = useTheme();

    /**
     * Configuraciones de colores del button custom
     */
    const background = rest.variant && rest.variant === 'outlined' ? 'transparent' : customcolor ? darken(customcolor, 0.2) : theme.palette.mode === 'dark' ? user.color : user.darken;
    const borderColor = customcolor ? darken(customcolor, 0.2) : theme.palette.mode === 'dark' ? user.color : user.darken;
    const color = rest.variant && rest.variant !== 'outlined' ? '#FFF' : customcolor ? darken(customcolor, 0.2) : theme.palette.mode === 'dark' ? user.color : user.darken;

    /**
     * (HOVER)
    */
    //  Configuracion del borde basado en tema y props 
    const borderColorHover = customcolor ? customcolor : theme.palette.mode === 'dark' ? user.darken : user.color

    //  Configuracion del fondo basado en tema y props 
    const backgroundHover = rest.variant && rest.variant === 'outlined'
        ? customcolor ? lighten(customcolor, 0.2) : theme.palette.mode === 'dark' ? user.color : user.lighten
        : customcolor ? customcolor : theme.palette.mode === 'dark' ? user.lighten : user.color

    //  Configuracion del color de la letra basado en tema y props 
    const colorHover = theme.palette.getContrastText(
        rest.variant && rest.variant === 'outlined'
            ? customcolor ? lighten(customcolor, 0.2) : theme.palette.mode === 'dark' ? user.color : user.lighten
            : customcolor ? customcolor : theme.palette.mode === 'dark' ? user.lighten : user.color
    )

    return <Button
        fullWidth={nofull ? false : true}
        disableElevation
        sx={{
            fontFamily: 'Geologica',
            borderRadius: 4,
            textTransform: 'none',
            p: 1.5,
            background,
            borderColor,
            color,
            '&:hover': {
                borderColor: borderColorHover,
                background: backgroundHover,
                color: colorHover
            }
        }}
        {...rest}
    >
        {children}
    </Button>;
}