import { THINGS3_LOCAL_STORAGE_KEY, Things3Todo } from "src/types";
import { useAppContext } from "./AppContext";
import { Row } from "./Row";
import { useState } from "react";

export const Group = ({group}: {group: string}) => {

    const { data, state, settings } = useAppContext();

    const showListState = state[group] === undefined ? true : state[group];
    const [showList, setShowList] = useState(showListState);

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setShowList(!showList);
        state[group] = !showList;
        localStorage.setItem(THINGS3_LOCAL_STORAGE_KEY, JSON.stringify(state));
    }

    return (
        <>
            <p className="do-more-things-title">
                <span>{group}</span>
                <span className={`count ${showList ? "": "no-list"}`}>({data[group].length})</span>
                {settings.showExpandIcon && <button aria-pressed={showList} onClick={handleOnClick} data-group={group} className="do-more-things-title-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 15 12 9 18 15" />
                    </svg>
                </button>}
            </p>

            {showList && <ul data-group={group} className="do-more-things-list">
                {data[group].map((item: Things3Todo) => (<Row key={item.id} item={item} />))}
            </ul>}
        </>
    )
}