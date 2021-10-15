import React, { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";

export default function AdventureCountDown({
  character,
  setAdventureEnded,
  setAdventureSubmitted,
}) {
  const { getAdventureById } = useData();
  const [initializing, setInitializing] = useState(false);
  const [adventure, setAdventure] = useState({});
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  if (initializing) {
    setAdventure(getAdventureById(character.adventure));
    setInitializing(false);
  }

  useEffect(() => {
    var timer = setInterval(() => {
      let end = character.adventureEndAt;

      if (character.adventureEndAt.nanoseconds) {
        end = end.toDate();
      }
      let now = new Date(Date.now());

      let delta = (end - now) / 1000;
      setMinutes(Math.floor(delta / 60));

      setSeconds(Math.ceil(delta - minutes * 60));
      if ((end - now) / 1000 <= 0) {
        setAdventureEnded(true);
      }
    }, 999);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return (
    <div>
      {minutes}:{seconds}
    </div>
  );
}
