import StandardButton from "../Buttons/StandardButton/StandardButton";
import styled from "styled-components";
import { Press_Start_2P } from "@next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const StyledPromptForm = styled.form`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

export default function PromptForm({ onSubmit, setDescription, isGenerating }) {
  return (
    <>
      <StyledPromptForm onSubmit={onSubmit} className={pressStart2P.className}>
        <label htmlFor="prompt">Your Description</label>
        <textarea
          className={pressStart2P.className}
          type="text"
          id="prompt"
          name="prompt"
          maxLength={100}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            height: "10rem",
            padding: "1rem",
            border: "1px solid #ccc",
            wordBreak: "break-all",
            margin: "1rem 0",
          }}
        />
        <StandardButton
          style={{ justifySelf: "center" }}
          type="submit"
          text={isGenerating ? "GENERATING" : "GENERATE"}
          $variant={isGenerating ? "generating" : "generate"}
        />
      </StyledPromptForm>
    </>
  );
}
