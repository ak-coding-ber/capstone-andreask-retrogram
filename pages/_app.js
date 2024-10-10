import GlobalStyle from "../styles";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <SWRConfig
        value={{
          fetcher: async (...args) => {
            const response = await fetch(...args);
            if (!response.ok) {
              throw new Error(`Request with ${JSON.stringify(args)} failed.`);
            }
            return await response.json();
          },
        }}
      >
        <SessionProvider session={session}>
          <GlobalStyle />
          <FavoritesProvider>
            <Component {...pageProps} />
          </FavoritesProvider>
        </SessionProvider>
      </SWRConfig>
    </>
  );
}
