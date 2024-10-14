import FotoList from "@/components/FotoList/FotoList";
import Layout from "@/components/Layout/Layout";
import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import RetroButton from "@/components/Buttons/RetroButton/RetroButton";
import { useSession } from "next-auth/react";
import { useFavorites } from "@/context/FavoritesContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function FavoritesPage({
  onImageClick,
  onRetroClick,
  retroMode,
}) {
  const { favorites, setFavorites } = useFavorites();
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

        <RetroButton onRetroClick={onRetroClick} retroMode={retroMode} />
      </Layout>
    </>
  );
}
