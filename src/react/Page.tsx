import { useAppContext } from "./AppContext";
import { Group } from "./Group";

export const Page = () => {
    const { data } = useAppContext();

    return (
        data.groups.map((group) => (<Group group={group} />))
    )
}