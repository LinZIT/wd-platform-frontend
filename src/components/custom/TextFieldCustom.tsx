import TextField, { TextFieldProps } from '@mui/material/TextField';
import { red } from '@mui/material/colors';
import { lighten, darken } from '@mui/material';
import { useUserStore } from '../../store/user/UserStore';

export function TextFieldCustom(
    props: TextFieldProps
) {
    const { children, ...rest } = props;

    const user = useUserStore((state) => state.user);

    return <TextField fullWidth FormHelperTextProps={{ sx: { color: red[500], fontWeight: 'bold' } }} sx={{
        '& input': {
            fontFamily: 'Geologica',
            p: 1.5
        },
        '& fieldset': {
            borderRadius: 4,
            fontFamily: 'Geologica',
        },
        '& label.Mui-focused': {
            color: darken(user.color, 0.3),
        },
        '& label': {
            fontFamily: 'Geologica',
            fontSize: 13
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: lighten(user.color, 0.3),
            },
        },
        'input:-webkit-autofill': {
            borderRadius: 4,
        }

    }
    } {...rest} />;
}