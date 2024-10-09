import FotoList from "@/components/FotoList/FotoList";
import Layout from "@/components/Layout/Layout";
import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

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
  const { data: sessionData } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  useEffect(() => {
    if (sessionData?.user) {
      setIsLoadingFavorites(true);
      getFavoritesData(sessionData.user.userId); // Fetch favorites when sessionData is authenticated
    }
  }, [sessionData]);

  async function getFavoritesData(userId) {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      const data = await response.json();

      if (data[0].imageIds && data[0].imageIds.length > 0) {
        setFavorites(data[0].imageIds);
        setIsLoadingFavorites(false);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }

  function handleRetroClick() {
    setRetroMode(!retroMode);
  }

  if (isLoadingFavorites) {
    return null;
  }

  return (
    <>
      <Layout>
        <h1>This will be the favorties page!</h1>
        <LoginLogoutButton />
        <br />
        <br />
        {favorites.length && (
          <FotoList data={favorites} retroMode={retroMode} />
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
