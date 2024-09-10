import { create } from 'zustand';
import { createCookie, deleteCookie, getCookieValue } from '../../lib/functions';
import { setBearerToken } from '../../lib/axios';
import { darken, lighten } from '@mui/material';
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
    chatWindowOpen: boolean,
    isOnline?: number;
    lighten: string;
    darken: string;
}
export interface IRole {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}
export interface IDepartment {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}
export interface IStatus {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
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
    color: '#394775',
    theme: 'light',
    chatWindowOpen: false,
    isOnline: 0,
    darken: darken('#394775', 0.3),
    lighten: lighten('#394775', 0.3),
}

interface Response {
    status: boolean;
    message: string;
}
interface State {
    user: IUser;
    login: (email: string, password: string) => Promise<Response>;
    logout: () => Promise<boolean>;
    setChatWindow: (value: boolean) => void;
    getChatWindow: () => boolean;
    validateToken: () => Promise<Response>;
    changeTheme: (theme: string) => Promise<Response>;
    changeColor: (color: string) => Promise<Response>;
}
export const useUserStore = create<State>((set, get) => ({
    user: initialState,
    setChatWindow: (value: boolean) => {
        set({ user: { ...get().user, chatWindowOpen: value } })
    },
    getChatWindow: () => get().user.chatWindowOpen,
    login: async (email: string, password: string) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/login`
        const options = {
            method: 'POST',
            headers: {
                // 'Accept': 'application/json',
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
                    console.log("SE COLOCA EL BEARER TOKEN", user.token)
                    setBearerToken(user.token ?? '')
                    user.logged = true;
                    user.isOnline = 1;
                    user.lighten = lighten(user.color, 0.3);
                    user.darken = darken(user.color, 0.3);
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
    logout: async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/logout`
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${get().user.token}`,
            },
        }
        try {
            const response = await fetch(url, options)
            console.log({ response });
            deleteCookie('token');
            set({ user: initialState });
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    },
    validateToken: async () => {
        const token = getCookieValue('token');

        if (!token) return { status: false, message: 'No hay token' }

        const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/data`;
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
                    // console.log('SE COLOCA EL TOKEN EN LA VALIDACION DEL MISMO', user.token)
                    setBearerToken(user.token ?? '')
                    user.logged = true;
                    user.isOnline = 1;
                    user.lighten = lighten(user.color, 0.3);
                    user.darken = darken(user.color, 0.3);
                    set({ user })
                    return { status: true, message: 'Token validado' }
                case 401:
                    return { status: false, message: 'Token invalido' }
                default:
                    return { status: false, message: 'Token invalido' }
            }
        } catch (error) {
            return { status: false, message: 'Token invalido' }
        }
    },
    changeTheme: async (theme: string) => {
        set({ user: { ...get().user, theme } })
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/user/edit/${get().user.id}/theme`
        const body = new URLSearchParams({
            'theme': theme,
        });
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${get().user.token}`,
            },
            body
        }
        try {
            const response = await fetch(url, options);
            switch (response.status) {
                case 200:
                    const { message, status } = await response.json();
                    console.log({ message, status });
                    return { status, message }
                default:
                    return { status: false, message: "Ocurrio un error inesperado" }
            }
        } catch (error) {
            console.log(error)
            return { status: false, message: "No se logro conectar con el servidor" }
        }
    },
    changeColor: async (color: string) => {
        set({ user: { ...get().user, color, lighten: lighten(color, 0.3), darken: darken(color, 0.3), } })
        const url = `${import.meta.env.VITE_BACKEND_API_URL}/user/edit/${get().user.id}/color`
        const body = new URLSearchParams({
            'color': color,
        });
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${get().user.token}`,
            },
            body
        }
        try {
            const response = await fetch(url, options);
            switch (response.status) {
                case 200:
                    const { message, status } = await response.json();
                    console.log({ message, status });
                    return { status, message }
                default:
                    return { status: false, message: "Ocurrio un error inesperado" }
            }
        } catch (error) {
            console.log(error)
            return { status: false, message: "No se logro conectar con el servidor" }
        }
    },

}));