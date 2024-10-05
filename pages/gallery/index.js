import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";
import { uid } from "uid";

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

  return (
    <>
      <h1>This will be the gallery page!</h1> <LoginLogoutButton />
      <br />
      <br />
      <main>
        <ul>
          {data.length &&
            data.map((foto, index) => {
              return (
                <li key={uid()} style={{ listStyle: "none" }}>
                  <Image
                    priority={index === 0}
                    width={200}
                    height={200}
                    src={foto.imageUrl}
                    alt="gallery image"
                  ></Image>
                </li>
              );
            })}
        </ul>

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
