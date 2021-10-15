import React, { useState } from "react";
import { useData } from "../../contexts/DataContext";
import CharacterStatsManagement from "./CharacterStatsManagement";

//get the current character
export default function CharacterManagement({ character }) {
  const { materials, getMaterialById } = useData();
  const [initializing, setInitializing] = useState(true);

  if (initializing && materials.length !== 0) {
    setInitializing(false);
  }

  return (
    <div>
      {initializing && <div>Loading...</div>}
      {!initializing && (
        <div className="m-3">
          <p>Character name: {character.name}</p>
          <p>Character role: {character.role}</p>
          <p>Character gold: {character.gold}</p>
          <p>Character crystal: {character.crystal}</p>
          <p>Character profession: {character.profession}</p>
          <p>Character experience: {character.xp}</p>
          <hr />
          <h3>Materials</h3>
          {Object.keys(character.materials).map((m) => (
            <p>
              {getMaterialById(m)}: {character.materials[m]}
            </p>
          ))}
          <h3>Stats</h3>
          <CharacterStatsManagement character={character} />
        </div>
      )}
    </div>
  );
}
