import FotoList from "@/components/FotoList/FotoList";
import Layout from "@/components/Layout/Layout";
import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession, useSession } from "next-auth/react";
import useSWR from "swr";
import { useFavorites } from "@/context/FavoritesContext";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // If no session, redirect to homepage
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Continue with page rendering if authenticated
  return {
    props: { session },
  };
}

export default function GalleryPage({ onRetroClick, retroMode }) {
  const { data, isLoading, mutate } = useSWR("/api/fotos", {
    fallbackData: [],
  });
  const { favorites, setFavorites } = useFavorites();
  const { data: sessionData } = useSession();
  const router = useRouter();

  function handleImageClick(id) {
    router.push(`/gallery/${id}`);
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

      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  }

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Layout>
        <h1>This will be the gallery page!</h1>
        <LoginLogoutButton />
        <br />
        <br />
        {data.length && (
          <FotoList
            data={data}
            retroMode={retroMode}
            onLikeClick={handleLikeClick}
            favorites={favorites}
            onImageClick={handleImageClick}
          />
        )}
        <button onClick={onRetroClick}>
          {retroMode ? "NORMAL MODE" : "RETRO MODE"}
        </button>
      </Layout>
    </>
  );
}
