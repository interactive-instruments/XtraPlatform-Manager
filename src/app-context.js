
import React, { createContext, useContext } from 'react';

export const AppContext = createContext();

export const useAppConfig = () => useContext(AppContext)

export const withAppConfig = () => (Component) => (props) => {
    const appConfig = useAppConfig();

    return (
        <Component {...props} appConfig={appConfig} />
    );
}
