import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession } from "next-auth/react";
import useSWR from "swr";

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
      <h1>This will be the gallery page!</h1>
      <LoginLogoutButton />
      <code>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </code>
    </>
  );
}
