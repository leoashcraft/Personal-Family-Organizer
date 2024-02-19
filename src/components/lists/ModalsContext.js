import React, { useState, createContext, useContext } from 'react';
import ModalAddList from "@/components/lists/ModalAddList";
import ModalAddListCat from "@/components/lists/ModalAddListCat";
import ModalReorderLists from "@/components/lists/ModalReorderLists";
import ModalReorderCats from "@/components/lists/ModalReorderCats";
import ModalIconSelector from "@/components/ModalIconSelector";
import ModalItemDetails from "@/components/lists/ModalItemDetails";

export const ModalsContext = createContext();

export const useModals = () => useContext(ModalsContext);

export const ModalsProvider = ({ children }) => {
    const [isModalOpenAddList, setIsModalOpenAddList] = useState(false);
    const [isModalOpenAddListCat, setIsModalOpenAddListCat] = useState(false);
    const [isModalOpenReorderCats, setIsModalOpenReorderCats] = useState(false);
    const [isModalOpenReorderLists, setIsModalOpenReorderLists] = useState(false);
    const [isModalOpenIconSelector, setIsModalOpenIconSelector] = useState(false);
    const [isModalOpenItemDetails, setIsModalOpenItemDetails] = useState(false);
    
    const [iconAnchor, setIconAnchor] = useState(null);
    const openIconSelector = Boolean(iconAnchor);
    const [selectedIcon, setSelectedIcon] = useState('AppShortcut'); // Default icon


    const openModalAddList = () => {
        setIsModalOpenAddList(true);
    };
    const openModalAddListCat = () => {
        setIsModalOpenAddListCat(true);
    };
    const openModalReorderCats = () => {
        setIsModalOpenReorderCats(true);
    };
    const openModalReorderLists = () => {
        setIsModalOpenReorderLists(true);
    };
    const openModalIconSelector = () => {
        setIsModalOpenIconSelector(true);
    };
    const openModalItemDetails = () => {
        setIsModalOpenItemDetails(true);
    };
    const handleCloseModalAddList = () => {
        setIsModalOpenAddList(false);
    };
    const handleCloseModalAddListCat = () => {
        setIsModalOpenAddListCat(false);
    };
    const handleCloseModalReorderCats = () => {
        setIsModalOpenReorderCats(false);
    };
    const handleCloseModalReorderLists = () => {
        setIsModalOpenReorderLists(false);
    };
    const handleCloseModalIconSelector = () => {
        setIsModalOpenIconSelector(false);
    };
    const handleCloseModalItemDetails = () => {
        setIsModalOpenItemDetails(false);
    };

    const handleIconAnchorClick = (event) => {
        event.stopPropagation();
        setIconAnchor(event.currentTarget);
        openModalIconSelector();
      };

    const handleIconAnchorClose = () => {
        setIconAnchor(null);
    };

    const handleIconSelect = (iconName) => {
        setSelectedIcon(iconName);
        handleCloseModalIconSelector();
    };

  return (
    <ModalsContext.Provider
      value={{
        ModalAddList,
        ModalAddListCat,
        ModalReorderLists,
        ModalReorderCats,
        ModalIconSelector,
        ModalItemDetails,
        isModalOpenAddList,
        isModalOpenAddListCat,
        isModalOpenReorderCats,
        isModalOpenReorderLists,
        isModalOpenIconSelector,
        isModalOpenItemDetails,
        openModalAddList,
        openModalAddListCat,
        openModalReorderCats,
        openModalReorderLists,
        openModalItemDetails,
        openModalIconSelector,
        openIconSelector,
        handleCloseModalAddList,
        handleCloseModalAddListCat,
        handleCloseModalReorderCats,
        handleCloseModalReorderLists,
        handleCloseModalIconSelector,
        handleCloseModalItemDetails,
        handleIconAnchorClick,
        handleIconAnchorClose,
        selectedIcon,
        handleIconSelect
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
};