import React, { createContext, useState } from "react";

export const DragContext = createContext(null);

export function DragContextProvider({ children }) {
  const [draggedElement, setDraggedElement] = useState(null);
  const [droppedOnElement, setDroppedOnElement] = useState(null);

  return (
    <DragContext.Provider
      value={[
        [draggedElement, setDraggedElement],
        [droppedOnElement, setDroppedOnElement],
      ]}
    >
      {children}
    </DragContext.Provider>
  );
}
