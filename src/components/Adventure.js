import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import AdventureCountDown from "./Adventure/AdventureCountDown";
import AdventureFinished from "./Adventure/AdventureFinished";
import StartNewAdventure from "./Adventure/StartNewAdventure";
import GNavbar from "./Navbar";
import db from "../firebase";
import { collection, doc, onSnapshot } from "@firebase/firestore";

export default function Adventure() {
  const { adventures, getCharacterByUserId } = useData();
  const { currentUser, characterId } = useAuth();

  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const [character, setCharacter] = useState({});
  const [characters, setCharacters] = useState({});
  const [characterCreated, setCharacterCreated] = useState(false);
  const [adventureStarted, setAdventureStarted] = useState(false);
  const [adventureEnded, setAdventureEnded] = useState(false);
  const [lootCalculated, setLootCalculated] = useState(false);

  if (initializing && adventures.length !== 0 && character !== {}) {
    let c = getCharacterByUserId(currentUser.uid);
    setCharacter(c);
    if (c) {
      setCharacterCreated(true);
      if (c.adventureStarted) {
        console.log("adventure started");
        setAdventureStarted(true);
        if (c.adventureEnded < Date.now()) {
          console.log("adventure ended");
          setAdventureEnded(true);
          if (c.lootCalculated) {
            setLootCalculated(true);
          }
        }
      }
    }
    setInitializing(false);
  }

  useEffect(async () => {
    await onSnapshot(doc(db, "characters", characterId), (doc) => {
      let newcharacter = doc.data();
      setCharacter(newcharacter);
      if (newcharacter.adventureStarted) {
        console.log("adventure started");
        setAdventureStarted(true);

        let end = newcharacter.adventureEndAt;
        if (newcharacter.adventureEndAt.nanoseconds) {
          end = end.toDate();
        }
        if (end <= new Date(Date.now())) {
          console.log("adventure ended");

          setAdventureEnded(true);
          if (newcharacter.lootCalculated) {
            setLootCalculated(true);
          } else {
            setLootCalculated(false);
          }
        } else {
          setAdventureEnded(false);
        }
      } else {
        setAdventureStarted(false);
      }
      console.log("updated");
    });
  }, []);

  return (
    <div>
      <GNavbar />
      {error && <Alert variant="danger">{error}</Alert>}
      {initializing && <div>Loading...</div>}
      {!initializing && !adventureStarted && !adventureEnded && (
        <StartNewAdventure
          character={character}
          setAdventureStarted={setAdventureStarted}
          adventureStarted={adventureStarted}
        />
      )}
      {!initializing && adventureStarted && !adventureEnded && (
        <AdventureCountDown
          character={character}
          setAdventureEnded={setAdventureEnded}
        />
      )}
      {!initializing && adventureStarted && adventureEnded && (
        <div>
          <AdventureFinished
            setAdventureStarted={setAdventureStarted}
            setAdventureEnded={setAdventureEnded}
            character={character}
            lootCalculated={lootCalculated}
            setLootCalculated={setLootCalculated}
          />
        </div>
      )}
      {!initializing && !characterCreated && (
        <div>Please create a character!</div>
      )}
    </div>
  );
}
