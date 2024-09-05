import { create } from "zustand";

export interface UnreadMessage {
    message: string;
    sender: any;
    date: Date;
}
interface State {
    unreadMessages: UnreadMessage[];
    setUnreadMessages: (unreadMessages: UnreadMessage[]) => void;
    getMessages: () => UnreadMessage[];
}
export const useMessagesStore = create<State>((set, get) => ({
    unreadMessages: [],
    setUnreadMessages: (unreadMessages: UnreadMessage[]) => set({ unreadMessages }),
    getMessages: () => get().unreadMessages,
}))