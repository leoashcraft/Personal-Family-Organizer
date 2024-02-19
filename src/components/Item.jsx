import React from "react";
import { useDrag } from "react-dnd";

const Item = ({ name, sourceListId }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "item",
    item: { name, sourceListId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {name}
    </div>
  );
};

export default Item;
