import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router";
import { doc, onSnapshot } from "@firebase/firestore";
import db from "../firebase";
import crystal from "../assets/imgs/crystal.png";
import coin from "../assets/imgs/coin.png";

export default function GNavbar() {
  const { logout, characterId } = useAuth();
  const [character, setCharacter] = useState({});

  useEffect(async () => {
    if (characterId)
      await onSnapshot(doc(db, "characters", characterId), (doc) => {
        let newcharacter = doc.data();
        setCharacter({ ...newcharacter, id: characterId });
      });
  }, [characterId]);

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
    <Navbar id="nav" bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Earl of Arms</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              <Link className="navlink" to="/">
                Character
              </Link>
            </Nav.Link>

            <Nav.Link>
              <Link className="navlink" to="/crafting">
                Crafting
              </Link>
            </Nav.Link>

            <Nav.Link>
              <Link className="navlink" to="/adventure">
                Adventure
              </Link>
            </Nav.Link>

            <Nav.Link>
              <Link className="navlink" to="/marketplace">
                Marketplace
              </Link>
            </Nav.Link>

            <Nav.Link>
              <Link className="navlink" to="/guild">
                Guild{" "}
              </Link>
            </Nav.Link>

            <NavDropdown title="Profile" id="basic-nav-dropdown">
              <NavDropdown.Item>
                <Link className="navlink" to="/update-profile">
                  Update Profile
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                className="navlink"
                onClick={() => handleLogout()}
              >
                Log out
              </NavDropdown.Item>
            </NavDropdown>

            {character.gold >= 0 ? (
              <Nav.Link>
                <span id="navCoin">{character.gold}</span>
                <img
                  id="navCoinIcon"
                  src="https://firebasestorage.googleapis.com/v0/b/rpggame-e41ae.appspot.com/o/Images%2Fcoin.png?alt=media&token=bb8c0bdf-fc54-46db-84a2-81ca432121bd"
                />
              </Nav.Link>
            ) : (
              ""
            )}

            {character.crystal >= 0 ? (
              <Nav.Link>
                <span id="navCoin">{character.crystal}</span>
                <img
                  id="navCoinIcon"
                  src="https://firebasestorage.googleapis.com/v0/b/rpggame-e41ae.appspot.com/o/Images%2Fcrystal.png?alt=media&token=4ab23e4b-90ff-4529-b4d8-86b50b4c4e34"
                />
              </Nav.Link>
            ) : (
              ""
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
