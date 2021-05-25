import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { execute } from "../api";

export const ListsContext = createContext(null);

export function ListsContextProvider({ children }) {
  const userContext = useContext(UserContext);
  const [user] = userContext;
  const { lists: userLists } = user;
  const [lists, setLists] = useState(userLists);

  const getCardsForListItem = async (listId) => {
    const data = await execute(`lists/${listId}/cards`);
    return data;
  };

  const getCardsForLists = async () => {
    const lists = [];
    for (const [, list] of userLists.entries()) {
      const cards = await getCardsForListItem(list._id);
      lists.push({
        ...list,
        cards,
      });
    }
    setLists(lists);
  };

  useEffect(() => {
    getCardsForLists();
  }, []);

  const context = {
    listsState: [lists, setLists],
  };

  return (
    <ListsContext.Provider value={context}>{children}</ListsContext.Provider>
  );
}
