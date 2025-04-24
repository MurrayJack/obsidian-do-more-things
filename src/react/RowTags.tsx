import { Things3Todo } from "../types"
import { useAppContext } from "./AppContext";

export const RowTags = ({ item }: { item: Things3Todo }) => {

    const { settings } = useAppContext();

    if (!settings.showTags) {
        return <span></span>;
    }

    if (!item.tags || item.tags.length === 0) {
        return <span></span>;
    }

    return (
        <span className="do-more-things-list-tag">{item.tags.join(", ")}</span>
    );
}