import styled from "styled-components";

const StyledArticle = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--secondary-color);
  border-radius: 0.8rem;
  padding: 0.5rem;
  margin-bottom: 10px;
  text-align: center;
  p {
    border-bottom: solid 1px black;
    // padding: 20px;
  }
`;

const CommentContainer = styled.li`
  display: flex;
  flex-direction: column;
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
export default function Comments({ comments }) {
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
        {comments.length ? (
          comments.map((comment) => (
            <StyledArticle key={comment._id}>
              <CommentContainer>
                <StyledSpan>{comment.comment}</StyledSpan>
                <p>Commented by: {comment.username}</p>
              </CommentContainer>
            </StyledArticle>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No comments available yet</p>
        )}
      </ul>
    </>
  );
}
