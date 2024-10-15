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

  ${(props) =>
    props.$variant === "logout" &&
    `width: 130px;
    height: 50px;
    &:hover {
    background-color: var(--primary-color);
  }

  `};

  ${(props) =>
    props.$variant === "comment-submit" &&
    `width: 130px;
    height: 50px;
    justify-self: center;
        &:hover {
    background-color: var(--primary-color);
  }

  `};

  ${(props) =>
    props.$variant === "delete" &&
    `width: 40px;
    height: 40px;
      &:hover {
    background-color: red;
  }`};

  ${(props) =>
    (props.$variant === "generate" || props.$variant === "upload") &&
    `width: 180px;
    height: 80px;
    align-self: center;
    &:hover {
    background-color: var(--primary-color);
  }

  `};

  ${(props) =>
    (props.$variant === "generating" || props.$variant === "uploading") &&
    `width: 180px;
    height: 80px;
    align-self: center;
    background-color: var(--backgroundcolor);
  `};
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
