import React, { useContext, useRef } from "react";
import { execute } from "../../../api";
import { ListsContext } from "../../../contexts";
import { Menu } from "../../Shared";
import AddCard from "./AddCard/AddCard";
import Cards from "./Cards/Cards";
import ListActions from "./ListActions";
import "./ListItem.css";

export default function ListItem({ _id, title, onCardItemDrop, cards = [] }) {
  const context = useContext(ListsContext);
  const [lists, setLists] = context.listsState;

  const menuRef = useRef(null);
  const addCardRef = useRef(null);

  const onAddCard = async (e) => {
    const { title } = e;
    const card = await execute(
      "cards/create",
      "POST",
      {},
      { title, list: _id }
    );
    if (card) {
      const updatedList = lists.map((item) => {
        if (item._id === _id) {
          return {
            ...item,
            cards: [...item.cards, e],
          };
        }
        return item;
      });
      setLists(updatedList);
    }
  };

  const onAddClick = () => {
    menuRef.current.close();
    addCardRef.current.open();
  };

  const onDeleteList = async () => {
    menuRef.current.close();
    const res = await execute(`lists/${_id}/delete`, "POST", {}, { id: _id });
    if (res) {
      const updatedLists = lists.filter((list) => list._id !== _id);
      setLists(updatedLists);
    }
  };

  const onActionClick = (action) => {
    const actions = {
      delete: onDeleteList,
      add: onAddClick,
    };
    const method = actions[action];
    method();
  };

  return (
    <div id={_id} className="ListItem">
      <div className="ListItemHeader">
        <h4 className="ListItemHeaderText">{title}</h4>
        <Menu ref={menuRef} content={<ListActions onClick={onActionClick} />} />
      </div>
      <Cards cards={cards} list={{ _id, title }} />
      <AddCard ref={addCardRef} onAdd={onAddCard} cards={cards} />
    </div>
  );
}