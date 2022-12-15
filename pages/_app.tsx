import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider
      clientId={
        "894932219841-rijq7rc3aga0qj5cqk0oooljgseteue0.apps.googleusercontent.com"
      }
    >
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}
