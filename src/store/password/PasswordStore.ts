import { create } from 'zustand';
import { createCookie, deleteCookie, errorArrayLaravelTransformToString, getCookieValue } from '../../lib/functions';
import { setBearerToken } from '../../lib/axios';
import { darken, lighten } from '@mui/material';
import { IUser, useUserStore } from '../user/UserStore';
import { toast } from 'react-toastify';
export interface IPass {
    password: string;
    confirmPassword: string;
    changing: boolean;
}

const initialState: IPass = {
    password: '',
    confirmPassword: '',
    changing: false,
}

interface Response {
    status: boolean;
    message: string | string[];
}
interface State {
    pass: IPass;
    setIsChanging: (show: boolean) => void;
    changePass: (password: string, confirmPassword: string) => Promise<Response>;
}
export const usePassStore = create<State>((set, get) => ({
    pass: initialState,
    setIsChanging: (show: boolean) => set({ pass: { ...get().pass, changing: show } }),
    changePass: async (password: string, confirmPassword: string) => {
        console.log(useUserStore.getState().user.token)
        let errors = [];
        if (password !== confirmPassword) errors.push('Las contraseñas no coinciden');
        if (password.length < 8) errors.push('La contraseña debe tener al menos 8 caracteres');
        if (errors.length > 0) {
            return { status: false, message: errors };
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/${useUserStore.getState().user.id}/change/password`
        const options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${useUserStore.getState().user.token}`,
            },
            body: new URLSearchParams({
                'password': password,
                'confirmPassword': confirmPassword,
            })
        }
        try {
            const response = await fetch(url, options)
            if (response.status === 200) {
                const { status, message } = await response.json();
                set({ pass: { password, confirmPassword, changing: false } });
                return { status: true, message: 'Se ha cambiado la contraseña exitosamente' };
            }
            if (response.status === 400) {
                const { errors } = await response.json();
                console.log({ errors })
                set({ pass: { password, confirmPassword, changing: false } });
                return { status: false, message: errorArrayLaravelTransformToString(errors) || 'Ha ocurrido un error con sus datos' };
            }
            return { status: false, message: 'Ha ocurrido un error inesperado' };
        } catch (error) {
            console.log({ error });
            return { status: false, message: 'Ha ocurrido un error inesperado' };
        }
    }
}
));