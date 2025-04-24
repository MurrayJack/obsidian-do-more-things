import { Things3Todo } from "../types"
import { RowTags } from "./RowTags"
import { RowNoteIcon } from "./RowNoteIcon"
import { useAppContext } from "./AppContext"
import { useEffect, useState } from "react"

export const Row = ({ item }: { item: Things3Todo }) => {
    
    const { callBack, linkNote, linkedNotes, settings } = useAppContext();
    const [isChecked, setIsChecked] = useState(item.status !== 'open'); // or false by default
    const [hasLinkedNote, setHasLinkedNote] = useState(false);

    const handleOnClick = (e: React.MouseEvent<HTMLInputElement>) => {
        callBack("checkbox", e.nativeEvent);
    }

    useEffect(() => {
        const linkedNote = linkedNotes.find((note) => note.id === item.id);
        setHasLinkedNote(!!linkedNote);
    }, [linkedNotes])

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
    };

    const handleLinkNote = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        linkNote(item);
    }

    const url = `things:///show?id=${item.id}`; 

    return (
        <li className="do-more-things-list-item">
            <input onChange={handleCheckboxChange} onClick={handleOnClick} checked={isChecked} type="checkbox" className="things-today-checkbox" data-tid={item.id} />

            <a href={url}>
                {item.name}
            </a>

            <RowNoteIcon item={item} />

            <RowTags item={item} />

            {settings.allowLinkedNotes ? <button className={hasLinkedNote ? "linked" : ""} title="Create linked Page" onClick={handleLinkNote} type="button">📙</button> : <span></span>}
        </li>
    )
}