import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import useClickOutside from "../../hooks/useClickOutside.ts"
import { Box, Button } from "@mui/material";
import { ButtonCustom } from "../custom/ButtonCustom.tsx";
import { TextFieldCustom } from "../custom/TextFieldCustom.tsx";

export const PopoverPicker = ({ color, onChange }: { color: string, onChange: any }) => {
    const popover = useRef();
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    useClickOutside(popover, close);

    return (
        <Box sx={{ position: 'relative' }}>
            <Box
                component={'div'}
                sx={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    border: '3px solid #fff',
                    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                }}
                style={{ backgroundColor: color }}
                onClick={() => toggle(true)}
            />

            {isOpen && (
                <Box sx={{
                    position: 'absolute',
                    top: 'calc(-500% + 2px)',
                    left: 0,
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    borderRadius: 4,
                    zIndex: 99999,
                    p: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: (theme) => theme.palette.background.default,
                    gap: 2
                }} className="popover" ref={popover}>
                    <HexColorPicker style={{ flex: 2, width: '100px', height: '100px' }} color={color} onChange={onChange} />
                    <Box sx={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', alignItem: 'center', width: 100 }}>
                        <TextFieldCustom label="HEX" value={color} onChange={(e: any) => onChange(e.target.value)} />
                        <ButtonCustom onClick={() => toggle(false)} size="small" style={{ marginTop: 2, flex: 1 }} variant="contained">Seleccionar</ButtonCustom>
                    </Box>
                </Box>
            )}
        </Box>
    );
};
