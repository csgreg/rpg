import React, { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import AdventureCountDown from "./Adventure/AdventureCountDown";
import AdventureFinished from "./Adventure/AdventureFinished";
import StartNewAdventure from "./Adventure/StartNewAdventure";
import db from "../firebase";
import { doc, onSnapshot } from "@firebase/firestore";

export default function Adventure() {
  const [initializing, setInitializing] = useState(true);
  const [character, setCharacter] = useState({});
  const [characterCreated, setCharacterCreated] = useState(false);
  const [adventureStarted, setAdventureStarted] = useState(false);
  const [adventureEnded, setAdventureEnded] = useState(false);
  const [lootCalculated, setLootCalculated] = useState(false);

  const { adventures, getCharacterByUserId, updateCharacter, loading } =
    useData();
  const { currentUser, characterId } = useAuth();

  /* IF FIRST TIME AND ADVENTURES LOADED ON BACKEND AND CHARACTER CREATED */

  useEffect(() => {
    if (initializing && adventures.length !== 0 && character.name !== "") {
      let c = getCharacterByUserId(currentUser.uid);
      setCharacter(c);
      if (c.name) {
        setCharacterCreated(true);
        if (c.adventureStarted) {
          /* ADVENTURE STARTED */
          setAdventureStarted(true);
          if (c.adventureEnded < Date.now()) {
            /* ADVENTURE ENDED */
            setAdventureEnded(true);
            if (c.lootCalculated) {
              /* REWARD CALCULATED */
              setLootCalculated(true);
            }
          }
        }
        setInitializing(false);
      }
    }
  }, [loading, currentUser]);

  /* IF CHARACTER INITIALIZED CHECK CHARACTER'S ADVENTURE POINT */
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

  /* KEEP CHARACTER UPDATED */
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
      {initializing && <div>Loading...</div>}
      {!initializing && !adventureStarted && !adventureEnded && (
        <>
          <Container className="text-center adventureposs">
            <div className="adventure audomargin adventurepoint">
              <p id="adventurepoint">
                Adventure Point: {character.adventurePoint} / 80
              </p>
            </div>
          </Container>
          <StartNewAdventure
            character={character}
            setAdventureStarted={setAdventureStarted}
            adventureStarted={adventureStarted}
          />
        </>
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
