import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ITicket, ITicketNumbers } from "../interfaces/ticket-type"
import { useUserStore } from "../store/user/UserStore"
import { getCookieValue } from "../lib/functions";
export const useTickets: () => {
    tickets: ITicket[];
    setTickets: Dispatch<SetStateAction<ITicket[]>>;
    numbers: {
        abiertos: number;
        en_proceso: number;
        terminados: number;
        cancelados: number;
    };
    setNumbers: Dispatch<SetStateAction<ITicketNumbers>>;
} = () => {
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [numbers, setNumbers] = useState<ITicketNumbers>({ abiertos: 0, en_proceso: 0, terminados: 0, cancelados: 0 });

    const user = useUserStore((state) => state.user);

    useEffect(() => {
        getTickets();
    }, [])

    const getTickets = async () => {
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/tickets`;
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
            setTickets(data.tickets);
            setNumbers(data.numbers);
        } catch (error) {
            console.log(error);
        }
    }
    return { tickets, setTickets, numbers, setNumbers }
}