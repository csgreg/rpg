import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import db from "../firebase";
import { useAuth } from "./AuthContext";

const DataContext = React.createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [materials, setMaterials] = useState([]);
  const { currentUser } = useAuth();

  async function updateCharacter(character) {
    const docRef = doc(db, "characters", character.id);
    const payload = character;
    await setDoc(docRef, payload);
  }

  useEffect(
    async () =>
      await onSnapshot(collection(db, "characters"), (snapshot) => {
        setCharacters(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }),
    []
  );

  useEffect(
    async () =>
      await onSnapshot(collection(db, "materials"), (snapshot) => {
        setMaterials(snapshot.docs.map((doc) => ({ ...doc.data() })));
      }),
    []
  );

  async function getMaterialsByIds(ids) {
    const q = query(collection(db, "materials"), where("id", "in", ids));
    let materials = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      materials.push(doc.data());
    });
    return materials;
  }

  async function getMaterialById(id) {
    for (let m of materials) {
      if (m.id == id) {
        return m;
      }
    }
  }

  function getCharacterByUserId(userId) {
    for (let c of characters) {
      if (c.userId === currentUser.uid) {
        return c;
      }
    }
  }

  function getMaterialById(id) {
    if (materials.length !== 0) {
      for (let m of materials) {
        if (m.id == id) {
          return m.name;
        }
      }
    }
  }

  function getAdventureById(id) {
    for (let a of adventures) {
      if (a.id === id) {
        return a;
      }
    }
  }

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
    materials,
    updateCharacter,
    getCharacterByUserId,
    getMaterialsByIds,
    getAdventureById,
    getMaterialById,
    getMaterialById,
  };

  return (
    <DataContext.Provider value={value}>
      {!loading && children}
    </DataContext.Provider>
  );
}
