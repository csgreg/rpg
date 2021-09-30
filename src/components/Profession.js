import { collection, onSnapshot } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "../firebase";
import GNavbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext";
import SelectProfession from "./Profession/SelectProfession";
import { useData } from "../contexts/DataContext";

export default function Profession() {
  const [initializing, setInitializing] = useState(true);
  const [haveCharacter, setHaveCharacter] = useState(false);
  const [character, setCharacter] = useState({});
  const [selectProfession, setSelectProfession] = useState(false);
  const { currentUser } = useAuth();
  const { characters } = useData();

  //wait backend information (initializing)
  if (initializing && characters.length !== 0) {
    //check the user created character or not
    for (let character of characters) {
      if (character.userId === currentUser.uid) {
        //set the user's character
        setCharacter(character);
        setHaveCharacter(true);

        if (character.profession === "") {
          setSelectProfession(true);
        }
      }
    }

    //remove initializing screen
    setInitializing(false);
  }

  return (
    <>
      <GNavbar />
      {initializing && <div>initializing...</div>}
      {!initializing && !haveCharacter && <div>Create a character first!</div>}
      {!initializing && selectProfession && (
        <div>
          <SelectProfession
            character={character}
            setSelectProfession={setSelectProfession}
          />
        </div>
      )}
      {!initializing && !selectProfession && <div>Profession Selected</div>}
    </>
  );
}
