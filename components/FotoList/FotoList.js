import Image from "next/image";
import styled from "styled-components";
import { uid } from "uid";

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  column-gap: 1rem;
  row-gap: 1rem;
  width: 100%;
  justify-content: center;
`;

const StyledListItem = styled.li`
  list-style: none;
  line-height: 0;
  width: 200px;
  height: 200px;
`;

export default function FotoList({ data, retroMode }) {
  return (
    <StyledList>
      {data.length &&
        data.map((foto, index) => {
          return (
            <StyledListItem
              key={uid()}
              style={{
                listStyle: "none",
                lineHeight: "0",
                width: "200px",
                height: "200px",
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
            </StyledListItem>
          );
        })}
    </StyledList>
  );
}
