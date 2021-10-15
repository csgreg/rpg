import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import firebase from "@firebase/app-compat";
import db from "../firebase";
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [characterId, setCharacterId] = useState("");
  const [loading, setLoading] = useState(true);

  //return all because these are promises -> async calls

  async function signup(email, password) {
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

    return await auth.createUserWithEmailAndPassword(email, password);
  }

  async function login(email, password) {
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCharacterId("");
      setCurrentUser(user);
      let created = false;
      if (user) {
        const q = query(
          collection(db, "characters"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setCharacterId(doc.id);
          created = true;
        });
        if (!created) {
          const collectionRef = collection(db, "characters");
          const payload = {
            userId: user.uid,
          };

          try {
            const c = await addDoc(collectionRef, payload);
            setCharacterId(c.id);
          } catch {
            console.log(
              "Failed to create initial character! Please try again later!"
            );
          }
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    loading,
    characterId,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
