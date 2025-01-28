import { create } from 'zustand';
import { ITicket } from '../../interfaces/ticket-type';
import { request } from '../../common/request';
import { useFinishedTicketStore } from './FinishedTicketsStore';
import { useCancelledTicketStore } from './CancelledTicketsStore';
import { useInProcessTicketStore } from './InProcessTicketsStore';

export interface Pagination {
    status: boolean;
    data: Data;
}

export interface Data {
    current_page: number;
    first_page_url: string;
    from: null | number;
    data: ITicket[];
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
interface State {
    pagination: Pagination;
    getTickets: () => Promise<void>;
    getNextPage: (url: string) => Promise<Pagination | null>;
    setTicket: (ticket: ITicket, status: 'En Proceso' | 'Terminado' | 'Cancelado') => void;
    setTicketPriority: (ticket: ITicket, priority: 'Alta' | 'Media' | 'Baja' | 'Critica') => void;
    removeTicket: (ticket_id: number) => void;
    addNewTicket: (ticket: ITicket) => void;
    removeBadge: (ticket: ITicket) => void;
}
export const useOpenTicketStore = create<State>((set, get) => ({
    pagination: {
        status: false,
        data: {
            current_page: 0,
            first_page_url: '',
            from: null,
            data: [],
            last_page: 0,
            last_page_url: '',
            links: [],
            next_page_url: null,
            path: '',
            per_page: 0,
            prev_page_url: null,
            to: null,
            total: 0
        }
    },
    getTickets: async () => {
        const { status, response, err }: { status: number, response: any, err: any } = await request(`/ticket/get/open`, 'GET');
        switch (status) {
            case 200:
                const data = await response.json();
                const pagination = data.data;
                const tickets = pagination.data;
                const old = tickets.filter((t: any) => t.new === 0);
                const news = tickets.filter((t: any) => t.new !== 0);
                const newTickets = [...news, ...old];
                console.log({ pagination })
                set({
                    pagination: {
                        status: true,
                        data: {
                            ...pagination,
                            data: newTickets
                        },
                    }
                });
                break;
            default:
                break;
        }
    },
    getNextPage: async (url: string) => {
        const { status, response, err }: { status: number, response: any, err: any } = await request(`/ticket/category`, 'GET', {} as URLSearchParams, url)
        switch (status) {
            case 200:
                const prevTickets = get().pagination.data.data
                const data = await response.json();
                const newData = [...prevTickets, ...data.data.data]
                set({
                    pagination: {
                        status: true,
                        data: {
                            ...data,
                            data: newData
                        }
                    }
                });
                return data;
            default:
                return data;
        }
    },
    setTicket: (ticket: ITicket, status: 'En Proceso' | 'Terminado' | 'Cancelado') => {
        const tickets = get().pagination.data.data;
        const actualPagination = get().pagination.data
        const newTickets = [...tickets.filter((t) => t.id !== ticket.id), ticket]
        newTickets.sort((a, b) => a.id - b.id);
        if (status === 'Terminado') useFinishedTicketStore.getState().removeTicket(ticket.id)
        if (status === 'Cancelado') useCancelledTicketStore.getState().removeTicket(ticket.id)
        if (status === 'En Proceso') useInProcessTicketStore.getState().removeTicket(ticket.id)
        set({
            pagination: {
                status: true,
                data: {
                    ...actualPagination,
                    data: newTickets,
                }
            }
        })
    },
    setTicketPriority: (ticket: ITicket, priority: 'Alta' | 'Media' | 'Baja' | 'Critica') => {
        const tickets = get().pagination.data.data;
        const actualPagination = get().pagination.data
        const excludeTicket = tickets.filter(t => t.id !== ticket.id)
        const newTicket = { ...ticket, priority }
        const newTickets = [...excludeTicket, newTicket]
        newTickets.sort((a, b) => a.id - b.id);
        set({
            pagination: {
                status: true,
                data: {
                    ...actualPagination,
                    data: newTickets,
                }
            }
        })
    },
    removeTicket: (ticket_id: number) => {
        const newDataExclude = get().pagination.data.data.filter(d => d.id !== ticket_id);
        const pagination = get().pagination.data
        set({
            pagination: {
                status: true,
                data: {
                    ...pagination,
                    data: newDataExclude,
                }
            }
        })
    },
    addNewTicket: (data: any) => {

        const pagination = get().pagination.data;
        const tickets = get().pagination.data.data;
        const validate = tickets.filter(t => t.id === data.ticket.id);
        if (validate?.length > 0) return;
        const newTicket = { ...data.ticket, new: true };
        const newData = [newTicket, ...tickets]
        set({
            pagination: {
                status: true,
                data: {
                    ...pagination,
                    data: newData
                }
            }
        })

    },
    removeBadge: (ticket: ITicket) => {
        const tickets = get().pagination.data.data;
        const actualPagination = get().pagination.data

        const excludeTicket = tickets.filter(t => t.id !== ticket.id)
        const old = excludeTicket.filter(t => t.new === 0);
        const news = excludeTicket.filter(t => t.new !== 0);
        const newTicket = { ...ticket, new: 0 }
        const newTickets = [...old, newTicket]
        newTickets.sort((a, b) => a.id - b.id);
        set({
            pagination: {
                status: true,
                data: {
                    ...actualPagination,
                    data: [...news, ...newTickets],
                }
            }
        })
    }
}));