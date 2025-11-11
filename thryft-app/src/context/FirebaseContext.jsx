import React, { createContext, useContext } from "react";
import { db, auth } from "../firebase"; // ✅ make sure firebase.js exists at this path

const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ db, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
};
