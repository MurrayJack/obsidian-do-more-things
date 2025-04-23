import { Things3Todo } from "../types"
import { RowTags } from "./RowTags"
import { RowNoteIcon } from "./RowNoteIcon"
import { useAppContext } from "./AppContext"
import { useState } from "react"

export const Row = ({ item }: { item: Things3Todo }) => {

    const { callBack } = useAppContext();
    const [isChecked, setIsChecked] = useState(item.status !== 'open'); // or false by default

    const handleOnClick = (e: React.MouseEvent<HTMLInputElement>) => {
        callBack("checkbox", e.nativeEvent);
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
    };

    const url = `things:///show?id=${item.id}`; 

    return (
        <li className="do-more-things-list-item">
            <input onChange={handleCheckboxChange} onClick={handleOnClick} checked={isChecked} type="checkbox" className="things-today-checkbox" data-tid={item.id} />

            <a href={url}>
                {item.name}
            </a>

            <RowNoteIcon item={item} />

            <RowTags item={item} />
        </li>
    )
}