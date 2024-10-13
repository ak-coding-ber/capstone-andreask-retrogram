import Image from "next/image";
import styled from "styled-components";

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

export default function FotoList({
  data,
  retroMode,
  onLikeClick,
  favorites,
  onImageClick,
}) {
  return (
    <StyledList>
      {data.length &&
        data.map((foto, index) => {
          //checks if the rendered image is in the users favorites
          const isLiked = favorites.some(
            (favorite) => favorite._id === foto._id
          );
          return (
            <StyledListItem key={foto._id}>
              <button
                onClick={() => onImageClick(foto._id)}
                style={{
                  width: "200px",
                  height: "200px",
                  margin: "0px",
                  lineHeight: "0px",
                  padding: "0px",
                  border: "0px",
                }}
              >
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
              </button>
              <LikeButton onClick={() => onLikeClick(foto, isLiked)}>
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
