import { CloseRounded, AddRounded } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import Dialog from "@mui/material/Dialog";

import { FormikState, Formik, Form } from "formik";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { request } from "../../common/request";
import { ITicket } from "../../interfaces/ticket-type";
import { useTicketCategoryStore } from "../../store/ticket_categories/TicketCategoryStore";
import { TypographyCustom, TextFieldCustom, ButtonCustom } from "../custom";
import { PopoverPicker } from "./PopoverPicker";
interface Props {
    ticket: ITicket | null,
    setTicket: Dispatch<SetStateAction<ITicket | null>>
}
export const CategoriesDialog: FC<Props> = ({ ticket, setTicket }) => {
    const [openTicketCategory, setOpenTicketCategory] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const categories = useTicketCategoryStore((state) => state.categories);
    const [color, setColor] = useState<string>("#aabbcc");
    const setCategories = useTicketCategoryStore((state) => state.setCategories)
    const getCategories = useTicketCategoryStore((state) => state.getCategories)

    useEffect(() => {
        if (openTicketCategory) {
            getCategories();
        }
    }, [openTicketCategory])

    const changeCategory = async (category: string) => {
        const body = new URLSearchParams({ description: category });
        const { status, response, err }: { status: number, response: any, err: any } = await request(`/ticket/${ticket?.id}/category`, 'PUT', body)
        switch (status) {
            case 200:
                const { data } = await response.json();
                setTicket(data);
                setOpenTicketCategory(false);
                toast.success('Categoría cambiada correctamente');
                break;
            default:
                toast.error('Error al intentar cambiar la categoria')
                break;
        }
    }

    const initialValues = {
        description: ''
    }

    const onSubmit = async (values: { description: string; }, resetForm: (nextState?: Partial<FormikState<{ description: string; }>> | undefined) => void) => {
        const body = new URLSearchParams({ description: String(values.description), color: String(color) });
        const status = await setCategories(body);
        switch (status) {
            case 200:
                setOpenTicketCategory(false);
                resetForm();
                toast.success('Categoría añadida correctamente');
                break;
            default:
                toast.error('No se creo la categoria');
                break;

        }
    }
    return (
        <>
            <Chip size="small" onClick={() => setOpenTicketCategory(true)} label={ticket?.ticket_category?.description} sx={{ width: 80, background: ticket?.ticket_category?.color, color: (theme) => theme.palette.getContrastText(ticket?.ticket_category?.color ?? '#C0EA0F') }} />
            <Dialog open={openTicketCategory} onClose={() => setOpenTicketCategory(false)} maxWidth="sm">
                <List sx={{ pt: 0 }}>
                    <Box sx={{ maxHeight: 200, overflowY: 'hidden' }}>
                        <Box sx={{ maxHeight: 200, overflowY: 'scroll' }}>
                            {categories && categories.map((category) => (
                                <ListItem disableGutters key={category.id} dense>
                                    <ListItemButton onClick={() => changeCategory(category.description)}>
                                        <ListItemAvatar>
                                            <Box sx={{ bgcolor: category.color, borderRadius: '100%', width: 40, height: 40 }} />
                                        </ListItemAvatar>
                                        <ListItemText primary={category.description} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                            {categories && categories.length === 0 && (
                                <Box sx={{ height: 100, display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 2 }}>
                                    <TypographyCustom>No hay categorias disponibles</TypographyCustom>
                                </Box>
                            )}
                        </Box>
                    </Box>
                    {isAdding ?
                        <Formik

                            initialValues={initialValues}
                            onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                        >
                            {({ values, handleSubmit, handleChange }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Grid container sx={{ display: "flex", flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', p: 1, gap: 1 }}>

                                        <Grid><IconButton onClick={() => setIsAdding(false)}><CloseRounded /></IconButton></Grid>
                                        <Grid sx={{ display: 'flex', flexFlow: 'row nowrap', gap: 1, alignItems: 'center' }}>
                                            <PopoverPicker color={color} onChange={setColor} />
                                            <TextFieldCustom disabled label={'Color'} name={'color'} value={color} />
                                        </Grid>
                                        <Grid sx={{ display: 'flex', flexFlow: 'row nowrap', gap: 1, alignItems: 'center' }}>
                                            <Box sx={{ width: 30, height: 30 }}></Box>
                                            <TextFieldCustom fullWidth label={'Descripcion'} name={'description'} value={values.description} onChange={handleChange} />
                                        </Grid>
                                        <Grid>
                                            <ButtonCustom variant="contained" type="submit">Guardar</ButtonCustom>
                                        </Grid>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                        : (<ListItem disableGutters>
                            <ListItemButton
                                autoFocus
                                onClick={() => setIsAdding(true)}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <AddRounded />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Agregar categoria" />
                            </ListItemButton>
                        </ListItem>)}
                </List >
            </Dialog >
        </>
    )
}