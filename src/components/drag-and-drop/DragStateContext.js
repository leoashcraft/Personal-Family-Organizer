import React, { useState, useContext, createContext, useCallback } from "react";

export const DragStateContext = createContext({
  currentDragType: null,
  startDrag: () => {},
  endDrag: () => {},
});

export const useDragState = () => useContext(DragStateContext);

export const DragStateProvider = ({ children }) => {
  const [currentDragType, setCurrentDragType] = useState(null);

  const startDrag = useCallback((type) => {
    setCurrentDragType(type);
  }, []);

  const endDrag = useCallback(() => {
    setCurrentDragType(null);
  }, []);

  return (
    <DragStateContext.Provider value={{ currentDragType, startDrag, endDrag }}>
      {children}
    </DragStateContext.Provider>
  );
};
