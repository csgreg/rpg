import { collection, getDocs, query, where } from "@firebase/firestore";
import React, { useState } from "react";
import { Button, Col, Container, ProgressBar, Row } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import CharacterMaterials from "../Items/CharacterMaterials";

export default function StartNewAdventure({
  setAdventureStarted,
  character,
  adventureStarted,
}) {
  const { adventures, getMaterialById, updateCharacter, getMaterialFile } =
    useData();
  const [loading, setLoading] = useState(false);

  async function handleAdventureStart(selectedAdventure) {
    if (character) {
      if (character.adventurePoint >= selectedAdventure.time) {
        character.adventurePoint -= selectedAdventure.time;
      } else {
        return;
      }
      character.adventureStarted = true;
      let currentTime = new Date();
      character.adventureStartedAt = currentTime;

      let currentTime2 = new Date();
      let b = currentTime2.setMinutes(
        currentTime2.getMinutes() + selectedAdventure.time
      );
      character.adventureEndAt = new Date(b);

      character.adventure = selectedAdventure.id;
      updateCharacter(character);
    }
    setAdventureStarted(true);
    setLoading(false);
  }

  return (
    <div className="m-3">
      <Container className="text-center">
        <Row lg={3} md={3} sm={1} xs={1}>
          {adventures.map((a) => (
            <Container>
              <div className="adventure">
                <div style={{ height: "10px" }}></div>
                <h3 style={{ marginBottom: "20px" }} className="mt-2">
                  {a.name}
                </h3>
                <p>{a.time} minutes</p>
                <div
                  style={{
                    margin: "auto",
                  }}
                >
                  <Row
                    lg={a.loot.length}
                    md={a.loot.length}
                    sm={a.loot.length}
                    xs={a.loot.length}
                  >
                    {a.loot.map((m) => (
                      <CharacterMaterials
                        width="40px"
                        imageName={getMaterialFile(m)}
                      />
                    ))}
                  </Row>
                </div>
                <Button
                  style={{
                    color: "black",
                    backgroundColor: "white",
                    borderColor: "white ",
                  }}
                  className="mb-4"
                  disabled={loading}
                  onClick={() => {
                    handleAdventureStart(a);
                  }}
                >
                  Select
                </Button>
              </div>
            </Container>
          ))}
        </Row>
      </Container>
    </div>
  );
}
