import { Things3Todo } from "src/types";
import { useAppContext } from "./AppContext";
import { Row } from "./Row";
import { useState } from "react";

export const Group = ({group}: {group: string}) => {

    const { data, state } = useAppContext();

    const showListState = state[group] === undefined ? true : state[group];
    const [showList, setShowList] = useState(showListState);

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setShowList(!showList);
        state[group] = !showList;
        localStorage.setItem('do-more-things-state', JSON.stringify(state));
    }

    return (
        <>
            <p className="do-more-things-title">
                <span>{group}</span>
                <button aria-pressed={showList} onClick={handleOnClick} data-group={group} className="do-more-things-title-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 15 12 9 18 15" />
                    </svg>
                </button>
            </p>

            {showList && <ul data-group={group} className="do-more-things-list">
                {data[group].map((item: Things3Todo) => (<Row item={item} />))}
            </ul>}
        </>
    )
}