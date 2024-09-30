import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  :root {
    --primary-color: #24DC58;
    --secondary-color: #0F4029;
    --background-color: black;
    --text-color: white;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: system-ui;
    background-color: var(--background-color);
    color: white;
  }

  main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  }
`;
