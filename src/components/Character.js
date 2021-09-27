import { collection, onSnapshot } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import db from "../firebase";
import CharacterCreation from "./Character/CharacterCreation";
import GNavbar from "./Navbar";
import CharacterManagement from "./Character/CharacterManagement";

export default function DashBoard() {
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [character, setCharacter] = useState({});

  const [characterCreation, setCharacterCreation] = useState(false);

  const { currentUser } = useAuth();

  //load characters
  useEffect(
    async () =>
      await onSnapshot(collection(db, "characters"), (snapshot) =>
        setCharacters(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
      ),
    []
  );
  //load .....

  //wait backend information (loading)
  if (loading) {
    if (characters.length !== 0) {
      //check the user created character or not
      let already_created = false;
      for (let character of characters) {
        if (character.userId === currentUser.uid) {
          already_created = true;
          //set the user's character
          setCharacter(character);
        }
      }

      if (!already_created) {
        //show character creation on dashboard
        setCharacterCreation(true);
      }

      //remove loading screen
      setLoading(false);
    }
  }

  return (
    <>
      <GNavbar />
      {loading && <div>Loading...</div>}
      {!loading && characterCreation && (
        <div>
          <CharacterCreation
            setCharacter={setCharacter}
            setCharacterCreation={setCharacterCreation}
            characters={characters}
          />
        </div>
      )}
      {!loading && !characterCreation && (
        <div>
          <CharacterManagement character={character} />
        </div>
      )}
    </>
  );
}
