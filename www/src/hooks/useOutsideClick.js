import { useEffect } from "react";

export default function useOutsideClick(elementRef, handler) {
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (elementRef.current && !elementRef.current.contains(e.target)) {
        handler();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [elementRef, handler]);
}
