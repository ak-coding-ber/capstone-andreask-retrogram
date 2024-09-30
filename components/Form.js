import { StyledForm } from "./Form.styles";

export default function Form() {
  return (
    <>
      <StyledForm action="submit">
        <input type="email" name="email" id="email" />
        <input type="password" name="pw" id="pw" />
        <button type="submit">Login</button>
      </StyledForm>
    </>
  );
}
