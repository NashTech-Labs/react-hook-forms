import React, { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../store";
import TopHeader from "../components/TopHeader/TopHeader";
import { ToastContainer } from "react-toastify";
import { StyledEngineProvider } from "@mui/material/styles";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || ""}
        >
          <ToastContainer className="toast-container" />
          {pageLoaded ? <TopHeader /> : null}
          {pageLoaded ? <Component {...pageProps} /> : null}
        </GoogleOAuthProvider>
      </StyledEngineProvider>
    </Provider>
  );
}
