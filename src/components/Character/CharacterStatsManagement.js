import { doc, setDoc } from "@firebase/firestore";
import React, { useState } from "react";
import { Button, Row } from "react-bootstrap";
import { useData } from "../../contexts/DataContext";
import { FaPlus } from "react-icons/fa";
import coin from "../../assets/imgs/coin.png";

export default function CharacterStatsManagement({ character }) {
  const [loading, setLoading] = useState(false);
  const { updateCharacter } = useData();

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
    character.gold = Math.round(character.gold * 100) / 100;
    await updateCharacter(character);
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
    character.gold = Math.round(character.gold * 100) / 100;
    await updateCharacter(character);
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
    character.gold = Math.round(character.gold * 100) / 100;
    await updateCharacter(character);
    setLoading(false);
  }

  //copy-paste
  async function increaseStamina() {
    setLoading(true);
    const price = 0.5 + (character.stamina - 5) * 0.5;
    console.log(price);
    console.log(character.gold);
    console.log(character.gold >= price);
    if (character.gold >= price) {
      character.gold -= price;
      character.stamina += 1;
    }
    character.gold = Math.round(character.gold * 100) / 100;
    await updateCharacter(character);
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
    character.gold = Math.round(character.gold * 100) / 100;
    await updateCharacter(character);
    setLoading(false);
  }

  return (
    <div>
      <Row id="characterStatmanagement" lg={2} md={2} sm={2} xs={2}>
        <div id="characterstats">
          <p className="characterStatDisplay">
            Strength: {character.strength}{" "}
          </p>
          <p className="characterStatDisplay">
            Intellect: {character.intellect}{" "}
          </p>
          <p className="characterStatDisplay">
            Dexterity: {character.dexterity}{" "}
          </p>
          <p className="characterStatDisplay">Stamina: {character.stamina} </p>
          <p className="characterStatDisplay">Fortune: {character.critical} </p>
          <p className="characterStatDisplay">Armor: {character.armor}</p>
        </div>
        <div>
          <p onClick={() => increaseStrength()} className="increaseStat">
            <span className="increaseStatinner">
              <FaPlus /> {0.5 + (character.strength - 5) * 0.5}{" "}
              <img id="navCoinIcon" src={coin} />
            </span>
          </p>
          <p onClick={() => increaseIntellect()} className="increaseStat">
            <span className="increaseStatinner">
              <FaPlus /> {0.5 + (character.intellect - 5) * 0.5}{" "}
              <img id="navCoinIcon" src={coin} />
            </span>
          </p>
          <p onClick={() => increaseDexterity()} className="increaseStat">
            <span className="increaseStatinner">
              <FaPlus /> {0.5 + (character.dexterity - 5) * 0.5}{" "}
              <img id="navCoinIcon" src={coin} />
            </span>
          </p>
          <p onClick={() => increaseStamina()} className="increaseStat">
            <span className="increaseStatinner">
              <FaPlus /> {0.5 + (character.stamina - 5) * 0.5}{" "}
              <img id="navCoinIcon" src={coin} />
            </span>
          </p>
          <p onClick={() => increaseFortune()} className="increaseStat">
            <span className="increaseStatinner">
              <FaPlus /> {0.5 + (character.critical - 25) * 0.5}{" "}
              <img id="navCoinIcon" src={coin} />
            </span>
          </p>
        </div>
      </Row>
    </div>
  );
}
