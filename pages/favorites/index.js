import FotoList from "@/components/FotoList/FotoList";
import Layout from "@/components/Layout/Layout";
import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession } from "next-auth/react";
import useSWR from "swr";
import { useState } from "react";

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

export default function FavoritesPage() {
  const [retroMode, setRetroMode] = useState(false);
  const { data, isLoading } = useSWR("/api/fotos", { fallbackData: [] });
  //   const { data: favoritesData } = useSWR("/api/favorites", {
  //     fallbackData: [],
  //   });

  function handleRetroClick() {
    setRetroMode(!retroMode);
  }

  if (isLoading) {
    return null;
  }

  if (favoritesData) {
    console.log(favoritesData);
  }

  return (
    <>
      <Layout>
        <h1>This will be the favorties page!</h1>
        <LoginLogoutButton />
        <br />
        <br />
        {/* just for now is use [data[2]] to have a dinstinct view on the favorites page*/}
        {data.length && (
          <FotoList data={[data[2], data[3]]} retroMode={retroMode} />
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
            {JSON.stringify(data[3], null, 2)}
          </pre>
        </code>
        <button onClick={handleRetroClick}>
          {retroMode ? "NORMAL MODE" : "RETRO MODE"}
        </button>
      </Layout>
    </>
  );
}
