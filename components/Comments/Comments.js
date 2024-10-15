import styled from "styled-components";
import StandardButton from "../Buttons/StandardButton/StandardButton";
import { Press_Start_2P } from "@next/font/google";
import React from "react";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const FormContainer = styled.form`
  display: grid;
  gap: 1rem;
  width: 100%;
  padding: 0.5rem 2rem;
  max-width: 700px;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: inherit;
  border: 1px solid #344e41;
  border-radius: 0.5rem;
  height: 40px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const StyledArticle = styled.article`
  width: 100%;
  display: flex;
  gap: 5px;
  flex-direction: row;
  align-items: center;
  background-color: none;
  border-radius: 0.8rem;
  padding: 0.5rem 0;
  text-align: center;
`;

const CommentContainer = styled.li`
  display: flex;
  width: 100%;
  align-self: center;
  flex-direction: column;
  background-color: var(--primary-color);
  color: var(--background-color);
  background-color: none;
  border-radius: 0.5rem;
  padding: 5px;
  list-style-type: none;
  max-width: 600px;
`;

const StyledSpan = styled.span`
  display: inline-block;
  word-break: break-word;
  vertical-align: top;
  padding: 30px 10px;
`;

const StyledParagraph = styled.p`
  font-size: 10px;
  background-color: none;
  display: 
  color: black;
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
      <FormContainer onSubmit={onCommentAdd}>
        <Label htmlFor="name">Your Name</Label>
        <Input
          type="text"
          name="name"
          placeholder="name"
          className={pressStart2P.className}
        />
        <Label htmlFor="comment">Your Comment</Label>
        <Input
          type="text"
          name="comment"
          placeholder="comment here..."
          className={pressStart2P.className}
        />
        <StandardButton
          type="submit"
          text={"Send"}
          $variant={"comment-submit"}
        />
      </FormContainer>
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "auto",
          listStyle: "none",
          margin: "0",
          lineClamp: "none",
          position: "relative",
          maxWidth: "700px",
        }}
      >
        {comments.length ? (
          comments.map((comment) => (
            // necessary here to prevent error message of missing unique key prop
            <React.Fragment key={comment._id}>
              <StyledArticle>
                <CommentContainer>
                  <StyledSpan>{comment.comment}</StyledSpan>
                </CommentContainer>
                {comment.userId.trim() === currentUserId.trim() ? (
                  <StandardButton
                    text={"X"}
                    $variant={"delete"}
                    onClick={() => onClickDelete(comment._id)}
                  />
                ) : null}
              </StyledArticle>
              <StyledParagraph>by: {comment.username}</StyledParagraph>
            </React.Fragment>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No comments available yet</p>
        )}
      </ul>
    </>
  );
}
