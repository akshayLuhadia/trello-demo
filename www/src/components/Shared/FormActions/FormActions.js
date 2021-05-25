import React from "react";
import {Icon} from '..';
import "./FormActions.css";

export default function FormActions({ save, onCancelClick }) {
  const { label } = save;

  const handleOnCancelClick = (e) => {
    e.preventDefault();
    onCancelClick();
  };
  return (
    <div className="FormActions">
      <button className="FormActionsSave" type="submit">
        {label}
      </button>
      <button className="FormActionsClose" onClick={handleOnCancelClick}>
        <Icon icon='close' />
      </button>
    </div>
  );
}
