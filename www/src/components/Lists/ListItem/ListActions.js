import React from "react";
import "./ListActions.css";

const defaultOptions = [
  {
    label: "Add card",
    action: "add",
  },
  {
    label: "Delete list",
    action: "delete",
  },
];

export default function ListActions({ options = defaultOptions, onClick }) {
  const handleClick = (option) => {
    const { action } = option;
    onClick(action);
  };

  return (
    <ul className="ListActions">
      {options.map((option, index) => {
        const { label } = option;
        const onKeyPress = (e) => {
          if (e.key === "Enter") {
            handleClick(option);
          }
        };
        return (
          <li
            key={index}
            className="Action"
            tabIndex="0"
            onClick={() => handleClick(option)}
            onKeyPress={onKeyPress}
          >
            {label}
          </li>
        );
      })}
    </ul>
  );
}
