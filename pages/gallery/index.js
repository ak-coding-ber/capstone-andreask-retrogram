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

export default function GalleryPage() {
  const [retroMode, setRetroMode] = useState(false);
  const { data, isLoading } = useSWR("/api/fotos", { fallbackData: [] });

  function handleRetroClick() {
    setRetroMode(!retroMode);
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
        {data.length && <FotoList data={data} retroMode={retroMode} />}
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
