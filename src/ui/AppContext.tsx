import { createContext, PropsWithChildren, useContext } from "react";
import { Things3Data, DoMoreThingsPluginSetting, Things3Todo } from "../types";
import { DEFAULT_SETTINGS } from "../DoMoreThingsSettings";

export type AppContextType = {
    settings: DoMoreThingsPluginSetting;
    data?: Things3Data;
    state: {
        [key: string]: boolean;
    };
    linkNote: (item: Things3Todo) => void;
    linkedNotes: {
        id: string,
        extension:  string,
        name:  string,
        path:  string,
    }[],
    refreshData: () => void;
};

const AppContext = createContext<AppContextType>({
    settings: DEFAULT_SETTINGS,
    data: {
        groups: [],
        tags: [],
    },
    state: {},
    linkNote: () => {
        console.log("linkNote");
    },
    linkedNotes: [],
    refreshData: () => {
        console.log("refreshData");
    },
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children, ...value }: PropsWithChildren<AppContextType>) => {
    return (
        <>
            {!value.data && <div>Loading...</div>}

            {value.data && <AppContext.Provider value={{...value}}>
                {children}
            </AppContext.Provider>}
        </>
    );
}