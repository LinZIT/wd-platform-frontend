import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ITicket, ITicketNumbers } from "../interfaces/ticket-type"
import { useUserStore } from "../store/user/UserStore"
import { getCookieValue } from "../lib/functions";

export interface Pagination {
    status: boolean;
    data: Data;
}

export interface Data {
    current_page: number;
    data: any[];
    first_page_url: string;
    from: null | number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: null | string;
    path: string;
    per_page: number;
    prev_page_url: null | string;
    to: null | number;
    total: number;
}

export interface Link {
    url: null | string;
    label: string;
    active: boolean;
}


export const useTickets: (category: 'in_process' | 'cancelled' | 'open' | 'finished') => {
    paginationData: Pagination | null;
    setPaginationData: Dispatch<SetStateAction<Pagination | null>>;
    tickets: ITicket[];
    setTickets: Dispatch<SetStateAction<ITicket[]>>;
    numbers: {
        abiertos: number;
        en_proceso: number;
        terminados: number;
        cancelados: number;
    };
    setNumbers: Dispatch<SetStateAction<ITicketNumbers>>;
    loading: boolean;
} = (category) => {
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [paginationData, setPaginationData] = useState<Pagination | null>(null);
    const [numbers, setNumbers] = useState<ITicketNumbers>({ abiertos: 0, en_proceso: 0, terminados: 0, cancelados: 0 });
    const [loading, setLoading] = useState<boolean>(false);

    const user = useUserStore((state) => state.user);

    useEffect(() => {
        getTickets(category);
    }, [])

    const getTickets = async (cat: 'in_process' | 'cancelled' | 'open' | 'finished') => {
        setLoading(true);
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/ticket/get/${cat}`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${user?.token ?? getCookieValue('token')}`,
            },
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const { data } = await response.json();
            console.log({ data })
            setPaginationData(data)
            setTickets(data.data);
            setNumbers(data.numbers);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return { paginationData, setPaginationData, tickets, setTickets, numbers, setNumbers, loading, }
}