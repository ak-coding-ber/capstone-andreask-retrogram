import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Layout from "@/components/Layout/Layout";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect to the gallery page once authenticated
      router.push("/gallery");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    // While the authentication status is being determined or user is already logged in, show nothing to avoid flickering effect
    return null;
  }

  return (
    <Layout>
      <h1>RETROGRAM</h1>
      {/* <Form /> */}
      {/* {session && <p>Signed in as {session.user.email}.</p>}
      {!session && <p>Not signed in</p>} */}
      <h2>Please sign in with Github or Google</h2>
      <LoginLogoutButton />
    </Layout>
  );
}
