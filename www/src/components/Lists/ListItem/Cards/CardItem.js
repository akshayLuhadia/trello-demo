import React from "react";
import "./CardItem.css";

export default function CardItem({ card, list }) {
  const { _id, title } = card;

  const onDragStart = (e) => {
    e.currentTarget.classList.add('Drag');
    e.effectAllowed = "move";
    e.dataTransfer.setDragImage(e.currentTarget, 25, 25);
    e.dataTransfer.setData("text/plain", JSON.stringify({card, list}));
  };

  const onDragEnd = (e) => {
    e.currentTarget.classList.remove('Drag');
    e.dataTransfer.clearData();
  };

  return (
    <div
      id={_id}
      className="CardTitle"
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {title}
    </div>
  );
}
