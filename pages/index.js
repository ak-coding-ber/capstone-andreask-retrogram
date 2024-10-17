import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import Image from "next/image";

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
      <br />
      <br />
      <Image
        src="/images/RetrogramLogo.jpg"
        width={250}
        height={250}
        alt="Retrogram Logo"
        style={{ margin: "50px 0 10px 0" }}
      />
      {/* <Form /> */}
      {/* {session && <p>Signed in as {session.user.email}.</p>}
      {!session && <p>Not signed in</p>} */}
      <h2 style={{ fontSize: "12" }}>Please sign in with Github or Google</h2>
      <LoginLogoutButton />
    </Layout>
  );
}
