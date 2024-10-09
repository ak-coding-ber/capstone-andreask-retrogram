import Image from "next/image";
import styled from "styled-components";
import { useFavorites } from "@/context/FavoritesContext";

const StyledList = styled.ul`
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  column-gap: 1rem;
  row-gap: 1rem;
  width: 100%;
  justify-content: center;
  list-style: none;

  // makes sure that max. 4 columns are shown
  @media (min-width: 1600px) {
    grid-template-columns: repeat(
      4,
      200px
    ); /* Limit to 4 columns on larger screens */
  }
`;

const StyledListItem = styled.li`
  width: 200px;
  height: 200px;
  position: relative;
`;

const LikeButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: black;
  border: white solid 1px;
`;

export default function FotoList({ data, retroMode, onLikeClick, isLiked }) {
  const { favorites } = useFavorites(); // Access favorites from Context
  console.log("favorites inside FotoList component", favorites);
  return (
    <StyledList>
      {data.length &&
        data.map((foto, index) => {
          return (
            <StyledListItem key={foto._id}>
              <Image
                priority={index === 0}
                width={200}
                height={200}
                src={retroMode ? foto.retroImageUrl : foto.imageUrl}
                alt="gallery image"
                style={{
                  objectFit: "cover",
                }}
              ></Image>
              <LikeButton onClick={() => onLikeClick(foto._id)}>
                <Image
                  src={isLiked ? "/icons/heart-filled.png" : "/icons/heart.png"}
                  width={20}
                  height={20}
                  alt="like-button"
                ></Image>
              </LikeButton>
            </StyledListItem>
          );
        })}
    </StyledList>
  );
}
