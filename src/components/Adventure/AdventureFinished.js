import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useData } from "../../contexts/DataContext";

export default function AdventureFinished({
  character,
  setAdventureSubmitted,
  setAdventureStarted,
  setAdventureEnded,
  lootCalculated,
  setLootCalculated,
}) {
  const [initializing, setInitializing] = useState(true);

  const [loot, setLoot] = useState([]);

  const { getAdventureById, getMaterialsByIds, updateCharacter } = useData();

  if (initializing) {
    if (character.lootCalculated) {
      setLootCalculated(true);
      setLoot(character.loot);
    }

    setInitializing(false);
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getRandomIntBetween(min, max) {
    return Math.random() * (max - min) + min;
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
    let gold = (
      getRandomIntBetween(adventure.mingold * 10, adventure.maxgold * 10) / 10
    ).toFixed(1);
    let xp = getRandomIntBetween(adventure.minxp, adventure.maxxp).toFixed(0);
    character.xp += parseInt(xp);
    character.gold += parseInt(gold);
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

    setAdventureStarted(false);
    setAdventureEnded(false);
    setLootCalculated(false);
    updateCharacter(character);
  }

  return (
    <div>
      {initializing && <div className="m-3">Loading...</div>}
      {!initializing && !lootCalculated && (
        <div className="m-3">
          <Button onClick={() => handleGetReward()}>Get Reward</Button>
        </div>
      )}
      {!initializing && lootCalculated && (
        <div className="m-3">
          {character.loot.map((l) => (
            <div>
              <p>{l.name}</p>
            </div>
          ))}
          <Button onClick={() => handleLootConfirmed()}>Return</Button>
        </div>
      )}
    </div>
  );
}
