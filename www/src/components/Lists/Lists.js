import React, { useContext, useState } from "react";
import { execute } from "../../api";
import { DragContext, ListsContext } from "../../contexts";
import CreateList from "./CreateList/CreateList";
import ListItem from "./ListItem/ListItem";
import "./Lists.css";

const handleSameListCardDrop = (
  draggedElementCard,
  droppedOnCard,
  draggedElementList,
  lists
) => {
  const { _id: draggedElementListId } = draggedElementList;
  const { _id: draggedElementCardId } = draggedElementCard;
  const { _id: droppedOnCardId } = droppedOnCard;

  const { position: draggedElementCardPosition } = draggedElementCard;
  const { position: droppedOnCardPosition } = droppedOnCard;

  return lists.map((listItem) => {
    // update the dragged element's position.
    if (listItem._id === draggedElementListId) {
      return {
        ...listItem,
        cards: listItem.cards.map((card) => {
          if (card._id === draggedElementCardId) {
            return {
              ...card,
              position: droppedOnCardPosition,
            };
          }
          if (card._id === droppedOnCardId) {
            return {
              ...card,
              position: draggedElementCardPosition,
            };
          }
          return {
            ...card,
          };
        }),
      };
    }
    return {
      ...listItem,
    };
  });
};

const handleDifferentListCardDrop = (
  lists,
  draggedElementList,
  draggedElementCard,
  droppedOnList
) => {
  const { _id: draggedElementListId } = draggedElementList;
  const { _id: draggedElementCardId } = draggedElementCard;
  const { _id: droppedOnListId } = droppedOnList;
  return lists.map((listItem) => {
    if (listItem._id === draggedElementListId) {
      return {
        ...listItem,
        cards: listItem.cards.filter(
          (card) => card._id !== draggedElementCardId
        ),
      };
    }
    if (listItem._id === droppedOnListId) {
      const updatedCards = [
        ...listItem.cards,
        {
          ...draggedElementCard,
          list: droppedOnListId,
          position: listItem.cards.length + 1,
        },
      ];
      return {
        ...listItem,
        cards: updatedCards,
      };
    }
    return {
      ...listItem,
    };
  });
};

export default function Lists() {
  const listsContext = useContext(ListsContext);
  const [lists, setLists] = listsContext;

  const dragContext = useContext(DragContext);
  const [draggedElementState] = dragContext;

  const [draggedElement] = draggedElementState;

  const updateCardPosition = async (draggedElement, droppedOnElement) => {
    const { _id: draggedCardId } = draggedElement.card;
    const draggedCardUpdatedPosition =
      lists.find((list) => list._id === droppedOnElement.list._id).cards
        .length + 1;
    const draggedCardPayload = {
      ...draggedElement.card,
      list: droppedOnElement.list._id,
      position: draggedCardUpdatedPosition,
    };
    const draggedCard = await execute(
      `cards/${draggedCardId}/update`,
      "POST",
      {},
      draggedCardPayload
    );
    return draggedCard;
  };

  const updateCardPositionSameList = async (
    draggedElement,
    droppedOnElement
  ) => {
    const { _id: draggedCardId, position: draggedCardPosition } =
      draggedElement.card;
    const { _id: droppedCardId, position: droppedOnCardPosition } =
      droppedOnElement.card;
    const draggedCard = await execute(
      `cards/${draggedCardId}/update`,
      "POST",
      {},
      { ...draggedElement.card, position: droppedOnCardPosition }
    );
    const droppedCard = await execute(
      `cards/${droppedCardId}/update`,
      "POST",
      {},
      { ...droppedOnElement.card, position: draggedCardPosition }
    );
    const res = await await Promise.all([draggedCard, droppedCard]);
    return res;
  };

  const onCardDrop = async ({ card: droppedOnCard, list: droppedOnList }) => {
    const { card: draggedElementCard, list: draggedElementList } =
      draggedElement;
    const { _id: droppedOnListId } = droppedOnList;
    const { _id: draggedElementListId } = draggedElementList;
    if (droppedOnCard) {
      // Update card position in the same list
      if (droppedOnListId === draggedElementListId) {
        const res = await updateCardPositionSameList(draggedElement, {
          card: droppedOnCard,
          list: droppedOnList,
        });
        if (res) {
          const updatedLists = handleSameListCardDrop(
            draggedElementCard,
            droppedOnCard,
            draggedElementList,
            lists
          );
          setLists(updatedLists);
        }
      } else {
        // Move card to a different list when there are cards in the other list.
        const res = await updateCardPosition(draggedElement, {
          card: droppedOnCard,
          list: droppedOnList,
        });
        if (res) {
          const updatedLists = handleDifferentListCardDrop(
            lists,
            draggedElementList,
            draggedElementCard,
            droppedOnList
          );
          setLists(updatedLists);
        }
      }
    } else {
      // Move card to a different list when there are no cards in the other list.
      const res = await updateCardPosition(draggedElement, {
        card: droppedOnCard,
        list: droppedOnList,
      });
      if (res) {
        const updatedLists = handleDifferentListCardDrop(
          lists,
          draggedElementList,
          draggedElementCard,
          droppedOnList
        );
        setLists(updatedLists);
      }
    }
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
              onCardDrop={onCardDrop}
              {...item}
            />
          );
        })}
      <CreateList />
    </div>
  );
}
