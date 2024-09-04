import { useState } from 'react';
import { create } from 'zustand';
import { createCookie, deleteCookie, getCookieValue } from '../../lib/functions';
export interface IUser {
    id: number;
    names: string;
    surnames: string;
    document: string;
    phone: string;
    email: string;
    department_id: number;
    role_id: number;
    status_id: number;
    created_at: string;
    logged: boolean;
    level: number;
    color: string;
    theme: string;
    token?: string;
    role?: IRole;
    department?: IDepartment;
    status?: IStatus;
}
export interface IRole {

}
export interface IDepartment {

}
export interface IStatus {

}
const initialState: IUser = {
    id: 0,
    names: '',
    surnames: '',
    document: '',
    phone: '',
    email: '',
    department_id: 0,
    role_id: 0,
    status_id: 0,
    created_at: '',
    logged: false,
    level: 0,
    color: '#C0EA0F',
    theme: 'light',
}

interface Response {
    status: boolean;
    message: string;
}
interface State {
    user: IUser;
    login: (email: string, password: string) => Promise<Response>;
    logout: () => boolean;
    validateToken: () => Promise<Response>;
}
export const useUserStore = create<State>((set) => ({
    user: initialState,
    login: async (email: string, password: string) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/login`
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'email': email,
                'password': password,
            }),
        }
        try {
            const response = await fetch(url, options);
            switch (response.status) {
                case 200:
                    const { user, message }: { user: IUser, message: string } = await response.json();
                    createCookie('token', user.token ?? '')
                    set({ user })
                    return { status: true, message }
                case 401:
                    return { status: false, message: 'Datos incorrectos' }
                default:
                    return { status: false, message: 'Ocurrio un error interno del servidor, intente mas tarde' }

            }
        } catch (error) {
            console.log({ error });
            return { status: true, message: 'No se logro conectar con el servidor' }
        }
    },
    logout: () => {
        try {
            deleteCookie('token');
            set({ user: initialState });
            return true;
        } catch (error) {
            return false;
        }
    },
    validateToken: async () => {
        const token = getCookieValue('token');

        if (!token) return { status: false, message: 'No hay token' }

        const url = `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/user/data`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
        try {
            const response = await fetch(url, options);
            switch (response.status) {
                case 200:
                    const { user }: { user: IUser } = await response.json();
                    return { status: true, message: 'Token validado' }
                case 401:
                    return { status: false, message: 'Token invalido' }
                default:
                    return { status: false, message: 'Token invalido' }
            }
        } catch (error) {
            return { status: false, message: 'Token invalido' }
        }
    }

}));