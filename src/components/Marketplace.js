import React, { useEffect, useState } from "react";
import GNavbar from "./Navbar";
import ManageOurAuctions from "./Marketplace/ManageOurAuctions";
import AllAuctions from "./Marketplace/AllAuctions";
import CreateAuction from "./Marketplace/CreateAuction";
import { doc, initializeFirestore, onSnapshot } from "@firebase/firestore";
import db from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

export default function Marketplace() {
  const [characterCreation, setCharacterCreation] = useState(true);
  const [character, setCharacter] = useState({});
  const [initializing, setInitializing] = useState(true);
  const { characterId } = useAuth();
  const { loading } = useData();

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

  useEffect(() => {
    if (!loading) {
      if (character.name) {
        setInitializing(false);
      }
    }
  }, [loading, character]);

  return (
    <div>
      {initializing && <div>Loading...</div>}
      {!initializing && (
        <div>
          <AllAuctions character={character} />
          <CreateAuction character={character} />
          <ManageOurAuctions character={character} />
        </div>
      )}
    </div>
  );
}
