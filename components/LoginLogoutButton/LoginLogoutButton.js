import { useSession, signIn, signOut } from "next-auth/react";
import StandardButton from "../Buttons/StandardButton/StandardButton";
import { Press_Start_2P } from "@next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export default function LoginLogoutButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <p
          style={{
            paddingTop: "20px",
            lineHeight: "2",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          Signed in as {session.user.email}
        </p>
        <StandardButton
          onClick={() => signOut()}
          text={"Logout"}
          className={pressStart2P.className}
          $variant={"logout"}
        ></StandardButton>
      </>
    );
  }
  return (
    <StandardButton
      onClick={() => signIn()}
      text={"LOGIN"}
      className={pressStart2P.className}
    ></StandardButton>
  );
}
