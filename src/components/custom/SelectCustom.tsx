import { lighten, darken, useTheme, InputLabel, Select, FormControl, FormHelperText } from '@mui/material';
import { useUserStore } from '../../store/user/UserStore';

interface CustomSelectProps {
    helpertext: string;
    uppersx?: any;
    children: any;
    label: string;
    color: string;
    fullWidth: boolean;
    sx: any;
    labelId: string;
    error: any;

}
export function SelectCustom(
    props: CustomSelectProps
) {
    const { children, ...rest } = props;

    const user = useUserStore((state) => state.user);

    const theme = useTheme();
    const paperProps = {
        sx: {
            '& .MuiMenuItem-root.Mui-selected': {
                backgroundColor: user.color,
                color: theme.palette.getContrastText(user.color)
            },
            "& .MuiMenuItem-root:hover": {
                backgroundColor: lighten(user.color, 0.7),
                color: theme.palette.getContrastText(lighten(user.color, 0.7))
            },
            "& .MuiMenuItem-root.Mui-selected:hover": {
                backgroundColor: darken(user.color, 0.5),
                color: theme.palette.getContrastText(darken(user.color, 0.5))
            }
        }
    }
    const baseStyles = {
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: user.lighten,
        },
        '& fieldset': {
            borderRadius: 4,
        },
        '& .MuiSelect-select': {
            fontFamily: 'Noto Sans Warang Citi',
        },
    }
    const selectSx = rest.sx
        ? {
            ...baseStyles,
            ...rest.sx,
        }
        : baseStyles
    return (
        <FormControl fullWidth error={rest.error}>
            <InputLabel id={rest.labelId} sx={{
                fontFamily: 'Noto Sans Warang Citi',
                '&.Mui-focused': {
                    color: user.color
                },
            }}>{rest.label}</InputLabel>
            <Select MenuProps={paperProps} sx={selectSx} >
                {children}
            </Select>
            {rest.helpertext && rest.error ? <FormHelperText>{rest.helpertext}</FormHelperText> : ''}
        </FormControl>
    )
}