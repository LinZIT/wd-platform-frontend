import { IDepartment } from "./department-type";
import { TicketStatus } from "./ticket-type";
import { IUserTicket } from "./user-type";

export interface IColumn {
    id: string;
    title: string;
    status: TicketStatus;
}
