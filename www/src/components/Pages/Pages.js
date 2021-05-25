import React, { useContext } from "react";
import { Redirect, Route, Switch } from "react-router";
import { UserContext } from "../../contexts";
import { Lists } from "../Lists";
import { Login } from "../Login";

const pages = {
  Login: {
    path: "/login",
    component: Login,
    isPrivate: false,
  },
  Lists: {
    path: "/",
    component: Lists,
    isPrivate: true,
  }
};

function PrivateRoute({ children, path, component: Component, ...rest }) {
  const [user] = useContext(UserContext);
  return (
    <Route
      {...rest}
      path={path}
      render={(props) => {
        const { location } = props;
        if (user?.isLoggedIn) {
          return <Component {...props} />;
        }
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}

export default function Pages() {
  return (
    <Switch>
      {Object.keys(pages).map((page, index) => {
        const { path, component: Component, isPrivate } = pages[page];
        if (isPrivate) {
          return (
            <PrivateRoute
              key={index}
              path={path}
              component={Component}
            />
          );
        }
        return (
          <Route
            key={index}
            path={path}
            render={(props) => {
              return <Component {...props} />;
            }}
          />
        );
      })}
    </Switch>
  );
}
