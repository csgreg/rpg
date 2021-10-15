import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router";

export default function GNavbar() {
  const { logout } = useAuth();

  const history = useHistory();

  async function handleLogout() {
    try {
      await logout();
      history.push("/login");
    } catch {
      //TODO
    }
  }
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">RPG</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              <Link to="/">Character</Link>
            </Nav.Link>

            <Nav.Link>
              <Link to="/profession">Profession</Link>
            </Nav.Link>

            <Nav.Link>
              <Link to="/adventure">Adventure</Link>
            </Nav.Link>

            <Nav.Link>
              <Link to="/marketplace">Marketplace</Link>
            </Nav.Link>

            <Nav.Link>
              <Link to="/guild">Guild </Link>
            </Nav.Link>

            <NavDropdown title="Profile" id="basic-nav-dropdown">
              <NavDropdown.Item>
                <Link to="/update-profile">Update Profile</Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => handleLogout()}>
                Log out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
