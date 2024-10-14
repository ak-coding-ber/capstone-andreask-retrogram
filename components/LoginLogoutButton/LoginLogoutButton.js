import { useSession, signIn, signOut } from "next-auth/react";
import styled from "styled-components";

export default function LoginLogoutButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <p style={{ paddingTop: "20px", lineHeight: "2" }}>
          Signed in as {session.user.email}
        </p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return <button onClick={() => signIn()}>Sign in</button>;
}
