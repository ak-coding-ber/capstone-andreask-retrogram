import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";

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
  const { data } = useSWR("/api/fotos", { fallbackData: [] });

  console.log(data);

  return (
    <>
      <h1>This will be the gallery page!</h1> <LoginLogoutButton />
      <br />
      <br />
      <main>
        {data.length &&
          data.map((foto) => {
            return (
              <Image
                key={foto.id}
                width={200}
                height={200}
                src={foto.imageUrl}
                alt="gallery image"
              ></Image>
            );
          })}
        <code
          style={{
            display: "block",
            width: "100%",
            height: "30rem",
            overflow: "auto",
          }}
        >
          <pre
            style={{
              width: "100%",
              height: "20rem",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              overflow: "auto",
            }}
          >
            {/* just temporary to see directly how the data is stored in my database*/}
            {JSON.stringify(data, null, 2)}
          </pre>
        </code>
      </main>
    </>
  );
}
