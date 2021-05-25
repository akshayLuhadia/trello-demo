import React, { useContext, useRef } from "react";
import { ListsContext } from "../../../../contexts";
import CardItem from "./CardItem";
import "./Cards.css";

export default function Cards({ cards, list }) {
  const context = useContext(ListsContext);
  const [lists, setLists] = context.listsState;

  const cardRef = useRef(null);

  const onDragOver = (e) => {
    e.preventDefault();
    // e.currentTarget.classList.add("DropCardItem");
  };

  const handleOnDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (data) {
      const parsedData = JSON.parse(data);

      const { _id: currentListId } = list;
      const { _id: parsedListId } = parsedData.list;
      const { _id: parsedCardId } = parsedData.card;

      if (currentListId !== parsedListId) {
        const temp = lists.map((list) => {
          const { _id: listId } = list;
          if (listId === parsedListId) {
            return {
              ...list,
              cards: list.cards.filter((card) => card._id !== parsedCardId),
            };
          }
          if (listId === currentListId) {
            return {
              ...list,
              cards: [...cards, parsedData.card],
            };
          }
          return list;
        });
        setLists(temp);
      }
    }
  };

  return (
    cards.length > 0 && (
      <div
        className="Cards"
        ref={cardRef}
        onDragOver={onDragOver}
        onDrop={handleOnDrop}
      >
        {cards.map((item, index) => {
          return <CardItem key={index} card={item} list={list} />;
        })}
      </div>
    )
  );
}
