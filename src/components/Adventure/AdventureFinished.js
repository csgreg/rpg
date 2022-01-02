import React, { useState } from "react";
import { Button, Row } from "react-bootstrap";
import { useData } from "../../contexts/DataContext";
import coin from "../../assets/imgs/coin.png";
import CharacterMaterials from "../Items/CharacterMaterials";

export default function AdventureFinished({
  character,
  setAdventureSubmitted,
  setAdventureStarted,
  setAdventureEnded,
  lootCalculated,
  setLootCalculated,
}) {
  const [initializing, setInitializing] = useState(true);
  const [adventure, setAdventure] = useState({});
  const [loot, setLoot] = useState([]);

  const {
    getAdventureById,
    getMaterialsByIds,
    updateCharacter,
    getMaterialFile,
  } = useData();

  if (initializing) {
    if (character.lootCalculated) {
      setLootCalculated(true);
      setLoot(character.loot);
    }

    setInitializing(false);
    setAdventure(getAdventureById(character.adventure));
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getRandomIntBetween(min, max) {
    let a = Math.random() * (max - min) + min;
    return a;
  }

  async function handleGetReward() {
    let adventure = getAdventureById(character.adventure);
    let poss_loots = await getMaterialsByIds(adventure.loot);

    console.log("Possible loot:", poss_loots);

    let loot = [];

    for (let l of poss_loots) {
      let n = getRandomInt(100);
      if (n <= l.rarity * 100) {
        loot.push(l);
      }
    }

    console.log("Loot:", loot);
    let gold = getRandomIntBetween(adventure.mingold, adventure.maxgold);
    let xp = getRandomIntBetween(adventure.minxp, adventure.maxxp);

    character.adventurexp = parseInt(xp);
    character.adventuregold = Math.round(gold * 100) / 100;
    character.loot = loot;
    character.lootCalculated = true;
    await updateCharacter(character);
    setLootCalculated(true);
  }

  function handleLootConfirmed() {
    if (!character.materials) {
      character.materials = {};
    }
    for (let l of character.loot) {
      if (character.materials[l.id]) {
        character.materials[l.id] += 1;
      } else {
        character.materials[l.id] = 1;
      }
    }
    character.adventureStarted = false;
    character.lootCalculated = false;

    character.gold += parseFloat(character.adventuregold);
    let tmp = character.gold * 100;
    tmp = parseInt(tmp);
    character.gold = tmp / 100;

    character.xp += parseInt(character.adventurexp);

    setAdventureStarted(false);
    setAdventureEnded(false);
    setLootCalculated(false);
    updateCharacter(character);
  }

  return (
    <div>
      {initializing && <div className="m-3">Loading...</div>}
      {!initializing && !lootCalculated && (
        <div
          id="adventureCount"
          className="d-flex align-items-center justify-content-center vertical-center"
        >
          <div>
            <p id="adventureName">{adventure.name}</p>
            <p id="adventureCounter" className="text-center">
              <div className="w-100">
                <Button
                  className="mb-2"
                  id="getrewardBtn"
                  onClick={() => handleGetReward()}
                >
                  Get Reward
                </Button>
              </div>
            </p>
          </div>
        </div>
      )}
      {!initializing && lootCalculated && (
        <div
          id="adventureCount"
          className="d-flex align-items-center justify-content-center vertical-center"
        >
          <div>
            <p id="adventureName">{adventure.name}</p>

            <div className="w-100">
              <span className="adventurereward">
                {character.adventuregold} <img id="navCoinIcon" src={coin} />
              </span>
              <br />
              <span className="adventurereward">
                {character.adventurexp} xp
              </span>
              <Row
                className="mt-3"
                lg={character.loot.length}
                md={character.loot.length}
                sm={character.loot.length}
                xs={character.loot.length}
              >
                {character.loot.map((m) => (
                  <CharacterMaterials width="40px" imageName={m.file} />
                ))}
              </Row>

              <Button id="returnBtn" onClick={() => handleLootConfirmed()}>
                Return
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
