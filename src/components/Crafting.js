import { doc, onSnapshot } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import ListItems from "./Crafting/ListItems";
import GNavbar from "./Navbar";
import db from "../firebase";

export default function Crafting() {
  const [initializing, setInitializing] = useState(true);
  const [character, setCharacter] = useState({});

  const { characterId } = useAuth();
  const { loading, items } = useData();

  useEffect(async () => {
    if (characterId)
      await onSnapshot(doc(db, "characters", characterId), (doc) => {
        let newcharacter = doc.data();
        setCharacter({ ...newcharacter, id: characterId });
        if (newcharacter.name) {
          if (!loading) {
            setInitializing(false);
          }
        }
      });
  }, [characterId, loading]);

  return (
    <div>
      {initializing && <div>Loading...</div>}
      {!initializing && <ListItems items={items} character={character} />}
    </div>
  );
}
