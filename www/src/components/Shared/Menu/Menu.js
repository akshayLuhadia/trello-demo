import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Icon } from "../Icon";
import { useOutsideClick } from "../../../hooks";
import "./Menu.css";

function Menu({ icon = "more_horiz", title = "Actions", content = null }, ref) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  useOutsideClick(menuRef, () => setOpen(false));

  const onClick = () => {
    setOpen(!open);
  };

  return (
    <div className="Menu" ref={menuRef}>
      {open && (
        <div className="MenuContent">
          <div className="MenuContentHeader">
            <h4 className="HeaderText">{title}</h4>
            <Icon
              className="MenuCloseIcon"
              icon="close"
              onClick={() => setOpen(false)}
            />
          </div>
          {content && <div>{content}</div>}
        </div>
      )}
      <Icon icon={icon} onClick={onClick} />
    </div>
  );
}

export default forwardRef(Menu);
