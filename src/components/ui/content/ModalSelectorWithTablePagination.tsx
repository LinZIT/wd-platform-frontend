import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import YoutubeSearchedForRounded from "@mui/icons-material/YoutubeSearchedForRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';

import { Box, IconButton, Dialog, AppBar, Toolbar, Paper, Table, TableHead, TableRow, TableBody, TableCell, TableContainer, Pagination, useTheme, Chip, Button } from "@mui/material";
import { Dispatch, FC, useState, useContext, useEffect } from "react";
import { errorArrayLaravelTransformToString } from "../../../lib/functions";
import { TypographyCustom } from "../../custom";
import { useUserStore } from "../../../store/user/UserStore";
import { request } from "../../../common/request";
import { Loading } from "./Loading";
import { toast } from "react-toastify";


interface Props {
    title: string;
    text: string;
    data: any;
    setData: Dispatch<any>;
    url: string;
    dataProperty: string;
    dataPropertySecondary?: string;
    dataPropertyAux?: string;
    team?: boolean;
    customHead: string[];
    hashTable: any;
}
export const ModalSelectorWithTablePagination: FC<Props> = ({ title, text, data, setData, url, dataProperty, dataPropertySecondary = '', dataPropertyAux = '', team = false, customHead, hashTable }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [displayData, setDisplayData] = useState<any | null>(null);
    const user = useUserStore(state => state.user);

    const toggleOpen = () => {
        setOpen(!open);
    }
    const handleChange = (data: any) => {
        setData(data)
    }
    const getData = async () => {
        const { status, response, err }: { status: number, response: any, err: any } = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json();
                setOpen(false);
                setDisplayData(data);
                break;
            default:
                console.error('Error fetching data:', err, status);
                break;
        }
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);
    const theme = useTheme();
    // Si se estan buscando registros en la API se muestra un loader
    if (loading) return (<Loading />)
    return (
        <>
            <Box sx={{ p: 2, border: `1px solid rgba(150,150,150,0.5)`, borderRadius: 5 }}>
                <TypographyCustom variant={'subtitle2'}>{!data ? title : team ? <Chip sx={{ background: user.color, fontFamily: 'Geologica' }} label={`Seleccionado: ${data.city[dataProperty]} - ${data.adviser[dataPropertySecondary]} ${data.adviser[dataPropertyAux]}`} />
                    : <Chip sx={{ background: user.color, fontFamily: 'Geologica' }} label={`Seleccionado: ${data[dataProperty]}`} />}</TypographyCustom>
                <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center' }}>
                    <TypographyCustom>{text}</TypographyCustom>
                    <IconButton onClick={() => toggleOpen()}>
                        {!data ? <OpenInNewRounded /> : <YoutubeSearchedForRounded />}
                    </IconButton>
                    {data && (<IconButton onClick={() => setData(null)}>
                        {<CloseRounded />}
                    </IconButton>)}
                </Box>
            </Box>
            <Dialog fullScreen open={open}>
                <AppBar sx={{ width: '100%', background: '#191919' }}>
                    <Toolbar sx={{ background: '#191919' }}>
                        <TypographyCustom>{title}</TypographyCustom>
                        <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {data && <Button onClick={() => toggleOpen()} sx={{ textTransform: 'none', }} variant="contained" >Guardar Cambios</Button>}
                            <IconButton onClick={() => toggleOpen()} sx={{ color: 'white' }}>
                                <CloseRounded />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box sx={{ width: '80%', marginInline: 'auto', marginBlock: 15 }}>
                    {displayData && <DataList data={displayData} setData={setDisplayData} handleChange={handleChange} dataSelected={data} customHead={customHead} hashTable={hashTable} />}
                </Box>
            </Dialog>
        </>
    )
}
interface DataListProps {
    data: any;
    setData: Dispatch<any>;
    dataSelected: any;
    handleChange: (data: any) => void;
    customHead: string[];
    hashTable: any;
}
interface DataItemProps {
    d: any;
    dataSelected: any;
    handleChange: (data: any) => void;
    customHead: string[];
    hashTable: any;
}
const DataList: FC<DataListProps> = ({ data, setData, handleChange, dataSelected, customHead, hashTable }) => {
    const user = useUserStore((state) => state.user);
    const changePage = async (event: React.ChangeEvent<unknown>, page: number) => {
        const url = `${data.path}?page=${page}`
        const options = {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        }
        try {
            const response = await fetch(url, options);
            switch (response.status) {
                case 200:
                    const { data } = await response.json();
                    setData(data)
                    break;
                case 400:
                    toast.error('Ocurrio un error');
                    break;
                case 500:
                    toast.error('Ocurrio un error interno en el servidor')
                    break;
                default:
                    toast.error('Ocurrio un error al conectar con el servidor')
                    break;

            }
        } catch (error) {
            console.log({ error });
            toast.error('Ocurrio un error al conectar con el servidor')
        }
        return;
    }
    return (
        <>
            <Box sx={{ display: 'flex', flexFlow: "row wrap", justifyContent: 'end', mt: 2, mb: 2 }}>
                <Pagination count={data.last_page} page={data.current_page} showFirstButton showLastButton onChange={(event: React.ChangeEvent<unknown>, page: number) => changePage(event, page)} />
            </Box>
            <TableContainer component={Paper} sx={{
                '&::-webkit-scrollbar': {
                    width: '0.4em'
                },
                '&::-webkit-scrollbar-track': {
                    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,.1)',
                }
            }}>
                <Table>
                    <TableHead>
                        <TableRow >
                            {customHead.map((head, i) => (<TableCell key={i} sx={{ whiteSpace: 'nowrap', minWidth: 150, textAlign: 'center' }}>{head}</TableCell>))}
                            <TableCell sx={{ whiteSpace: 'nowrap', minWidth: 150, textAlign: 'center' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.data.map((d: any) => (<DataItem key={d.id} d={d} handleChange={handleChange} dataSelected={dataSelected} customHead={customHead} hashTable={hashTable} />))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', flexFlow: "row wrap", justifyContent: 'end', mt: 2, mb: 2 }}>
                <Pagination count={data.last_page} page={data.current_page} showFirstButton showLastButton onChange={(event: React.ChangeEvent<unknown>, page: number) => changePage(event, page)} />
            </Box>
        </>
    )
}
const DataItem: FC<DataItemProps> = ({ d, handleChange, dataSelected, customHead, hashTable }) => {
    return (
        <TableRow onClick={() => handleChange(d)}>
            {customHead.map((head) => (<TableCell key={head} sx={{ whiteSpace: 'nowrap', minWidth: 150, textAlign: 'center' }}>{d[hashTable[head]]}</TableCell>))}
            <TableCell sx={{ whiteSpace: 'nowrap', minWidth: 150, textAlign: 'center' }}>
                <IconButton onClick={() => handleChange(d)}>
                    {d?.id === dataSelected?.id ? <CheckCircleOutlineRounded color='success' /> : <RadioButtonUncheckedRoundedIcon />}
                </IconButton>
            </TableCell>
        </TableRow>
    )
}