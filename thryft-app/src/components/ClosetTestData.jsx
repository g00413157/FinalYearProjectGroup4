// src/components/ClosetTestData.jsx
import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { useFirebase } from "../context/FirebaseContext";

export default function ClosetTestData() {
  const { db } = useFirebase();

  const addTestItem = async () => {
    try {
      await addDoc(collection(db, "closetItems"), {
        name: "Red T-Shirt",
        category: "Tops",
        image: "https://via.placeholder.com/150",
      });
      await addDoc(collection(db, "closetItems"), {
        name: "Blue Jeans",
        category: "Bottoms",
        image: "https://via.placeholder.com/150",
      });
      await addDoc(collection(db, "closetItems"), {
        name: "Sneakers",
        category: "Shoes",
        image: "https://via.placeholder.com/150",
      });
      alert("Test items added!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <button onClick={addTestItem}>Add Test Closet Items</button>
    </div>
  );
}
