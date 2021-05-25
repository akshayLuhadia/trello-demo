import React from "react";
import "./Icon.css";

export default function Icon({ icon, className = "", onClick, ...rest }) {
  return (
    <span
      tabIndex="0"
      className={`material-icons Icon ${className}`}
      onClick={onClick ? (e) => onClick(e) : null}
      {...rest}
    >
      {icon}
    </span>
  );
}
