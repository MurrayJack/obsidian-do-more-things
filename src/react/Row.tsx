import { Things3Todo } from "../types"
import { RowTags } from "./RowTags"
import { RowNoteIcon } from "./RowNoteIcon"
import { useAppContext } from "./AppContext"

export const Row = ({ item }: { item: Things3Todo }) => {

    const { callBack } = useAppContext();

    const checked = item.status !== 'open';

    const handleOnClick = (e: React.MouseEvent<HTMLInputElement>) => {
        callBack("checkbox", e.nativeEvent);
    }

    const url = `things:///show?id=${item.id}`; 

    return (
        <li className="do-more-things-list-item">
            <input onClick={handleOnClick} checked={checked} type="checkbox" className="things-today-checkbox" data-tid={item.id} />

            <a href={url}>
                {item.name}
            </a>

            <RowNoteIcon item={item} />

            <RowTags item={item} />
        </li>
    )
}