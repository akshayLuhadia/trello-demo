import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../contexts";
import "./Login.css";

export default function Login({ history }) {
  const [user, , loginUser] = useContext(UserContext);
  const { email } = user;

  const [loading, setLoading] = useState(false);

  const loginBtnRef = useRef(null)

  const _loginUser = () => {
    setLoading(true);
    setTimeout(() => {
      loginUser();
      setLoading(false);
      history.push("/lists");
    }, 1500);
  };

  useEffect(() => {
    const { isLoggedIn } = user;
    if (isLoggedIn) {
      history.push("/");
    }
    loginBtnRef.current.focus();
  }, []);

  return (
    <div className="Login">
      <div className="LoginInfo">
        <div className="EmailInfo">
          <div className="EmailLabel">Email address</div>
          <div className="EmailValue">{email}</div>
        </div>
        <button className="LoginBtn" onClick={_loginUser} ref={loginBtnRef}>
          {loading ? "Logging in..." : " Login"}
        </button>
      </div>
    </div>
  );
}
