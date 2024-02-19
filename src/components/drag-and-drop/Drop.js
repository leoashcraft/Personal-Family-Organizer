import { Droppable } from "react-beautiful-dnd";
import { useContext } from "react";
import { DragStateContext } from "./DragStateContext";

export const Drop = ({ id, type, ...props }) => {
  const { currentDragType } = useContext(DragStateContext);

  const shouldRenderPlaceholder =
    type !== "droppable-category" || currentDragType !== "droppable-category";

  return (
    <Droppable droppableId={id} type={type}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            {...props}
            className={snapshot.isDraggingOver ? "droppable--is-over" : ""}
          >
            {props.children}
            {shouldRenderPlaceholder && provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};
