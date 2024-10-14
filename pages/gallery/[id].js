import Image from "next/image";
import useSWR from "swr";
import Layout from "@/components/Layout/Layout";
import LikeButton from "@/components/Buttons/LikeButton/LikeButton";
import Comments from "@/components/Comments/Comments";
import ImageContainer from "@/components/ImageContainer/ImageContainer";
import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { useRouter } from "next/router";

export default function FotoDetailsPage({ onRetroClick, retroMode }) {
  const { favorites, setFavorites } = useFavorites();
  const { data: sessionData, status } = useSession();
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
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to homepage if user is not authenticated
    }
  }, [status, router]);

  useEffect(() => {
    if (foto && favorites.length > 0) {
      const liked = favorites.some((favorite) => favorite._id === foto._id);
      setIsLiked(liked);
    }
  }, [foto, favorites]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    return null;
  }

  if (
    !isReady ||
    isLoading ||
    error ||
    !foto ||
    isLoadingComments ||
    !sessionData
  )
    return <h2>Loading...</h2>;

  async function handleAddComment(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const commentData = Object.fromEntries(formData);

    const newComment = {
      fotoId: id,
      userId: sessionData.user.userId,
      comment: commentData.comment,
      date: new Date().toISOString(),
      username: commentData.name,
    };

    try {
      const response = await fetch(`/api/fotos/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        mutateComments();
      } else {
        console.error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Comment submitted:", result);
    } catch (error) {
      console.error("Error when sending post request.", error);
    } finally {
      e.target.reset();
    }
  }

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

      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  }

  async function handleClickDelete(commentId) {
    try {
      const response = await fetch(`/api/fotos/${id}/comments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      const result = await response.json();

      console.log(result);

      if (response.ok) {
        mutateComments();
      }
    } catch (error) {
      console.error({ message: "Frontend Delete Attempt failed." });
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
        <button onClick={onRetroClick}>
          {retroMode ? "NORMAL MODE" : "RETRO MODE"}
        </button>
        <Comments
          comments={comments}
          onCommentAdd={handleAddComment}
          currentUserId={sessionData.user.userId}
          currenUser={sessionData.user.name}
          onClickDelete={handleClickDelete}
        />
      </Layout>
    </>
  );
}
