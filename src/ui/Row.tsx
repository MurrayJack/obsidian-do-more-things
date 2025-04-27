import { Things3Todo } from "../types"
import { RowTags } from "./RowTags"
import { RowNoteIcon } from "./RowNoteIcon"
import { useAppContext } from "./AppContext"
import { useEffect, useState } from "react"
import { Things3Manager } from "../things3/Things3Manager"

export const Row = ({ item }: { item: Things3Todo }) => {
    
    const { linkNote, linkedNotes, settings } = useAppContext();
    const [isChecked, setIsChecked] = useState(item.status !== 'open'); // or false by default
    const [hasLinkedNote, setHasLinkedNote] = useState(false);

    useEffect(() => {
        const linkedNote = linkedNotes.find((note) => note.id === item.id);
        setHasLinkedNote(!!linkedNote);
    }, [linkedNotes])

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const things = new Things3Manager();
        things.completeTodoByJXA(item.id, e.target.checked );
        setIsChecked(e.target.checked);
    };

    const handleLinkNote = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        linkNote(item);
        setHasLinkedNote(true);
    }

    const url = `things:///show?id=${item.id}`; 

    return (
        <li className="do-more-things-list-item">
            <input onChange={handleCheckboxChange} checked={isChecked} type="checkbox" className="things-today-checkbox" data-tid={item.id} />

            <a href={url} title={item.name}>
                {item.name}
            </a>

            <RowNoteIcon item={item} />

            <RowTags item={item} />

            {settings.allowLinkedNotes ? <button className={hasLinkedNote ? "linked" : ""} title="Create linked Page" onClick={handleLinkNote} type="button">📙</button> : <span></span>}
        </li>
    )
}