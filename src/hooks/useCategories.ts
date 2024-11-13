import { useState, useEffect } from "react";
import { request } from "../common/request";
import { ITicketCategory } from "../interfaces/ticket-type";

export const useCategories = () => {
    const [categories, setCategories] = useState<ITicketCategory[] | null>(null);
    const getCategories = async () => {
        const { status, response, err }: { status: number, response: any, err: any } = await request('/ticket/category/all', 'GET');

        switch (status) {
            case 200:
                const { data } = await response.json();
                setCategories(data as ITicketCategory[]);
                break;
            default:
                console.error('Error fetching ticket categories:', err, status);
        }
    }
    useEffect(() => {
        getCategories();
    }, []);
    return { categories, setCategories }
}