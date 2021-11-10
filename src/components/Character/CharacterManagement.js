import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useData } from "../../contexts/DataContext";
import CharacterStatsManagement from "./CharacterStatsManagement";
import characterimage from "../../assets/imgs/character.jpeg";
import { Line } from "rc-progress";
import CharacterMaterials from "../Items/CharacterMaterials";

//get the current character
export default function CharacterManagement({ character, requiredXp }) {
  const { materials, getMaterialFile } = useData();

  if (character.xp) {
    let need = 900 + (character.lvl - 1) * 500;
    if (character.xp >= need) {
      character.lvl++;
      character.xp = character.xp - need;
    }
  }

  return (
    <Container id="charactercontainer">
      <Row className="m-2" lg={2} md={2} sm={1} xs={1}>
        <div>
          <div className="m-3 text-center">
            <img id="characterimg" src={characterimage} />
            <h2>{character.name}</h2>
            <p>
              LVL {character.lvl} {character.role}
            </p>

            <p>Experience: {character.xp}</p>
            <Line
              style={{ maxWidth: "300px" }}
              percent={(character.xp / requiredXp) * 100}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <br />
            <br />
            <h3>Stats</h3>
            <CharacterStatsManagement character={character} />
          </div>
        </div>
        <div>
          <div className="m-3 text-center">
            <h2>Materials</h2>
            <Row id="characterStatmanagement" lg={4} md={4} sm={4} xs={4}>
              {Object.keys(character.materials).map((m) => (
                <CharacterMaterials
                  width="50px"
                  imageName={getMaterialFile(m)}
                  count={character.materials[m]}
                />
              ))}
            </Row>

            <h2>Items</h2>
          </div>
        </div>
      </Row>
    </Container>
  );
}
