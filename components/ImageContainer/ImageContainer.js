import styled from "styled-components";

const StyledImageContainer = styled.div`
  padding: 0px;
  margin: 0px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  position: relative;
`;

export default function ImageContainer({ children, $size }) {
  return (
    <>
      <StyledImageContainer $size={$size}>{children}</StyledImageContainer>
    </>
  );
}
