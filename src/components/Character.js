import { doc, onSnapshot } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import db from "../firebase";
import CharacterCreation from "./Character/CharacterCreation";
import CharacterManagement from "./Character/CharacterManagement";

export default function Character() {
  const [character, setCharacter] = useState({});

  const [initializing, setInitializing] = useState(true);
  const [characterCreation, setCharacterCreation] = useState(true);
  const [requiredXp, setRequiredXp] = useState(0);

  const { characterId } = useAuth();

  useEffect(async () => {
    if (characterId) {
      await onSnapshot(doc(db, "characters", characterId), (doc) => {
        let newcharacter = doc.data();
        setCharacter({ ...newcharacter, id: characterId });
        if (newcharacter.name) {
          setCharacterCreation(false);
          setRequiredXp(900 + (newcharacter.lvl - 1) * 500);
        }
        setInitializing(false);
      });
    }
  }, [characterId]);

  return (
    <>
      {initializing && <div>{/* TODO LOADING... */}</div>}
      {!initializing && characterCreation && (
        <div>
          <CharacterCreation
            character={character}
            setCharacterCreation={setCharacterCreation}
          />
        </div>
      )}
      {!initializing && !characterCreation && (
        <div>
          <CharacterManagement character={character} requiredXp={requiredXp} />
        </div>
      )}
    </>
  );
}
