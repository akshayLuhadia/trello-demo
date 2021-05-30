import React, { useContext } from "react";
import { UserContext } from "../../contexts";
import "./Header.css";

export default function Header() {
  const context = useContext(UserContext);
  const [user, , , logoutUser, appLoading] = context;

  return (
    <header className="Header">
      <section className="LeftSection">Trello boards demo</section>
      {user?.isLoggedIn && !appLoading && (
        <section className="RightSection">
          <button className="Logout" onClick={logoutUser}>
            Logout
          </button>
        </section>
      )}
    </header>
  );
}
