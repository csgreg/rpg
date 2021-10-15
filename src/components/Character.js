import { collection, doc, onSnapshot } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import db from "../firebase";
import CharacterCreation from "./Character/CharacterCreation";
import GNavbar from "./Navbar";
import CharacterManagement from "./Character/CharacterManagement";
import { useData } from "../contexts/DataContext";

export default function Character() {
  const [character, setCharacter] = useState({});

  const [initializing, setInitializing] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [characterCreation, setCharacterCreation] = useState(true);
  const { characterId, currentUser } = useAuth();
  const { characters } = useData();

  if (initializing && characters.length !== 0) {
    setInitializing(false);
  }

  useEffect(async () => {
    if (characterId)
      await onSnapshot(doc(db, "characters", characterId), (doc) => {
        let newcharacter = doc.data();
        setCharacter({ ...newcharacter, id: characterId });
        if (newcharacter.name) {
          setCharacterCreation(false);
        }
      });
  }, [characterId]);

  return (
    <>
      <GNavbar />
      {initializing && <div>Loading...</div>}
      {!initializing && characterCreation && (
        <div>
          <CharacterCreation
            setCharacter={setCharacter}
            character={character}
            setCharacterCreation={setCharacterCreation}
          />
        </div>
      )}
      {!initializing && !characterCreation && (
        <div>
          <CharacterManagement character={character} />
        </div>
      )}
    </>
  );
}
