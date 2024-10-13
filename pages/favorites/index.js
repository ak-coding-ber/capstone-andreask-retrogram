import FotoList from "@/components/FotoList/FotoList";
import Layout from "@/components/Layout/Layout";
import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession, useSession } from "next-auth/react";
import { useFavorites } from "@/context/FavoritesContext";
import useSWR from "swr";

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

export default function FavoritesPage({
  onImageClick,
  onRetroClick,
  retroMode,
}) {
  const { favorites, setFavorites } = useFavorites();
  const { data: sessionData } = useSession();

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

        <button onClick={onRetroClick}>
          {retroMode ? "NORMAL MODE" : "RETRO MODE"}
        </button>
      </Layout>
    </>
  );
}
