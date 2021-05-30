import React, { createContext, useEffect, useState } from "react";
import { execute } from "../api";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: "",
    email: "",
    lists: [],
  });

  const loginUser = () => {
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    setUser({
      ...user,
      isLoggedIn: true,
    });
  };

  const logoutUser = () => {
    localStorage.removeItem("isLoggedIn");
    setUser({
      ...user,
      isLoggedIn: false,
    });
  };

  const getUserLoginStatus = () => {
    let isLoggedIn = false;
    const statusFromStorage = localStorage.getItem("isLoggedIn");
    if (statusFromStorage) {
      isLoggedIn = JSON.parse(statusFromStorage);
    }
    return isLoggedIn;
  };

  const getUser = async () => {
    const users = await execute("users");
    const { _id } = users[0];
    const user = await execute(`users/${_id}`, "GET");
    const { name, email, lists } = user;
    const isLoggedIn = getUserLoginStatus();
    setUser({
      name,
      email,
      id: _id,
      lists,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isLoggedIn,
    });
    setLoading(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={[user, setUser, loginUser, logoutUser, loading]}
    >
      {children}
    </UserContext.Provider>
  );
}
