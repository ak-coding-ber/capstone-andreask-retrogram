import FotoList from "@/components/FotoList/FotoList";
import Layout from "@/components/Layout/Layout";
import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession, useSession } from "next-auth/react";
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

export default function FavoritesPage({ onImageClick }) {
  const [retroMode, setRetroMode] = useState();
  const { favorites, setFavorites } = useFavorites();
  const { data: sessionData } = useSession();

  function handleRetroClick() {
    setRetroMode(!retroMode);
  }

  async function handleLikeClick(foto, isLiked) {
    if (isLiked) {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite._id !== foto._id)
      );
    } else {
      setFavorites((prevFavorites) => [...prevFavorites, foto]);
    }

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: sessionData.user.userId,
          fotoId: foto._id,
          isLiked,
        }),
      });

      const result = await response.json();
      console.log("API Response:", result);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  }

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
            favorites={favorites}
            onImageClick={onImageClick}
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
