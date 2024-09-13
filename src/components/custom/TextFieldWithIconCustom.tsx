import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useUserStore } from '../../store/user/UserStore';

export function TextFieldWithIconCustom(
    props: TextFieldProps
) {
    const { children, ...rest } = props;

    const user = useUserStore((state) => state.user);

    return (
        <TextField
            fullWidth
            sx={{
                '& input': {
                    fontFamily: 'Noto Sans Warang Citi',
                },
                '& fieldset': {
                    borderRadius: 4,
                    fontFamily: 'Noto Sans Warang Citi',
                    background: 'rgba(100,100,100,0.1)',
                    border: 'none'
                },
                '& label.Mui-focused': {
                    color: user.color,
                },
                '& label': {
                    fontFamily: 'Noto Sans Warang Citi'
                },
                '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        border: '2px solid',
                        borderColor: user.color,
                    },
                },
            }
            }
            {...rest}
            slotProps={{
                input: {
                    endAdornment: children
                }
            }} />
    );
}