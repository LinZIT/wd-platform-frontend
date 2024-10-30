import { IDepartment } from "./department-type";
import { IUserTicket } from "./user-type";

export interface IColumn {
    id: string;
    title: string;
    status: TicketStatus;
}
export interface ITicket {
    id: number;
    description: string;
    user_id: number;
    user: IUserTicket;
    department_id: number;
    department: IDepartment;
    category: string;
    priority: string;
    number_of_actualizations: number;
    created_at: string;
    updated_at: string;
    status: TicketStatus;
}
export type TicketStatus = 'Abierto' | 'En Proceso' | 'Terminado' | 'Cancelado'

export type ITicketNumbers = { abiertos: number, en_proceso: number, terminados: number, cancelados: number }