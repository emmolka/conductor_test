import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { Auth0Provider } from "@auth0/auth0-react";
import { LangProvider } from "./hooks/provider";

ReactDOM.render(
  <Auth0Provider
    domain={"conduktor-coding-challenge.eu.auth0.com"} // placed it like this instead of env :)
    clientId={"2BczaMeSZzUhOfRfDOFG5QXcfaXQUjmE"}
    redirectUri={"http://localhost:8000"}
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
    <LangProvider>
      <App />
    </LangProvider>
  </Auth0Provider>,
  document.getElementById("root")
);
