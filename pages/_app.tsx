import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../store";
import TopHeader from "../components/TopHeader/TopHeader";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider
        clientId={
          "894932219841-rijq7rc3aga0qj5cqk0oooljgseteue0.apps.googleusercontent.com"
        }
      >
        <TopHeader />
        <Component {...pageProps} />
      </GoogleOAuthProvider>
    </Provider>
  );
}
