import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  :root {
    --primary-color: #24DC58;
    --secondary-color: #0F4029;
    --background-color: #1E1E1E;
    --text-color: white;
    font-size: 14px;

  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    width:100%;
    margin: 0;
    font-family: inherit;
    background-color: var(--background-color);
    color: white;
  }
}
`;
