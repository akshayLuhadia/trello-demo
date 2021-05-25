import React, { useContext } from "react";
import { ListsContext } from "../../contexts";
import CreateList from "./CreateList/CreateList";
import ListItem from "./ListItem/ListItem";
import "./Lists.css";

export default function Lists() {
  const context = useContext(ListsContext);
  const [lists] = context.listsState;
  // const [lists, setLists] = useState([]);

  return (
    <div>
      <div className="ListContainer">
        {lists.map((item, index) => {
          return <ListItem key={index} {...item} />;
        })}
        <CreateList />
      </div>
    </div>
  );
}
