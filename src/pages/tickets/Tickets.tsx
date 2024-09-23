import { useEffect } from "react";
import { KanbanBoard } from "../../components/tickets/KanbanBoard"
import { Layout } from "../../components/ui/Layout"
import { useUserStore } from "../../store/user/UserStore";

export const Tickets = () => {
    const validateToken = useUserStore((state) => state.validateToken);
    useEffect(() => {
        validateToken();
    })
    return (
        <Layout container={false}>
            <KanbanBoard />
        </Layout>
    )
}
