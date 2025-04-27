import { useAppContext } from "./AppContext";
import { Group } from "./Group";

export const Page = () => {
    const { data } = useAppContext();

    if (!data) {
        return <div className="do-more-things-list">Loading...</div>;
    }

    return (
        data.groups.map((group) => (<Group key={group} group={group} />))
    )
}