import React, { useRef } from "react";
import CardItem from "./CardItem";
import "./Cards.css";

export default function Cards({ cards, list, onCardDrop }) {
  const cardRef = useRef(null);

  const onDropOnCards = (e) => {
    e.preventDefault();
    if (cards.length === 0) onCardDrop({ card: null, list });
  };

  const handleOnCardDrop = (e) => {
    if (cards.length > 0) onCardDrop(e);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      id={list._id}
      onDragOver={onDragOver}
      className="Cards"
      ref={cardRef}
      onDrop={onDropOnCards}
    >
      {cards.map((item, index) => {
        return (
          <CardItem
            key={index}
            card={item}
            list={list}
            onCardDrop={handleOnCardDrop}
          />
        );
      })}
    </div>
  );
}
