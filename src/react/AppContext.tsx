import {createContext, PropsWithChildren, useContext} from "react";
import { CallBackType, Things3Data, Things3PluginSettings, Things3Todo } from "../types";
import { DEFAULT_SETTINGS } from "../DoMoreThingsSettings";

export type AppContextType = {
    settings: Things3PluginSettings;
    data: Things3Data;
    state: {
        [key: string]: boolean;
    };
    callBack: CallBackType;
    linkNote: (item: Things3Todo) => void;
    linkedNotes: {
        id: string,
        extension:  string,
        name:  string,
        path:  string,
    }[]
};

const AppContext = createContext<AppContextType>({
    settings: DEFAULT_SETTINGS,
    data: {
        groups: [],
        tags: [],
    },
    state: {},
    callBack: (event, e) => {
        console.log(event, e);
    },
    linkNote: () => {
        console.log("linkNote");
    },
    linkedNotes: [],
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children, ...value }: PropsWithChildren<AppContextType>) => {
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}