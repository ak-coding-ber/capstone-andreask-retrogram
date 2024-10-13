import styled from "styled-components";

const StyledImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  margin: 0px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  position: relative;
  max-width: 80%;
  display: inline-block;
`;

export default function ImageContainer({ children, $size }) {
  return (
    <>
      <StyledImageContainer $size={$size}>{children}</StyledImageContainer>
    </>
  );
}
