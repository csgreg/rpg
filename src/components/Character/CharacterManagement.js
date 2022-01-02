import React, { useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useData } from "../../contexts/DataContext";
import CharacterStatsManagement from "./CharacterStatsManagement";
import characterimage from "../../assets/imgs/character.jpeg";
import { Line } from "rc-progress";
import CharacterMaterials from "../Items/CharacterMaterials";
import CharacterItems from "./CharacterItems";

export default function CharacterManagement({ character, requiredXp }) {
  const { getMaterialFile, getItemNameById, getItemFileById, updateCharacter } =
    useData();
  const [n, setN] = useState(8 - Object.keys(character.materials).length);

  useEffect(async () => {
    if (character.xp) {
      let need = 900 + (character.lvl - 1) * 500;
      if (character.xp >= need) {
        character.lvl++;
        character.xp = character.xp - need;
      }
      await updateCharacter(character);

      let mats = Object.keys(character.materials);
      let num = 0;

      for (let mat of mats) {
        console.log(mat);
        if (character.materials[mat] === 0) {
          num++;
        }
      }

      setN(n + num);
    }
  }, []);

  return (
    <Container id="charactercontainer">
      <Row className="m-2" lg={2} md={1} sm={1} xs={1}>
        <div>
          <div className="m-3 text-center">
            <div style={{ margin: "auto" }}>
              <img
                style={{
                  maxHeight: "150px",
                  maxWidth: "150px",
                  width: "auto",
                }}
                id="characterimg"
                src={characterimage}
              />
            </div>
            <h2 className="mt-2">{character.name}</h2>
            <Row
              style={{
                width: "100%",
                justifyContent: "center",
                margin: "1px",
                marginTop: "25px",
              }}
              lg={3}
              md={3}
              sm={3}
              xs={3}
            >
              {character.head === "" && (
                <div>
                  <CharacterMaterials
                    margin="auto"
                    marginTop="10px"
                    width="60px"
                  />
                </div>
              )}
              {character.head !== "" && (
                <div>
                  <CharacterMaterials
                    imageName={character.head.file}
                    margin="auto"
                    marginTop="10px"
                    width="60px"
                  />
                </div>
              )}
              {character.chest === "" && (
                <div>
                  <CharacterMaterials
                    margin="auto"
                    marginTop="10px"
                    width="60px"
                  />
                </div>
              )}
              {character.chest !== "" && (
                <div>
                  <CharacterMaterials
                    imageName={character.chest.file}
                    margin="auto"
                    marginTop="10px"
                    width="60px"
                  />
                </div>
              )}
              {character.legs === "" && (
                <div>
                  <CharacterMaterials
                    margin="auto"
                    marginTop="10px"
                    width="60px"
                  />
                </div>
              )}
              {character.legs !== "" && (
                <div>
                  <CharacterMaterials
                    imageName={character.legs.file}
                    margin="auto"
                    marginTop="10px"
                    width="60px"
                  />
                </div>
              )}
              {character.weapon === "" && (
                <div>
                  <CharacterMaterials
                    margin="auto"
                    marginTop="10px"
                    width="60px"
                  />
                </div>
              )}
              {character.weapon !== "" && (
                <div>
                  <CharacterMaterials
                    imageName={character.weapon.file}
                    margin="auto"
                    marginTop="10px"
                    width="60px"
                  />
                </div>
              )}
              {character.neck === "" && (
                <div>
                  <CharacterMaterials
                    margin="auto"
                    marginTop="10px"
                    width="60px"
                  />
                </div>
              )}
              {character.neck !== "" && (
                <div>
                  <CharacterMaterials
                    imageName={character.neck.file}
                    margin="auto"
                    marginTop="10px"
                    width="60px"
                  />
                </div>
              )}
              {character.ring === "" && (
                <div>
                  <CharacterMaterials
                    margin="auto"
                    marginTop="10px"
                    width="60px"
                  />
                </div>
              )}
              {character.ring !== "" && (
                <div>
                  <CharacterMaterials
                    imageName={character.ring.file}
                    margin="auto"
                    marginTop="10px"
                    width="60px"
                  />
                </div>
              )}
            </Row>

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
            <h2>Inventory</h2>

            <Row id="characterStatmanagement" lg={4} md={4} sm={4} xs={4}>
              {Object.keys(character.materials).map((m) =>
                character.materials[m] !== 0 ? (
                  <CharacterMaterials
                    width="50px"
                    imageName={getMaterialFile(m)}
                    count={character.materials[m]}
                  />
                ) : (
                  <></>
                )
              )}

              {Array.from(Array(n), (e, i) => {
                return <CharacterMaterials width="50px" />;
              })}
            </Row>

            <h3>Items</h3>
            <CharacterItems
              character={character}
              getItemFileById={getItemFileById}
              getItemNameById={getItemNameById}
            />
          </div>
        </div>
      </Row>
    </Container>
  );
}
