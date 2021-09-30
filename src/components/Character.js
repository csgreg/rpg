import { collection, onSnapshot } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import db from "../firebase";
import CharacterCreation from "./Character/CharacterCreation";
import GNavbar from "./Navbar";
import CharacterManagement from "./Character/CharacterManagement";
import { useData } from "../contexts/DataContext";

export default function Character() {
  const [initializing, setInitializing] = useState(true);
  const [character, setCharacter] = useState({});

  const [characterCreation, setCharacterCreation] = useState(true);

  const { currentUser } = useAuth();
  const { characters } = useData();

  //wait backend information (loading)
  if (initializing && characters.length !== 0) {
    //check the user created character or not
    for (let character of characters) {
      if (character.userId === currentUser.uid) {
        //set the user's character
        setCharacter(character);
        setCharacterCreation(false);
      }
    }

    //remove loading screen
    setInitializing(false);
  }

  return (
    <>
      <GNavbar />
      {initializing && <div>Loading...</div>}
      {!initializing && characterCreation && (
        <div>
          <CharacterCreation
            setCharacter={setCharacter}
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
