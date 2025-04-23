import {createContext, PropsWithChildren, useContext} from "react";
import { Things3Data, Things3PluginSettings } from "../types";
import { DEFAULT_SETTINGS } from "../DoMoreThingsSettings";

export type AppContextType = {
    settings: Things3PluginSettings;
    data: Things3Data;
    state: {
        [key: string]: boolean;
    };
    callBack: (event: "refresh" | "checkbox", e: Event) => void
};

const AppContext = createContext<AppContextType>({
    settings: DEFAULT_SETTINGS,
    data: {
        groups: [],
        tags: [],
    },
    state: {},
    callBack: (event: "refresh" | "checkbox", e: Event) => {
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