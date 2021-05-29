import React, { useContext, useState } from "react";
import { ListsContext } from "../../contexts";
import CreateList from "./CreateList/CreateList";
import ListItem from "./ListItem/ListItem";
import "./Lists.css";

export default function Lists() {
  const context = useContext(ListsContext);
  const [lists, setLists] = context.listsState;

  const [draggedCardData, setDraggedCardData] = useState(null);

  const onCardDrop = (e, { cards, list }, { takeAction }) => {
    if (takeAction) {
      const { _id: currentListId } = list;
      const { _id: draggedCardId } = draggedCardData.card;
      const updatedLists = lists.map((listItem) => {
        if (listItem._id === currentListId) {
          const updatedCards = [
            ...cards,
            { ...draggedCardData.card, list: listItem._id },
          ];
          return {
            ...listItem,
            cards: updatedCards,
          };
        }
        if (listItem._id === draggedCardData.list._id) {
          return {
            ...listItem,
            cards: listItem.cards.filter((card) => card._id !== draggedCardId),
          };
        }
        return {
          ...listItem,
        };
      });
      setLists(updatedLists);
    }
  };

  const onCardDrag = (e) => {
    setDraggedCardData(e);
  };

  return (
    <div className="ListContainer">
      {lists
        .sort((a, b) => a.position - b.position)
        .map((item, index) => {
          const { cards = [] } = item;
          cards.sort((a, b) => a.position - b.position);
          return (
            <ListItem
              key={index}
              cards={cards}
              onCardDrag={onCardDrag}
              onCardDrop={onCardDrop}
              {...item}
            />
          );
        })}
      <CreateList />
    </div>
  );
}
