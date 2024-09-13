import { FC, useContext, useState } from 'react'
import { Box, IconButton } from '@mui/material'
import { useUserStore } from '../../store/user/UserStore';
import { toast } from 'react-toastify';
export const ColorPicker: FC = () => {
    const [changing, setChanging] = useState<boolean>(false);
    const changeColor = useUserStore((state) => state.changeColor);

    const changeColorLocal = async (color: string) => {
        setChanging(true);
        const result = await changeColor(color);
        if (result.status) {
            toast.success('Se cambio el color');
            setChanging(false);
        } else {
            toast.success(result.message);
            setChanging(false);
        }
    }
    const colors = [
        { color: '#394775' },
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