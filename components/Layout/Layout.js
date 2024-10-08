import styled from "styled-components";
import Head from "next/head.js";
import Navigation from "../Navigation/Navigation";

const Main = styled.main`
  width: 100%;
  //   margin: 100px auto 0 auto;
  margin: 100px auto 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%; //min-height: 100vh;

  @media (min-width: 1000px) {
    width: 1000px;
  }
`;
export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Retrogram</title>
      </Head>
      <Navigation />
      <Main>{children}</Main>
    </>
  );
}
