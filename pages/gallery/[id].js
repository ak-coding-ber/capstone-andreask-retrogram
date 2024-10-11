import Image from "next/image";
import useSWR from "swr";
import Layout from "@/components/Layout/Layout";
import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { useRouter } from "next/router";

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

export default function FotoDetailsPage() {
  const [retroMode, setRetroMode] = useState();
  const { favorites, setFavorites } = useFavorites();
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { isReady } = router;

  const {
    data: foto,
    isLoading,
    error,
    mutate,
  } = useSWR(id ? `/api/fotos/${id}` : null);

  if (!isReady || isLoading || error || !foto) return <h2>Loading...</h2>;

  // function handleRetroClick() {
  //   setRetroMode(!retroMode);
  // }

  async function handleLikeClick(foto, isLiked) {
    if (isLiked) {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite._id !== foto._id)
      );
    } else {
      setFavorites((prevFavorites) => [...prevFavorites, foto]);
    }

    try {
      const response = await fetch("/api/favorites/", {
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

  console.log(foto);

  return (
    <>
      <Layout>
        <h1 style={{ textAlign: "center" }}>
          This will be the details page for Image {`${id}`}
        </h1>
        <LoginLogoutButton />
        <br />
        <br />
        <Image
          width={500}
          height={500}
          src={retroMode ? foto.retroImageUrl : foto.imageUrl}
          alt="gallery image"
          style={{
            objectFit: "cover",
          }}
        ></Image>
      </Layout>
    </>
  );
}
