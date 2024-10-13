import GlobalStyle from "../styles";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const [retroMode, setRetroMode] = useState(false);

  useEffect(() => {
    const storedRetroMode = localStorage.getItem("retroMode");
    if (storedRetroMode !== null) {
      setRetroMode(JSON.parse(storedRetroMode));
    }
  }, []);

  function handleImageClick(id) {
    console.log("Clicked Image:", id);
    router.push(`/gallery/${id}`);
  }

  const handleRetroClick = () => {
    const newMode = !retroMode;
    setRetroMode(newMode);
    localStorage.setItem("retroMode", JSON.stringify(newMode));
  };

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
            <Component
              {...pageProps}
              onImageClick={handleImageClick}
              onRetroClick={handleRetroClick}
              retroMode={retroMode}
            />
          </FavoritesProvider>
        </SessionProvider>
      </SWRConfig>
    </>
  );
}
