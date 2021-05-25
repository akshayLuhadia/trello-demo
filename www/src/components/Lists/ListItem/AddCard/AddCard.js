import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useOutsideClick } from "../../../../hooks";
import { FormActions, Icon } from "../../../Shared";
import "./AddCard.css";

function AddCard({ onAdd, cards }, ref) {
  const [showInput, setShowInput] = useState(false);
  const [cardTitle, setCardTitle] = useState("");

  const formRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => setShowInput(true),
    close: () => setShowInput(false),
  }));

  useOutsideClick(formRef, () => setShowInput(false));

  const onAddCard = (e) => {
    e.preventDefault();
    setShowInput(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onAdd({ title: cardTitle });
  };

  const onChange = (e) => {
    const { value } = e.target;
    setCardTitle(value);
  };

  const onCancelClick = () => {
    setCardTitle("");
    setShowInput(false);
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onSubmit(e);
    }
  };

  return (
    <>
      {!showInput && (
        <button className="AddCardBtn" onClick={onAddCard}>
          <Icon icon="add" className="AddIcon" />{" "}
          {cards.length > 0 ? "Add another card" : "Add a card"}
        </button>
      )}
      {showInput && (
        <form ref={formRef} className="AddCardForm" onSubmit={onSubmit}>
          <textarea
            className="AddCardTextarea"
            onChange={onChange}
            required
            autoFocus
            onKeyPress={onKeyPress}
            placeholder="Enter a title for this card..."
          />
          <FormActions
            save={{ label: "Add card" }}
            onCancelClick={onCancelClick}
          />
        </form>
      )}
    </>
  );
}

export default forwardRef(AddCard);
