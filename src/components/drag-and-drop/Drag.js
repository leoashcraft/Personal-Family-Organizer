import { Draggable } from "react-beautiful-dnd";

function getStyle(style, snapshot) {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  const { moveTo, curve, duration } = snapshot.dropAnimation;
  const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;
  return {
    ...style,
    transform: `${translate}`,
    transition: `all ${curve} ${duration + 0.5}s`,
  };
}

export const Drag = ({ id, index, ...props }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...props}
            {...provided.dragHandleProps}
            // isDragging={snapshot.isDragging && !snapshot.isDropAnimating}
            style={getStyle(provided.draggableProps.style, snapshot)}
          >
            {props.children}
          </div>
        );
      }}
    </Draggable>
  );
};
