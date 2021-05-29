import React, { createContext, useEffect, useState } from "react";
import { execute } from "../api";

export const UserContext = createContext(null);

const userId = process.env.USER_ID || "60a9135da7abc80c94008004";

export function UserContextProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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
    const user = await execute(`users/${userId}`, "GET");
    const { name, email, lists } = user;
    const isLoggedIn = getUserLoginStatus();
    setUser({
      name,
      email,
      id: userId,
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
    <UserContext.Provider value={[user, setUser, loginUser, logoutUser]}>
      {!loading && children}
    </UserContext.Provider>
  );
}
