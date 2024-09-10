import { FC, useContext, useState } from 'react'
import { Box, IconButton } from '@mui/material'
const { default: Swal } = await import('sweetalert2');
import { useUserStore } from '../../store/user/UserStore';
export const ColorPicker: FC = () => {
    const [changing, setChanging] = useState<boolean>(false);
    const changeColor = useUserStore((state) => state.changeColor);

    const changeColorLocal = async (color: string) => {
        setChanging(true);
        const result = await changeColor(color);
        if (result.status) {
            Swal.fire({
                title: 'Se cambio el color',
                icon: 'success',
                toast: true,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                position: 'bottom'
            })
            setChanging(false);
        } else {
            Swal.fire({
                title: result.message,
                icon: 'error',
                toast: true,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                position: 'bottom'
            })
            setChanging(false);
        }
    }
    const colors = [
        { color: '#394775' },
        // { color: grey[500] },
        { color: '#C0EA0F' },
    ]

    return (
        <Box sx={{ display: "flex", flexFlow: "row nowrap", alignItems: "center" }}>
            {colors.map((c, i) => (
                <Box key={i}>
                    <IconButton disabled={changing} onClick={() => changeColorLocal(c.color)} >
                        <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: c.color }}></Box>
                    </IconButton>
                </Box>
            ))}
        </Box>
    )
}