import React, { useState, createContext, useContext } from 'react';
import AlertDeleteList from "@/components/lists/AlertDeleteList";
import AlertDeleteListItem from "@/components/lists/AlertDeleteListItem";

export const AlertsContext = createContext();

export const useAlerts = () => useContext(AlertsContext);

export const AlertsProvider = ({ children }) => {

    const [isAlertOpenDeleteList, setIsAlertOpenDeleteList] = useState(false);
    const [isAlertOpenDeleteListItem, setIsAlertOpenDeleteListItem] = useState(false);

    const openAlertDeleteList = () => {
        setIsAlertOpenDeleteList(true);
    };
    const openAlertDeleteListItem = () => {
        setIsAlertOpenDeleteListItem(true);
    };

    const handleDeleteListItem = (listItem) => {
        setCurrentListItemMenu(listItem);
        openAlertDeleteListItem();
    };

    const handleCloseAlertDeleteList = () => {
        setIsAlertOpenDeleteList(false);
    };
    const handleCloseAlertDeleteListItem = () => {
        setIsAlertOpenDeleteListItem(false);
    };

    return (
    <AlertsContext.Provider
        value={{
            AlertDeleteList,
            isAlertOpenDeleteList,
            setIsAlertOpenDeleteList,
            openAlertDeleteList,
            handleCloseAlertDeleteList,
            AlertDeleteListItem,
            isAlertOpenDeleteListItem,
            setIsAlertOpenDeleteListItem,
            openAlertDeleteListItem,
            handleDeleteListItem,
            handleCloseAlertDeleteListItem
        }}
    >
        {children}
    </AlertsContext.Provider>
    );
};