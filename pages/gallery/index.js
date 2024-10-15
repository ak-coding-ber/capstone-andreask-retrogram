import FotoList from "@/components/FotoList/FotoList";
import Layout from "@/components/Layout/Layout";
import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import StandardButton from "@/components/Buttons/StandardButton/StandardButton";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useFavorites } from "@/context/FavoritesContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import RetroButton from "@/components/Buttons/RetroButton/RetroButton";

export default function GalleryPage({ onRetroClick, retroMode }) {
  const { data, isLoading, mutate } = useSWR("/api/fotos", {
    fallbackData: [],
  });
  const { favorites, setFavorites, isLoadingFavorites } = useFavorites();
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to homepage
    }
  }, [status, router]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    return null;
  }

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

  if (isLoading || isLoadingFavorites) {
    return null;
  }

  return (
    <>
      <Layout>
        <LoginLogoutButton />
        <br />
        <br />
        <RetroButton onRetroClick={onRetroClick} retroMode={retroMode} />
        {data.length && (
          <FotoList
            data={data}
            retroMode={retroMode}
            onLikeClick={handleLikeClick}
            favorites={favorites}
            onImageClick={handleImageClick}
          />
        )}
      </Layout>
    </>
  );
}
