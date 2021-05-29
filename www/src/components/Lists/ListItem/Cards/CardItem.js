import React, { useContext, useState } from "react";
import { Icon } from "../../../Shared";
import { execute } from "../../../../api";
import "./CardItem.css";
import { ListsContext } from "../../../../contexts";

export default function CardItem({ card, list }) {
  const { _id, title } = card;
  const context = useContext(ListsContext);
  const [lists, setLists] = context.listsState;

  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  const onDragStart = (e) => {
    e.currentTarget.classList.add("Drag");
    e.effectAllowed = "move";
    e.dataTransfer.setDragImage(e.currentTarget, 25, 25);
    e.dataTransfer.setData("text/plain", JSON.stringify({ card, list }));
  };

  const onDragEnd = (e) => {
    e.currentTarget.classList.remove("Drag");
    e.dataTransfer.clearData();
  };

  const onDeleteClick = () => {
    const res = execute(`cards/${_id}/delete`, "POST", {}, { id: _id });
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

  return (
    <div
      id={_id}
      className="CardItem"
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
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
