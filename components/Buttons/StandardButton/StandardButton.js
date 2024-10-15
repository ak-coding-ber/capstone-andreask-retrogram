import styled from "styled-components";
import { Press_Start_2P } from "@next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export const StyledStandardButton = styled.button`
  width: 180px;
  height: 80px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  background-color: var(--secondary-color);
  color: white;
  border: white solid 3px;
`;

export default function StandardButton({ onClick, $variant, text }) {
  return (
    <StyledStandardButton
      className={pressStart2P.className}
      onClick={onClick}
      $variant={$variant}
    >
      {text}
    </StyledStandardButton>
  );
}
