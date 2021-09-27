import { doc, setDoc } from "@firebase/firestore";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import db from "../../firebase";

export default function CharacterStatsManagement({ character }) {
  //loading state to disable the buttons while the functions finish
  const [loading, setLoading] = useState(false);

  //increase strength button handler
  async function increaseStrength() {
    setLoading(true);
    const price = 0.5 + (character.strength - 5) * 0.5;
    //if the character has enough money
    if (character.gold >= price) {
      //
      character.gold -= price;
      character.strength += 1;
    }
    //select the characters table and the current character's ID
    const docRef = doc(db, "characters", character.id);
    //the new "row" for the character
    const payload = character;
    //upload
    await setDoc(docRef, payload);
    setLoading(false);
  }

  //copy-paste
  async function increaseIntellect() {
    setLoading(true);
    const price = 0.5 + (character.intellect - 5) * 0.5;
    if (character.gold >= price) {
      character.gold -= price;
      character.intellect += 1;
    }
    const docRef = doc(db, "characters", character.id);
    const payload = character;
    await setDoc(docRef, payload);
    setLoading(false);
  }

  //copy-paste
  async function increaseDexterity() {
    setLoading(true);
    const price = 0.5 + (character.dexterity - 5) * 0.5;
    if (character.gold >= price) {
      character.gold -= price;
      character.dexterity += 1;
    }
    const docRef = doc(db, "characters", character.id);
    const payload = character;
    await setDoc(docRef, payload);
    setLoading(false);
  }

  //copy-paste
  async function increaseStamina() {
    setLoading(true);
    const price = 0.5 + (character.dexterity - 5) * 0.5;
    if (character.gold >= price) {
      character.gold -= price;
      character.stamina += 1;
    }
    const docRef = doc(db, "characters", character.id);
    const payload = character;
    await setDoc(docRef, payload);
    setLoading(false);
  }

  //copy-paste (fortune starts at level 25 (25% chance for critical strike))
  async function increaseFortune() {
    setLoading(true);
    const price = 0.5 + (character.critical - 25) * 0.5;
    if (character.gold >= price) {
      character.gold -= price;
      character.critical += 1;
    }
    const docRef = doc(db, "characters", character.id);
    const payload = character;
    await setDoc(docRef, payload);
    setLoading(false);
  }

  return (
    <div>
      <p>
        Strength: {character.strength}{" "}
        <Button disabled={loading} onClick={() => increaseStrength()}>
          - {0.5 + (character.strength - 5) * 0.5} gold to increase
        </Button>
      </p>
      <p>
        Intellect: {character.intellect}{" "}
        <Button disabled={loading} onClick={() => increaseIntellect()}>
          - {0.5 + (character.intellect - 5) * 0.5} gold to increase
        </Button>
      </p>
      <p>
        Dexterity: {character.dexterity}{" "}
        <Button disabled={loading} onClick={() => increaseDexterity()}>
          - {0.5 + (character.dexterity - 5) * 0.5} gold to increase
        </Button>
      </p>
      <p>
        Stamina: {character.stamina}{" "}
        <Button disabled={loading} onClick={() => increaseStamina()}>
          - {0.5 + (character.stamina - 5) * 0.5} gold to increase
        </Button>
      </p>
      <p>
        Fortune: {character.critical}{" "}
        <Button disabled={loading} onClick={() => increaseFortune()}>
          - {0.5 + (character.critical - 25) * 0.5} gold to increase
        </Button>
      </p>
      <p>Armor: {character.armor}</p>
    </div>
  );
}