import React, { useEffect, useState } from "react";
import { Alert, Container, ProgressBar } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import AdventureCountDown from "./Adventure/AdventureCountDown";
import AdventureFinished from "./Adventure/AdventureFinished";
import StartNewAdventure from "./Adventure/StartNewAdventure";
import GNavbar from "./Navbar";
import db from "../firebase";
import { collection, doc, onSnapshot } from "@firebase/firestore";

export default function Adventure() {
  const { adventures, getCharacterByUserId, updateCharacter, loading } =
    useData();
  const { currentUser, characterId } = useAuth();

  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const [character, setCharacter] = useState({});
  const [characters, setCharacters] = useState({});
  const [characterCreated, setCharacterCreated] = useState(false);
  const [adventureStarted, setAdventureStarted] = useState(false);
  const [adventureEnded, setAdventureEnded] = useState(false);
  const [lootCalculated, setLootCalculated] = useState(false);

  if (initializing && adventures.length !== 0 && character.name !== "") {
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
    if (character.adventurePointReset) {
      let date = new Date(character.adventurePointReset.toDate());
      console.log(date);
      let day = date.getUTCDate() + 1;
      let month = date.getUTCMonth() + 1;
      let year = date.getUTCFullYear();

      let today = new Date();
      let todayday = today.getUTCDate() + 1;
      let todaymonth = today.getUTCMonth() + 1;
      let todayyear = today.getUTCFullYear();
      console.log(todayday, todaymonth, todayyear);
      console.log(day, month, year);

      if (todayday !== day || todaymonth !== month || todayyear !== year) {
        character.adventurePointReset = today;
        character.adventurePoint = 80;
      }
      await updateCharacter(character);
    }
  }, [initializing]);

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
    <div style={{ position: "relative" }}>
      <Container className="text-center adventureposs">
        <div className="adventure audomargin adventurepoint">
          <p id="adventurepoint">
            Adventure Point: {character.adventurePoint} / 80
          </p>
        </div>
      </Container>
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
          setAdventureStarted={setAdventureStarted}
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
