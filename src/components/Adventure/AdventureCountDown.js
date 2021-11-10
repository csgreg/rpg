import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useData } from "../../contexts/DataContext";
import crystal from "../../assets/imgs/crystal.png";

export default function AdventureCountDown({
  character,
  setAdventureEnded,
  setAdventureStarted,
  setAdventureSubmitted,
}) {
  const { getAdventureById } = useData();
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [adventure, setAdventure] = useState({});
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const { updateCharacter } = useData();

  async function cancelAdventure() {
    setLoading(true);
    setAdventureStarted(false);
    character.adventureStarted = false;
    await updateCharacter(character);
    setLoading(false);
  }

  async function FinishAdventure() {
    setLoading(true);
    if (character.crystal > 0) {
      character.crystal -= 1;
    } else {
      return;
    }
    character.adventureEndAt = new Date(Date.now());
    await updateCharacter(character);
    setAdventureEnded(true);
    setLoading(false);
  }

  if (initializing) {
    setAdventure(getAdventureById(character.adventure));
    let end = character.adventureEndAt;

    console.log(seconds.toString);
    if (character.adventureEndAt.nanoseconds) {
      end = end.toDate();
    }
    let now = new Date(Date.now());

    let delta = Math.floor((end - now) / 1000);
    console.log(delta);
    setMinutes(Math.floor(delta / 60));
    delta = delta - Math.floor(delta / 60) * 60;
    setSeconds(delta);

    if ((end - now) / 1000 <= 0) {
      setAdventureEnded(true);
    }
    setInitializing(false);
  }

  useEffect(() => {
    var timer = setInterval(() => {
      let end = character.adventureEndAt;

      console.log(seconds.toString);
      if (character.adventureEndAt.nanoseconds) {
        end = end.toDate();
      }
      let now = new Date(Date.now());

      let delta = Math.floor((end - now) / 1000);
      console.log(delta);
      setMinutes(Math.floor(delta / 60));
      delta = delta - Math.floor(delta / 60) * 60;
      setSeconds(delta);

      if ((end - now) / 1000 <= 0) {
        setAdventureEnded(true);
      }
    }, 999);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return (
    <div
      id="adventureCount"
      className="d-flex align-items-center justify-content-center vertical-center"
    >
      <div>
        <p id="adventureName">{adventure.name}</p>
        <p id="adventureCounter" className="text-center">
          {/^\d$/.test(minutes) ? "0" : ""}
          {minutes}:{/^\d$/.test(seconds) ? "0" : ""}
          {seconds}
          <br />
          <div className="w-100">
            <Button
              disabled={loading}
              onClick={() => cancelAdventure()}
              id="cancelAdventureBtn"
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              onClick={() => FinishAdventure()}
              id="buyAdventureBtn"
            >
              Finish Now 1 <img id="navCoinIcon" src={crystal} />
            </Button>
          </div>
        </p>
      </div>
    </div>
  );
}
