import { doc, onSnapshot } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import ListItems from "./Crafting/ListItems";
import GNavbar from "./Navbar";
import db from "../firebase";

export default function Crafting() {
  const [initializing, setInitializing] = useState(true);
  const { characterId } = useAuth();

  const [character, setCharacter] = useState({});

  useEffect(async () => {
    if (characterId)
      await onSnapshot(doc(db, "characters", characterId), (doc) => {
        let newcharacter = doc.data();
        setCharacter({ ...newcharacter, id: characterId });
        setInitializing(false);
      });
  }, [characterId]);

  return (
    <div>
      <ListItems character={character} />
    </div>
  );
}
