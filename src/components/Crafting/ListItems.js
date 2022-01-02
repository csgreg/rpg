import { collection, onSnapshot, query, where } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useData } from "../../contexts/DataContext";
import db from "../../firebase";
import weapon from "../../assets/imgs/weapon.png";
import armor from "../../assets/imgs/armor.png";
import jewelry from "../../assets/imgs/jewelry.png";
import leather from "../../assets/imgs/leather.png";
import cloth from "../../assets/imgs/cloth.png";
import plate from "../../assets/imgs/plate.png";

import wand from "../../assets/imgs/wand.png";
import dagger from "../../assets/imgs/dagger.png";
import sword from "../../assets/imgs/sword.png";
import bow from "../../assets/imgs/bow.png";

import ring from "../../assets/imgs/ring.png";
import neck from "../../assets/imgs/neck.png";
import CharacterMaterials from "../Items/CharacterMaterials";

export default function ListItems({ character, items }) {
  const [type, setType] = useState("");
  const [subtype, setSubtype] = useState("");
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const { getMaterialFile, updateCharacter } = useData();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const result = items.filter((item) => item.subtype === subtype);
    setList(result);
    console.log(result);
  }, [subtype]);

  async function handleCraftItem() {
    setError("");
    setLoading(true);

    for (let m of Object.keys(selectedItem.materials)) {
      if (!character.materials[m]) {
        setError("Not enough material!");
        setLoading(false);
        return;
      }
      if (character.materials[m] < selectedItem.materials[m]) {
        setError("Not enough material!");
        setLoading(false);
        return;
      }
    }

    for (let m of Object.keys(selectedItem.materials)) {
      character.materials[m] -= parseInt(selectedItem.materials[m]);
    }

    if (character.inventory) {
      character.inventory.push(selectedItem.id);
    } else {
      character.inventory = [];
      character.inventory.push(selectedItem.id);
    }

    await updateCharacter(character);
    setLoading(false);
  }

  return (
    <div className="m-3">
      <Container id="craftingcontainer">
        <Row className="m-2" lg={2} md={2} sm={1} xs={1}>
          <div>
            <h2 className="mt-3">Items</h2>
            <Row className="m-3" lg={3} md={3} sm={3} xs={3}>
              <div>
                <img
                  style={{ width: "50px", height: "50px" }}
                  className="crafttype"
                  src={armor}
                  onClick={() => setType("armor")}
                />
              </div>
              <div>
                <img
                  style={{ width: "50px", height: "50px" }}
                  className="crafttype"
                  src={weapon}
                  onClick={() => setType("weapon")}
                />
              </div>
              <div>
                <img
                  style={{ width: "50px", height: "50px" }}
                  className="crafttype"
                  src={jewelry}
                  onClick={() => setType("jewelry")}
                />
              </div>
            </Row>
            {type === "armor" && (
              <Row className="m-4" lg={3} md={3} sm={3} xs={3}>
                <div>
                  <img
                    style={{ width: "50px", height: "50px" }}
                    className="crafttype"
                    src={plate}
                    onClick={() => setSubtype("plate")}
                  />
                </div>
                <div>
                  <img
                    style={{ width: "50px", height: "50px" }}
                    className="crafttype"
                    src={leather}
                    onClick={() => setSubtype("leather")}
                  />
                </div>
                <div>
                  <img
                    style={{ width: "50px", height: "50px" }}
                    className="crafttype"
                    src={cloth}
                    onClick={() => setSubtype("cloth")}
                  />
                </div>
              </Row>
            )}

            {type === "weapon" && (
              <Row className="m-4" lg={4} md={4} sm={4} xs={4}>
                <div>
                  <img
                    style={{ width: "50px", height: "50px" }}
                    className="crafttype"
                    src={wand}
                    onClick={() => setSubtype("wand")}
                  />
                </div>
                <div>
                  <img
                    style={{ width: "50px", height: "50px" }}
                    className="crafttype"
                    src={dagger}
                    onClick={() => setSubtype("dagger")}
                  />
                </div>
                <div>
                  <img
                    style={{ width: "50px", height: "50px" }}
                    className="crafttype"
                    src={sword}
                    onClick={() => setSubtype("sword")}
                  />
                </div>
                <div>
                  <img
                    style={{ width: "50px", height: "50px" }}
                    className="crafttype"
                    src={bow}
                    onClick={() => setSubtype("bow")}
                  />
                </div>
              </Row>
            )}

            {type === "jewelry" && (
              <Row className="m-4" lg={2} md={2} sm={2} xs={2}>
                <div>
                  <img
                    style={{ width: "50px", height: "50px" }}
                    className="crafttype"
                    src={ring}
                    onClick={() => setSubtype("ring")}
                  />
                </div>
                <div>
                  <img
                    style={{ width: "50px", height: "50px" }}
                    className="crafttype"
                    src={neck}
                    onClick={() => setSubtype("neck")}
                  />
                </div>
              </Row>
            )}
            <div>
              {list.map((item) => (
                <Button onClick={() => setSelectedItem(item)}>
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mt-3">Crafting</h2>
            {selectedItem.name && (
              <div>
                <p>{selectedItem.name}</p>
                {selectedItem.type === "armor" && (
                  <>
                    <p>
                      {selectedItem.subtype} {selectedItem.use}
                    </p>
                    <p>{selectedItem.defense} Armor</p>
                  </>
                )}
                {selectedItem.type === "weapon" && (
                  <p>
                    Damage: {selectedItem.damageMin} - {selectedItem.damageMax}
                  </p>
                )}
                {Object.keys(selectedItem.stats).map((s) => (
                  <p>
                    {s}: +{selectedItem.stats[s]}
                  </p>
                ))}
                {Object.keys(selectedItem.materials).map((m) => (
                  <CharacterMaterials
                    width="40px"
                    imageName={getMaterialFile(m)}
                    count={selectedItem.materials[m]}
                  />
                ))}
                <Button
                  onClick={() => handleCraftItem()}
                  disabled={loading}
                  style={{
                    color: "black",
                    backgroundColor: "white",
                    borderColor: "white",
                  }}
                  className="mb-3"
                >
                  Craft
                </Button>
              </div>
            )}
          </div>
        </Row>
      </Container>
    </div>
  );
}
