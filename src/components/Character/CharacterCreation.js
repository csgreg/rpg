import React, { useRef, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import db from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";

export default function CharacterCreation({ setCharacterCreation, character }) {
  const [error, setError] = useState("");
  const [selectedRole, setselectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  const nameRef = useRef();

  const { currentUser } = useAuth();
  const { characters, updateCharacter } = useData();

  async function handleSubmit(e) {
    setError("");
    e.preventDefault();
    setLoading(true);

    if (nameRef.current.value.length < 5) {
      setError("Minimum length for character name is 5 character!");
      setLoading(false);
      return;
    }

    if (selectedRole === "") {
      setError("Select a role!");
      setLoading(false);
      return;
    }

    for (let c of characters) {
      if (c.name === nameRef.current.value) {
        setError("This name already used!");
        setLoading(false);
        return;
      }
    }

    character.name = nameRef.current.value;
    character.role = selectedRole;
    character.strength = 5;
    character.intellect = 5;
    character.dexterity = 5;
    character.stamina = 5;
    character.critical = 25;
    character.armor = 0;
    character.gold = 10.0;
    character.crystal = 10;
    character.xp = 0;
    character.materials = {};
    character.lvl = 1;
    character.adventurePoint = 80;
    character.adventurePointReset = new Date(Date.now());

    await updateCharacter(character);
    setCharacterCreation(false);
    setLoading(false);
  }

  return (
    <Form className="m-3" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-2" id="email">
        <Form.Label>Character name: </Form.Label>
        <Form.Control type="text" ref={nameRef} required></Form.Control>
      </Form.Group>
      <Form.Label>Character's role: {selectedRole}</Form.Label>
      <Button
        onClick={() => {
          setselectedRole("hunter");
        }}
        className="w-100 mt-3"
      >
        Hunter
      </Button>
      <Button
        onClick={() => {
          setselectedRole("mage");
        }}
        className="w-100 mt-3"
      >
        Mage
      </Button>
      <Button
        onClick={() => {
          setselectedRole("warrior");
        }}
        className="w-100 mt-3"
      >
        Warrior
      </Button>
      <Button
        onClick={() => {
          setselectedRole("rogue");
        }}
        className="w-100 mt-3"
      >
        Rogue
      </Button>

      <Button disabled={loading} className="w-100 mt-3" type="submit">
        Create
      </Button>
    </Form>
  );
}
