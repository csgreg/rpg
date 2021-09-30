import { collection, doc, onSnapshot, setDoc } from "@firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import db from "../firebase";

const DataContext = React.createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [adventures, setAdventures] = useState([]);

  async function updateCharacter(character) {
    const docRef = doc(db, "characters", character.id);
    const payload = character;
    await setDoc(docRef, payload);
  }

  useEffect(
    async () =>
      await onSnapshot(collection(db, "characters"), (snapshot) =>
        setCharacters(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
      ),
    []
  );

  useEffect(
    async () =>
      await onSnapshot(collection(db, "professions"), (snapshot) =>
        setProfessions(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
      ),
    []
  );

  useEffect(
    async () =>
      await onSnapshot(collection(db, "adventures"), (snapshot) =>
        setAdventures(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
      ),
    []
  );

  if (
    loading &&
    characters.length !== 0 &&
    professions.length !== 0 &&
    adventures.length !== 0
  ) {
    setLoading(false);
  }

  const value = {
    characters,
    loading,
    professions,
    adventures,
    updateCharacter,
  };

  return (
    <DataContext.Provider value={value}>
      {!loading && children}
    </DataContext.Provider>
  );
}
