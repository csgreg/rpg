import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useData } from "../../contexts/DataContext";
import CharacterMaterials from "../Items/CharacterMaterials";

export default function CharacterItems({
  character,
  getItemFileById,
  getItemNameById,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { updateCharacter, getItemById } = useData();

  async function DropItem(item) {
    setLoading(true);
    let index = character.inventory.indexOf(item);
    character.inventory.splice(index, 1);
    try {
      await updateCharacter(character);
    } catch (e) {
      alert(e);
      setLoading(false);
    }
    setLoading(false);
  }

  async function EquipItem(i) {
    setLoading(true);
    setError("");
    const item = getItemById(i);

    if (item.minLvl <= character.lvl) {
      console.log("LEVEL OK");
    } else {
      setLoading(false);
      setError("Item requires level" + item.minLvl + ".");
      return;
    }

    if (item.roles.indexOf(character.role) === -1) {
      setLoading(false);
      setError("You can't use this item!");
      return;
    }

    if (item.type === "jewelry") {
      character[item.subtype] = item;
    } else if (item.type === "weapon") {
      character.weapon = item;
    } else if (item.type === "armor") {
      character[item.use] = item;
      character.armor = item.defense;
    }

    for (let s of Object.keys(item.stats)) {
      character[s] += item.stats[s];
    }

    let index = character.inventory.indexOf(i);
    character.inventory.splice(index, 1);

    try {
      await updateCharacter(character);
    } catch {
      setLoading(false);
      setError("Failed to save changes on character!");
      return;
    }

    setLoading(false);
  }

  return (
    <div className="d-flex justyfy-items-center">
      <div style={{ width: "95%", marginLeft: "5%" }}>
        {error && <Alert variant="danger">{error}</Alert>}
        {character.inventory.map((i) => (
          <div style={{ height: "60px" }} className="d-flex w-100">
            <div
              style={{ minWidth: "50%" }}
              className="col-xs-6 d-flex align-items-center"
            >
              <CharacterMaterials
                width="50px"
                marginTop="23px"
                imageName={getItemFileById(i)}
              />
              <span style={{ marginLeft: "20px" }}>{getItemNameById(i)}</span>
            </div>
            <div className="col-xs-6 d-flex align-items-center w-100">
              <div style={{ marginLeft: "auto" }}>
                <Button
                  disabled={loading}
                  onClick={() => DropItem(i)}
                  variant="danger"
                  style={{
                    borderTopRightRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Button
                  style={{
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                  }}
                  disabled={loading}
                  variant="success"
                  onClick={() => EquipItem(i)}
                >
                  Equip
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
