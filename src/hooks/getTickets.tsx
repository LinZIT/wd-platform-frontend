import { useEffect, useState } from "react"
import { ITicket } from "../interfaces/kanban-type"
import { useUserStore } from "../store/user/UserStore"

export const getTickets = () => {
    const [tickets, setTickets] = useState<ITicket[] | null>(null)
    const getTickets = async () => {
        const user = useUserStore((state) => state.user);
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/tickets`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${user.token}`,
            }
        }

        try {
            const response = await fetch(url, options);
            switch (response.status) {
                case 200:
                    break;
                case 400:
                    break;
                default:
                    break;
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        getTickets();
    }, [])

    return { tickets, setTickets, getTickets }
}
