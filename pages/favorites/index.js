import FotoList from "@/components/FotoList/FotoList";
import Layout from "@/components/Layout/Layout";
import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";

export async function getServerSideProps(context) {
  const sessionData = await getSession(context);

  // If no sessionData, redirect to homepage
  if (!sessionData) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Continue with page rendering if authenticated
  return {
    props: { sessionData },
  };
}

export default function FavoritesPage() {
  const [retroMode, setRetroMode] = useState();
  // const [favorites, setFavorites] = useState([]);
  const { favorites } = useFavorites();
  // const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  function handleRetroClick() {
    setRetroMode(!retroMode);
  }

  function handleLikeClick() {
    console.log("isLiked like was clicked inside Favorites Page");
  }

  console.log("favorites inside favorites page", favorites);

  return (
    <>
      <Layout>
        <h1>This will be the favorites page!</h1>
        <LoginLogoutButton />
        <br />
        <br />
        {favorites.length && (
          <FotoList
            retroMode={retroMode}
            onLikeClick={handleLikeClick}
            data={favorites}
          />
        )}

        <code
          style={{
            display: "block",
            width: "100%",
            height: "12rem",
            overflow: "auto",
          }}
        >
          <pre
            style={{
              width: "100%",
              height: "10rem",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              overflow: "auto",
            }}
          >
            {/* just temporary to see directly how the data is stored in my database*/}
            {JSON.stringify(favorites, null, 2)}
          </pre>
        </code>
        <button onClick={handleRetroClick}>
          {retroMode ? "NORMAL MODE" : "RETRO MODE"}
        </button>
      </Layout>
    </>
  );
}
