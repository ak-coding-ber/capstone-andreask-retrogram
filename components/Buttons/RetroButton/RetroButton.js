import styled from "styled-components";
import { Press_Start_2P } from "@next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const StyledRetroButton = styled.button`
  width: 180px;
  height: 80px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  // background-color: var(--primary-color);
  background-color: var(--secondary-color);
  border: 0;
  color: white;
  border: white solid 3px;
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`;

export default function RetroButton({ onRetroClick, retroMode }) {
  return (
    <StyledRetroButton
      className={pressStart2P.className}
      onClick={onRetroClick}
    >
      {retroMode ? "NORMAL MODE" : "PIXELIZE"}
    </StyledRetroButton>
  );
}
