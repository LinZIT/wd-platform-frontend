import { IDepartment, IUser } from "../store/user/UserStore";
import { IUserTicket } from "./user-type";

export interface IActualization {
    id: number;
    ticket_id: number;
    ticket?: ITicket;
    user_id: number;
    user: IUser;
    description: string;
    created_at: string;
    updated_at: string;
}
export interface ITicket {
    id: number;
    description: string;
    user_id: number;
    user: IUserTicket;
    department_id: number;
    department: IDepartment;
    ticket_category_id: number;
    ticket_category: {
        id: number;
        description: string;
        color: string;
        created_at: string;
        updated_at: string;
    };
    priority: string;
    number_of_actualizations: number;
    assignments: Assignment[],
    created_at: string;
    updated_at: string;
    status: {
        id: number;
        description: TicketStatus;
        created_at: string;
        updated_at: string;
    };
    new: number;
}
export type TicketStatus = 'Abierto' | 'En Proceso' | 'Terminado' | 'Cancelado'

export type ITicketNumbers = { abiertos: number, en_proceso: number, terminados: number, cancelados: number }
export interface ITicketCategory {
    id: number;
    description: string;
    color: string;
    created_at: string;
    updated_at: string;
}

export type Assignment = {
    id: number;
    user: IUser;
}