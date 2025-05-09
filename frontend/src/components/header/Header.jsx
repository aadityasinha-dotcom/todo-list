import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <header>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand to="/" as={NavLink} className="fw-bold">
            Task Management App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {token && (
                <>
                  <Nav.Link to="/" as={NavLink}>
                    Home
                  </Nav.Link>
                  <Nav.Link as={"button"} onClick={handleLogout}>
                    Logout
                  </Nav.Link>
                </>
              )}
              {!token && (
                <>
                  <Nav.Link to="/login" as={NavLink}>
                    Login
                  </Nav.Link>
                  <Nav.Link to="/register" as={NavLink}>
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
