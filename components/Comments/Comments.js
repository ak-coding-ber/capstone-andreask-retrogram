import styled from "styled-components";

const StyledArticle = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  background-color: var(--secondary-color);
  border-radius: 0.8rem;
  padding: 0.5rem;
  //   margin: 1rem;
  text-align: center;
  p {
    border-bottom: solid 1px black;
    // padding: 20px;
  }
`;

const CommentContainer = styled.li`
  display: flex;
  self-align: start;
  background-color: white;
  color: black;
  border-radius: 0.5rem;
  padding: 5px;
  list-style-type: none;
`;

const StyledSpan = styled.span`
  word-break: break-all;
`;

//{ foto, comments, onSubmit }
export default function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <ul
        style={{
          width: "80%",
          height: "auto",
          listStyle: "none",
          margin: "0",
          padding: "0",
          lineClamp: "none",
          position: "relative",
          maxWidth: "400px",
        }}
      >
        <StyledArticle>
          <CommentContainer>
            <StyledSpan>This picture is amazing!</StyledSpan>
          </CommentContainer>
          <CommentContainer>
            <StyledSpan>I love it!</StyledSpan>
          </CommentContainer>
        </StyledArticle>
      </ul>
    </>
  );
}
