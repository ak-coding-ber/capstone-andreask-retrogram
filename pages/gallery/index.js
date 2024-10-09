import FotoList from "@/components/FotoList/FotoList";
import Layout from "@/components/Layout/Layout";
import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession, useSession } from "next-auth/react";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { useFavorites } from "@/context/FavoritesContext";

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

export default function GalleryPage() {
  const [retroMode, setRetroMode] = useState(false);
  const { data, isLoading } = useSWR("/api/fotos", { fallbackData: [] });
  const [isLiked, setIsLiked] = useState(false);
  const { data: sessionData } = useSession();
  const { favorites } = useFavorites();
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  // useEffect(() => {
  //   if (sessionData?.user) {
  //     setIsLoadingFavorites(true);
  //     getFavoritesData(sessionData.user.userId); // Fetch favorites when sessionData is authenticated
  //   }
  // }, [sessionData]);

  // async function getFavoritesData(userId) {
  //   try {
  //     const response = await fetch(`/api/favorites?userId=${userId}`);
  //     const data = await response.json();

  //     if (data[0].imageIds && data[0].imageIds.length > 0) {
  //       setFavorites(data[0].imageIds);
  //       setIsLoadingFavorites(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching favorites:", error);
  //   }
  // }

  function handleRetroClick() {
    setRetroMode(!retroMode);
  }

  function handleLikeClick(fotoId) {
    setIsLiked(!isLiked);
    console.log(`isLiked is set to ${!isLiked} for foto ${fotoId}`);
  }

  if (isLoading) {
    return null;
  }

  console.log("favorites inside gallery page", favorites);

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
            isLiked={isLiked}
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
            {JSON.stringify(data[0], null, 2)}
          </pre>
        </code>
        <button onClick={handleRetroClick}>
          {retroMode ? "NORMAL MODE" : "RETRO MODE"}
        </button>
      </Layout>
    </>
  );
}
