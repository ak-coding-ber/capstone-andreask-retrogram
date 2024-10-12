import Image from "next/image";
import useSWR from "swr";
import Layout from "@/components/Layout/Layout";
import LikeButton from "@/components/Buttons/LikeButton/LikeButton";
import Comments from "@/components/Comments/Comments";
import ImageContainer from "@/components/ImageContainer/ImageContainer";
import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
  const [isLiked, setIsLiked] = useState(false);

  const {
    data: foto,
    isLoading,
    error,
    mutate,
  } = useSWR(id ? `/api/fotos/${id}` : null);

  const {
    data: comments,
    isLoading: isLoadingComments,
    error: errorComments,
    mutate: mutateComments,
  } = useSWR(`/api/fotos/${id}/comments`, { fallbackData: [] });

  useEffect(() => {
    if (foto && favorites.length > 0) {
      const liked = favorites.some((favorite) => favorite._id === foto._id);
      setIsLiked(liked);
    }
  }, [foto, favorites]);

  useEffect(() => {
    if (comments.length || error) {
      console.log("comments", comments);
      console.log("error", error);
    }
  }, [comments, error]);

  if (!isReady || isLoading || error || !foto || isLoadingComments)
    return <h2>Loading...</h2>;

  // function handleRetroClick() {
  //   setRetroMode(!retroMode);
  // }

  async function handleLikeClick(foto, isLiked) {
    setIsLiked(!isLiked);
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

      // console.log("API Response:", result);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  }

  return (
    <>
      <Layout>
        <p style={{ textAlign: "center" }}>
          This will be the details page for Image {`${id}`}
        </p>
        <LoginLogoutButton />
        <br />
        <br />
        <ImageContainer $size={300}>
          <Image
            width={300}
            height={300}
            src={retroMode ? foto.retroImageUrl : foto.imageUrl}
            alt="gallery image"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              maxWidth: "100%",
              objectFit: "cover",
            }}
          ></Image>
          <LikeButton
            onLikeClick={handleLikeClick}
            foto={foto}
            isLiked={isLiked}
          ></LikeButton>
        </ImageContainer>
        <Comments comments={comments} />
      </Layout>
    </>
  );
}
