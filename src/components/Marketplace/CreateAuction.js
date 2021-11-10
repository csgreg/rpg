import { addDoc, collection, doc, setDoc } from "@firebase/firestore";
import React, { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import db from "../../firebase";

export default function CreateAuction({ character }) {
  const [initializing, setInitializing] = useState(true);
  const { getMaterialById, materials, updateCharacter } = useData();
  const [gold, setGold] = useState();
  const [quantity, setQuantity] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { characterId } = useAuth();
  const [selectedMaterial, setSelectedMaterial] = useState();

  if (initializing && materials.length !== 0 && character.name) {
    setInitializing(false);
  }

  console.log("mat", selectedMaterial);
  console.log("g", gold);
  console.log("q", quantity);

  async function handleSubmit(e) {
    setLoading(true);
    setError("");
    e.preventDefault();
    if (!gold) {
      setError("Please set the price!");
      return;
    }
    if (!quantity) {
      setError("Please set the quantity!");
      setLoading(false);
      return;
    }
    if (!selectedMaterial || selectedMaterial == -1) {
      setError("Something went wrong!");
      setLoading(false);
      return;
    }

    if (character.materials[selectedMaterial] < quantity) {
      setError("Failed to create auction, you dont have enough material!");
      setLoading(false);
      return;
    } else {
      character.materials[selectedMaterial] -= quantity;
    }

    await updateCharacter(character);

    const collectionRef = collection(db, "marketplace");
    const payload = {
      buyer: "",
      date: new Date(),
      gold: gold,
      material: selectedMaterial,
      quantity: quantity,
      seller: characterId,
      status: "active",
    };

    try {
      const c = await addDoc(collectionRef, payload);
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  }

  return (
    <div>
      {initializing && <div>Loading...</div>}
      {!initializing && (
        <div className="w-90 m-4">
          <Card>
            <Card.Header>Create auction</Card.Header>
            <Card.Body>
              <Card.Text>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={(e) => handleSubmit(e)}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      step=".01"
                      min="0.01"
                      onChange={(e) => setGold(e.target.value)}
                      type="number"
                      placeholder="Price"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      onChange={(e) => setQuantity(e.target.value)}
                      type="number"
                      placeholder="Quantity"
                      min="0"
                    />
                  </Form.Group>

                  <Form.Label>Material</Form.Label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                  >
                    <option value="-1">Select a material</option>(
                    {Object.keys(character.materials).map((m) => (
                      <option value={m}>{getMaterialById(m)}</option>
                    ))}
                  </select>
                  <Button
                    className="mt-4"
                    disabled={loading}
                    type="submit"
                    variant="primary"
                  >
                    Create
                  </Button>
                </Form>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}
