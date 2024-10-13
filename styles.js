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
    width:100%;
    margin: 0;
    font-family: system-ui;
    background-color: var(--background-color);
    color: white;
  }
}
`;
