import "../styles/globals.css";
import type {AppProps} from "next/app";
import {Provider} from 'react-redux'
import {GoogleOAuthProvider} from "@react-oauth/google";
import {store} from '../store'

export default function App({Component, pageProps}: AppProps) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider
        clientId={
          "894932219841-rijq7rc3aga0qj5cqk0oooljgseteue0.apps.googleusercontent.com"
        }
      >
        <Component {...pageProps} />
      </GoogleOAuthProvider>
    </Provider>
  );
}
