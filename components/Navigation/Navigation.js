import styled from "styled-components";

const StyledLayout = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  height: 100px;
  top: 0;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid black;

  .link {
    text-decoration: none;
    font-size: 20px;
    font-weight: 500;
    color: black;
  }
`;

const NavLink = styled.a`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: white;
  //   background-color: ${(props) => (props.$isActive ? "#EAD8C3" : "white")};

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#24DC58" : "#0f4029")};
    color: white;
  }
`;

// originally takes { currentPage }
export default function Navigation() {
  return (
    <>
      <StyledLayout>
        <NavLink
          href={"/gallery"}
          className="link"
          //   $isActive={currentPage === "/gallery" ? true : false}
        >
          Gallery
        </NavLink>
        <NavLink
          href={"/upload"}
          className="link"
          //   $isActive={currentPage === "/upload" ? true : false}
        >
          Upload
        </NavLink>
        <NavLink
          href={"/favorites"}
          className="link"
          //   $isActive={currentPage === "/favorites" ? true : false}
        >
          Favorites
        </NavLink>
      </StyledLayout>
    </>
  );
}
