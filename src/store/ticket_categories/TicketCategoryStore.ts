import { create } from 'zustand';
import { ITicketCategory } from '../../interfaces/ticket-type';
import { useCategories } from '../../hooks/useCategories';
import { request } from '../../common/request';

interface State {
    categories: ITicketCategory[] | null;
    getCategories: () => Promise<ITicketCategory[] | null>;
    setCategories: (body: URLSearchParams) => Promise<number>;
}
export const useTicketCategoryStore = create<State>((set, get) => ({
    categories: [],
    getCategories: async () => {
        const { status, response, err }: { status: number, response: any, err: any } = await request('/ticket/category/all', 'GET');

        switch (status) {
            case 200:
                const { data: categories } = await response.json();
                set({ categories });
                return categories;
            default:
                console.error('Error fetching ticket categories:', err, status);
                return null;
        }
    },
    setCategories: async (body: URLSearchParams) => {
        const { status, response, err }: { status: number, response: any, err: any } = await request(`/ticket/category`, 'POST', body)
        switch (status) {
            case 200:
                const { data } = await response.json();
                set({ categories: data });
                return status;
            default:
                return status;
        }
    }
}));