import React, { useContext, useRef, useState } from "react";
import { ListsContext, UserContext } from "../../../contexts";
import { FormActions, Icon } from "../../Shared";
import { useOutsideClick } from "../../../hooks";
import "./CreateList.css";
import { execute } from "../../../api";

export default function CreateList() {
  const listContext = useContext(ListsContext);
  const userContext = useContext(UserContext);
  const [lists, setLists] = listContext.listsState;
  const [user] = userContext;

  const [showInput, setShowInput] = useState(false);
  const [listName, setListName] = useState("");

  const formRef = useRef(null);

  useOutsideClick(formRef, () => setShowInput(false));

  const handleShowInput = (e) => {
    if (e && e.key === "Enter") {
      setShowInput(true);
    }
    setShowInput(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const id = user.id;
    const list = await execute(
      "lists/create",
      "POST",
      {},
      { title: listName, user: id }
    );
    if (list) {
      setLists([...lists, { ...list, cards: [] }]);
    }
    setListName("");
  };

  const onChange = (e) => {
    setListName(e.target.value);
  };

  const onCancelClick = () => {
    setShowInput(false);
    setListName("");
  };

  return (
    <>
      {!showInput && (
        <div
          onKeyPress={handleShowInput}
          tabIndex="0"
          className="CreateListInputShowBtn"
          onClick={handleShowInput}
        >
          <Icon icon="add" className="AddIcon" />
          {lists.length > 0 ? "Add another list" : "Add a list"}
        </div>
      )}
      {showInput && (
        <form ref={formRef} className="CreateListForm" onSubmit={onSubmit}>
          <input
            className="CreateListInput"
            type="text"
            name="listName"
            onChange={onChange}
            value={listName}
            required
            autoFocus
            placeholder="Enter list title..."
            autoComplete="off"
          />
          <FormActions
            save={{ label: "Add list" }}
            onCancelClick={onCancelClick}
          />
        </form>
      )}
    </>
  );
}
