import { Things3Todo } from "../types"
import { useAppContext } from "./AppContext";

export const RowNoteIcon = ({ item }: { item: Things3Todo }) => {

    const { settings } = useAppContext();

    if (!settings.showNotesIcon) {
        return <span></span>;
    }

    if (!item.hasNotes) {
        return <span></span>;
    }

    return (
        <svg className="do-more-things-note-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16v16H4z"/>
            <line x1="8" y1="8" x2="16" y2="8"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="8" y1="16" x2="12" y2="16"/>
        </svg>
    );

}