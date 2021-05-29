import React, { useContext, useRef } from "react";
import { execute } from "../../../../api";
import { ListsContext } from "../../../../contexts";
import CardItem from "./CardItem";
import "./Cards.css";

const updateCard = async (listId, card) => {
  const { _id } = card;
  const updatedCard = {
    ...card,
    list: listId,
  };
  const res = await execute(`cards/${_id}/update`, "POST", {}, updatedCard);
  return res;
};

const updateListsState = (
  lists,
  parsedListId,
  parsedCardId,
  currentListId,
  cards,
  parsedCard
) => {
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
        cards: [...cards, parsedCard],
      };
    }
    return list;
  });
  return temp;
};

export default function Cards({ cards, list }) {
  const context = useContext(ListsContext);
  const [lists, setLists] = context.listsState;

  const cardRef = useRef(null);

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const handleOnDrop = async (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (data) {
      const parsedData = JSON.parse(data);

      const { _id: currentListId } = list;
      const { _id: parsedListId } = parsedData.list;
      const { _id: parsedCardId } = parsedData.card;

      if (currentListId !== parsedListId) {
        const res = await updateCard(currentListId, parsedData.card);
        if (res) {
          const updateLists = updateListsState(
            lists,
            parsedListId,
            parsedCardId,
            currentListId,
            cards,
            parsedData.card
          );
          setLists(updateLists);
        }
      }
    }
  };

  return (
    <div
      id={list._id}
      className="Cards"
      ref={cardRef}
      onDragOver={onDragOver}
      onDrop={handleOnDrop}
    >
      {cards.map((item, index) => {
        return <CardItem key={index} card={item} list={list} />;
      })}
    </div>
  );
}
