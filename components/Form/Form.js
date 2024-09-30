import { StyledForm } from "./Form.styles";

export default function Form() {
  return (
    <>
      <StyledForm action="submit">
        <label htmlFor="email">E-Mail</label>
        <input type="email" name="email" id="email" />
        <label htmlFor="pw">Password</label>
        <input type="password" name="pw" id="pw" />
        <button type="submit">Login</button>
      </StyledForm>
    </>
  );
}
