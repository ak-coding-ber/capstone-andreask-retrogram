import styled from "styled-components";
import Image from "next/image";

const StyledLikeButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: black;
  border: white solid 1px;
`;

export default function LikeButton({ foto, isLiked, onLikeClick }) {
  return (
    <StyledLikeButton onClick={() => onLikeClick(foto, isLiked)}>
      <Image
        src={isLiked ? "/icons/heart-filled.png" : "/icons/heart.png"}
        width={20}
        height={20}
        alt="like-button"
      ></Image>
    </StyledLikeButton>
  );
}
