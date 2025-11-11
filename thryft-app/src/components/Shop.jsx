import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/FirebaseContext";
import { collection, getDocs } from "firebase/firestore";

export default function Shop() {
  const { db } = useFirebase(); // ✅ access Firestore from context
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "shopItems"));
      setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchItems();
  }, [db]);

  return (
    <div>
      <h1>Shop Items</h1>
      <ul>
        {items.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
}
