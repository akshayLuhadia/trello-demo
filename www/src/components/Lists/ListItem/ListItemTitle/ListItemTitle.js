import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { execute } from "../../../../api";
import { ListsContext } from "../../../../contexts";
import "./ListItemTitle.css";

function ListItemTitle({ list }, ref) {
  const { title, _id } = list;

  const context = useContext(ListsContext);
  const [lists, setLists] = context.listsState;

  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState(title);

  useImperativeHandle(ref, () => ({
    open: () => setShowInput(true),
    close: () => setShowInput(false),
  }));

  const onChange = (e) => {
    const { value } = e.target;
    setValue(value);
  };

  const updateTitle = async () => {
    const updatedList = {
      ...list,
      title: value,
    };
    const res = await execute(`lists/${_id}/update`, "POST", {}, updatedList);
    if (res) {
      setShowInput(false);
      setValue(value);
      const updatedList = lists.map((list) => {
        if (list._id === _id) {
          return {
            ...list,
            title: value,
          };
        }
        return {
          ...list,
        };
      });
      setLists(updatedList);
    }
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      updateTitle();
    }
  };

  return (
    <>
      {showInput ? (
        <input
          className="ListItemTitleInput"
          type="text"
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      ) : (
        <h4 className="ListItemHeaderText">{title}</h4>
      )}
    </>
  );
}

export default forwardRef(ListItemTitle);
