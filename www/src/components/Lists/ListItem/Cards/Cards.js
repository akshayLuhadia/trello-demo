import React, { useContext, useRef, useState } from "react";
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

export default function Cards({ cards, list, onCardDrop, onCardDrag }) {
  const context = useContext(ListsContext);
  const [lists, setLists] = context.listsState;

  const [draggedCardData, setDraggedCardData] = useState(null);

  const cardRef = useRef(null);

  const onDragOver = (e) => {
    e.preventDefault();
    // cardRef.current.classList.add("Dropzone");
  };

  const onCardItemDrag = (e, { card, list }) => {
    setDraggedCardData({ card, list });
    onCardDrag({ card, list });
  };

  const updateCardPosition = (
    draggedCardId,
    droppedCardId,
    droppedCardPosition,
    draggedCardPosition
  ) => {
    return cards.map((card) => {
      if (card._id === draggedCardId) {
        return {
          ...card,
          position: droppedCardPosition,
        };
      }
      if (card._id === droppedCardId) {
        return {
          ...card,
          position: draggedCardPosition,
        };
      }
      return { ...card };
    });
  };

  const onCardItemDrop = async (e, { card: droppedCard }) => {
    if (draggedCardData) {
      const { _id: draggedListId } = draggedCardData.list;
      const { _id: currentListId } = list;
      if (draggedListId === currentListId) {
        const { _id: draggedCardId, position: draggedCardPosition } =
          draggedCardData.card;
        const { _id: droppedCardId, position: droppedCardPosition } =
          droppedCard;

        const updateDraggedCard = await execute(
          `cards/${draggedCardId}/update`,
          "POST",
          {},
          { ...draggedCardData.card, position: droppedCardPosition }
        );
        const updateDroppedCard = await execute(
          `cards/${droppedCardId}/update`,
          "POST",
          {},
          { ...droppedCard, position: draggedCardPosition }
        );
        const res = await await Promise.all([
          updateDraggedCard,
          updateDroppedCard,
        ]);
        console.log(res);

        const updatedLists = lists.map((listItem) => {
          if (listItem._id === currentListId) {
            return {
              ...listItem,
              cards: updateCardPosition(
                draggedCardId,
                droppedCardId,
                droppedCardPosition,
                draggedCardPosition
              ),
            };
          }
          return { ...listItem };
        });
        setLists(updatedLists);
      }
    }
  };

  const handleOnDrop = () => {
    // const { _id: currentListId } = list;
    // const { _id: draggedListId } = draggedCardData.list;
    // const { _id: draggedCardId } = draggedCardData.card;
    // if (currentListId !== draggedListId) {
    //   const updatedLists = lists.map((listItem) => {
    //     if (listItem._id === draggedListId) {
    //       return {
    //         ...listItem,
    //         cards: cards.filter((card) => card._id !== draggedCardId),
    //       };
    //     }
    //     if (listItem._id === currentListId) {
    //       const updatedCards = listItem.cards.push({ ...draggedCardData.card });
    //       return {
    //         ...listItem,
    //         cards: updatedCards,
    //       };
    //     }
    //     return {
    //       ...listItem,
    //     };
    //   });
    // }
  };

  const onDrop = (e) => {
    if (draggedCardData) {
      if (list._id === draggedCardData.list._id) {
        onCardDrop(e, { cards, list }, { takeAction: false });
      } else {
        onCardDrop(e, { cards, list }, { takeAction: true });
      }
    } else {
      onCardDrop(e, { cards, list }, { takeAction: true });
    }
  };

  return (
    <div
      id={list._id}
      className="Cards"
      ref={cardRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {cards.map((item, index) => {
        return (
          <CardItem
            key={index}
            card={item}
            list={list}
            onCardDrop={onCardItemDrop}
            onCardDrag={onCardItemDrag}
          />
        );
      })}
    </div>
  );
}
