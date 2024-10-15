import styled from "styled-components";

const FormContainer = styled.form`
  display: grid;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: inherit;
  border: 1px solid #344e41;
  border-radius: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
`;

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
export default function Comments({
  comments,
  onCommentAdd,
  currentUserId,
  onClickDelete,
}) {
  return (
    <>
      <h2>Comments</h2>
      {/* <FormContainer onSubmit={onSubmit}> */}
      <FormContainer onSubmit={onCommentAdd}>
        <Label htmlFor="name">Your Name</Label>
        <Input type="text" name="name" placeholder="name" />
        <Label htmlFor="comment">Your Comment</Label>
        <Input type="text" name="comment" placeholder="comment here..." />
        <button type="submit">Send</button>
      </FormContainer>
      <ul
        style={{
          width: "100%",
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
                <p>by: {comment.username}</p>
              </CommentContainer>
              {comment.userId.trim() === currentUserId.trim() ? (
                <button onClick={() => onClickDelete(comment._id)}>
                  Delete
                </button>
              ) : null}
            </StyledArticle>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No comments available yet</p>
        )}
      </ul>
    </>
  );
}
