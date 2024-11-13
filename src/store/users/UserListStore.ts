import { create } from "zustand";
import { IUser } from "../user/UserStore";

interface State {
    users: IUser[],
    getUsers: () => IUser[],
    addUsers: (users: IUser[]) => void,
    changeUserIsOnline: (id: number, value: boolean) => void;
}

export const useUserListStore = create<State>((set, get) => ({
    users: [],
    getUsers: () => get().users,
    addUsers: (users: IUser[]) => set({ users: users }),
    changeUserIsOnline: (id: number) => {
        const users = get().users.map((user) => {
            if (user.id === id) return { ...user, isOnline: user.isOnline === 1 ? 0 : 1 };
            return user;
        });
        set({ users });
    }
}))