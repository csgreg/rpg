import React, { useState } from "react";
import CharacterStatsManagement from "./CharacterStatsManagement";

//get the current character
export default function CharacterManagement({ character }) {
  return (
    <div className="m-3">
      <p>Character name: {character.name}</p>
      <p>Character role: {character.role}</p>
      <p>Character gold: {character.gold}</p>
      <p>Character crystal: {character.crystal}</p>
      <p>Character profession: {character.profession}</p>
      <p>Character experience: {character.xp}</p>
      <hr />

      <CharacterStatsManagement character={character} />
    </div>
  );
}
