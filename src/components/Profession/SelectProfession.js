import { collection, doc, onSnapshot, setDoc } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useData } from "../../contexts/DataContext";
import db from "../../firebase";

export default function SelectProfession({ character, setSelectProfession }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [selectedProfession, setSelectedProfession] = useState("");
  const { professions, updateCharacter } = useData();

  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    setError("");

    if (selectedProfession === "") {
      setError("Please choose a profession!");
      setLoading(false);
      return;
    }

    character.profession = selectedProfession.toLowerCase();

    await updateCharacter(character);
    setSelectProfession(false);
    setLoading(false);
  }

  if (initializing) {
    if (professions.length !== 0) {
      setInitializing(false);
    }
  }

  return (
    <>
      {initializing && <div>Loading...</div>}
      {!initializing && (
        <Form
          className="m-3"
          style={{ maxWidth: "400px" }}
          onSubmit={handleSubmit}
        >
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Label>Selected profession: {selectedProfession}</Form.Label>

          {professions.map((p) => (
            <Button
              key={p.id}
              onClick={() => setSelectedProfession(p.name.toLowerCase())}
              className="w-100 mt-3"
            >
              {p.name}
            </Button>
          ))}

          <Button disabled={loading} className="w-100 mt-3" type="submit">
            Select
          </Button>
        </Form>
      )}
    </>
  );
}
