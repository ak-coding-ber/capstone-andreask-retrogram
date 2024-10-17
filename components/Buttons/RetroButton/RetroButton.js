import styled from "styled-components";
import { Press_Start_2P } from "@next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const StyledRetroButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "retroMode", // Prevent these props from going to the DOM
})`
  width: 180px;
  height: 80px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props) =>
    props.retroMode ? "var(--secondary-color)" : "#c10f8a"};
  color: white;
  border: white solid 3px;
  position: fixed;
  bottom: 50px;
  right: 150px;
  z-index: 3;

  ${(props) =>
    props.retroMode &&
    `&:hover {
      background-color: var(--primary-color);
    }`};

  ${(props) =>
    !props.retroMode &&
    `animation: neon-flicker 1.5s infinite;
     background-color: #ff33cc;
  `};

  ${(props) =>
    props.$variant === "details-page" &&
    `position: fixed;
    bottom: 50px;
    right: 150px;
    z-index:0;
  `};

  @media (max-width: 1600px) {
    position: relative;
    top: 0;
    left: 0;
    transform: translateX(0%);
    z-index: 0;
  }

  // Neon flickering effect keyframes
  @keyframes neon-flicker {
    0%,
    100% {
      opacity: 1;
      box-shadow: 0 0 8px #ff33cc, 0 0 20px #ff33cc, 0 0 30px #ff33cc;
    }
    10% {
      opacity: 0.8;
      box-shadow: 0 0 2px #ff33cc, 0 0 10px #ff33cc, 0 0 10px #ff33cc;
    }
    20% {
      opacity: 0.9;
      box-shadow: 0 0 5px #ff33cc, 0 0 15px #ff33cc, 0 0 20px #ff33cc;
    }
    30% {
      opacity: 0.7;
      box-shadow: 0 0 1px #ff33cc, 0 0 5px #ff33cc, 0 0 5px #ff33cc;
    }
    40%,
    60% {
      opacity: 0.95;
      box-shadow: 0 0 6px #ff33cc, 0 0 20px #ff33cc, 0 0 25px #ff33cc;
    }
    50% {
      opacity: 0.85;
      box-shadow: 0 0 3px #ff33cc, 0 0 12px #ff33cc, 0 0 15px #ff33cc;
    }
    70% {
      opacity: 0.6;
      box-shadow: 0 0 0px #ff33cc, 0 0 3px #ff33cc, 0 0 5px #ff33cc;
    }
    80% {
      opacity: 0.95;
      box-shadow: 0 0 7px #ff33cc, 0 0 22px #ff33cc, 0 0 30px #ff33cc;
    }
    90% {
      opacity: 0.9;
      box-shadow: 0 0 6px #ff33cc, 0 0 18px #ff33cc, 0 0 25px #ff33cc;
    }
  }
`;

const TextSpan = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "retroMode", // Prevent these props from going to the DOM
})`
  ${(props) =>
    !props.retroMode &&
    `animation: flicker 6s infinite; 
  `};

  @keyframes flicker {
    0% {
      opacity: 1;
    }
    ,
    1% {
      opacity: 0;
    }
    ,
    3% {
      opacity: 1;
    }
    ,
    76% {
      opacity: 1;
    }
    ,
    77% {
      opacity: 0;
    }
    ,
    78% {
      opacity: 1;
    }
    ,
    89% {
      opacity: 1;
    }
    ,
    90% {
      opacity: 0;
    }
    ,
    91% {
      opacity: 0;
    }
    ,
    100% {
      opacity: 1;
    }
  }
`;

export default function RetroButton({ onRetroClick, retroMode, $variant }) {
  return (
    <StyledRetroButton
      className={pressStart2P.className}
      onClick={onRetroClick}
      $variant={$variant}
      retroMode={retroMode}
    >
      <TextSpan retroMode={retroMode}>
        {retroMode ? "NORMAL MODE" : "PIXELIZE"}
      </TextSpan>
    </StyledRetroButton>
  );
}
