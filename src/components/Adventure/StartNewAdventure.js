import { collection, getDocs, query, where } from "@firebase/firestore";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";

export default function StartNewAdventure({
  setAdventureStarted,
  character,
  adventureStarted,
}) {
  const [selectedAdventure, setSelectedAdventure] = useState({});
  const [showAdventure, setShowAdventure] = useState(false);
  const [materials, setMaterials] = useState([]);
  const { adventures, getMaterialsByIds, updateCharacter } = useData();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  async function handleShowAdventure(adventure) {
    setLoading(true);
    setMaterials([]);
    setSelectedAdventure(adventure);

    setMaterials(await getMaterialsByIds(adventure.loot));
    setShowAdventure(true);
    setLoading(false);
  }

  async function handleAdventureStart() {
    if (character) {
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
      {adventures.map((a) => (
        <Button
          disabled={loading}
          onClick={() => {
            handleShowAdventure(a);
          }}
        >
          {a.name}
        </Button>
      ))}
      {showAdventure && (
        <div>
          <p>Name: {selectedAdventure.name}</p>
          <p>Biom: {selectedAdventure.biom}</p>
          <p>Minimum level: {selectedAdventure.minlevel}</p>
          <p>Time: {selectedAdventure.time} minute</p>
          {materials.map((m) => (
            <p>
              {m.name}: {m.rarity * 100}%
            </p>
          ))}
          <Button disabled={loading} onClick={() => handleAdventureStart()}>
            Start Adventure
          </Button>
        </div>
      )}
    </div>
  );
}
