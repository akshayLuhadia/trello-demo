import React, { useEffect, useState } from "react";
import "./Snackbar.css";

export default function Snackbar({ content = "Snackbar", open, onClose }) {
  const [show, setShow] = useState(open);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, 3000);
    }
  }, [open]);

  return (
    show && (
      <div className="SnackbarContainer">
        <div className="Snackbar">{content}</div>
      </div>
    )
  );
}
