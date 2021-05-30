import React, { useContext, useState } from "react";
import { Icon } from "../../../Shared";
import { execute } from "../../../../api";
import { DragContext, ListsContext } from "../../../../contexts";
import "./CardItem.css";

export default function CardItem({ card, list, onCardDrop }) {
  const { _id, title } = card;
  const listsContext = useContext(ListsContext);
  const [lists, setLists] = listsContext;

  const dragContext = useContext(DragContext);
  const [draggedElementState, droppedOnElementState] = dragContext;

  const [, setDraggedElement] = draggedElementState;
  const [, setDroppedOnElement] = droppedOnElementState;

  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  const onDragStart = (e) => {
    e.currentTarget.style.opacity = "0.4";
    setDraggedElement({ card, list });
  };

  const handleOnDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    e.currentTarget.classList.remove("Drag");
    e.dataTransfer.clearData();
  };

  const onDeleteClick = async () => {
    const res = await execute(`cards/${_id}/delete`, "POST", {}, { id: _id });
    if (res) {
      const { _id: listId } = list;
      const updatedList = lists.map((list) => {
        if (list._id === listId) {
          return {
            ...list,
            cards: list.cards.filter((card) => card._id !== _id),
          };
        }
        return { ...list };
      });
      setLists(updatedList);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("Drag");
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("Drag");
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("Drag");
    setDroppedOnElement({ card, list });
    onCardDrop({ card, list });
  };

  return (
    <div
      draggable="true"
      onDragStart={onDragStart}
      onDragEnd={handleOnDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
      className="CardItem"
    >
      <div>{title}</div>
      {showDeleteIcon && (
        <Icon
          onClick={onDeleteClick}
          className="CardDeleteIcon"
          icon="delete"
        />
      )}
    </div>
  );
}
