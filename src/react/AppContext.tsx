import {createContext, PropsWithChildren, useContext} from "react";
import { CallBackType, Things3Data, Things3PluginSettings } from "../types";
import { DEFAULT_SETTINGS } from "../DoMoreThingsSettings";

export type AppContextType = {
    settings: Things3PluginSettings;
    data: Things3Data;
    state: {
        [key: string]: boolean;
    };
    callBack: CallBackType
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
    }
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children, data, settings, callBack, state }: PropsWithChildren<AppContextType>) => {
    return (
        <AppContext.Provider value={{ settings, data, callBack, state }}>
            {children}
        </AppContext.Provider>
    );
}