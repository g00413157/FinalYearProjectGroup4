import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { db, storage } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import baseCharacter from "../../assets/base.png";

// Import CSS
import "../../styles/Game.css";

// Backgrounds
import room1 from "../../assets/room1.png";
import room2 from "../../assets/room2.jpg";
import street from "../../assets/street.jpeg";
import park from "../../assets/park.jpg";

const BACKGROUNDS = [room1, room2, street, park];

const LoadingSpinner = () => <div className="spinner" />;

export default function Game() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [background, setBackground] = useState(BACKGROUNDS[0]);

  const [equipped, setEquipped] = useState({
    top: null,
    bottom: null,
    shoes: null,
    hat: null,
    jacket: null,
    accessory: null,
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const challenges = [
    "Build a match-day outfit!",
    "Create something comfy.",
    "Go full retro vibes.",
    "Street style time.",
    "Mix it up – no rules!",
  ];
  const [challenge, setChallenge] = useState(challenges[0]);

  // Load closet
  useEffect(() => {
    if (!currentUser) return;

    const closetRef = collection(db, "users", currentUser.uid, "closet");

    const unsubscribe = onSnapshot(closetRef, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Timer
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      setIsRunning(false);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [isRunning, timeLeft]);

  const mapCategory = (cat) => {
    switch (cat) {
      case "Tops":
        return "top";
      case "Bottoms":
        return "bottom";
      case "Shoes":
        return "shoes";
      case "Hats":
        return "hat";
      case "Jackets":
        return "jacket";
      case "Accessories":
        return "accessory";
      default:
        return null;
    }
  };

  const handleEquip = (item) => {
    const key = mapCategory(item.category);
    if (!key) return;

    setEquipped((prev) => ({ ...prev, [key]: item }));
  };

  const clearEquipped = () => {
    setEquipped({
      top: null,
      bottom: null,
      shoes: null,
      hat: null,
      jacket: null,
      accessory: null,
    });
  };

  const handleDelete = async (item) => {
    if (!currentUser) return;

    if (item.image?.startsWith("http")) {
      await deleteObject(ref(storage, item.image)).catch(() => {});
    }

    await deleteDoc(doc(db, "users", currentUser.uid, "closet", item.id));
    setSelectedItem(null);
  };

  const startRound = () => {
    clearEquipped();
    setTimeLeft(30);
    setIsRunning(true);
    setChallenge(challenges[Math.random() * challenges.length | 0]);
  };

  const submitOutfit = () => {
    if (!equipped.top || !equipped.bottom || !equipped.shoes) {
      alert("You must equip a top, bottoms, and shoes!");
      return;
    }

    let points = 10;
    if (equipped.hat) points += 5;
    if (equipped.jacket) points += 5;
    if (equipped.accessory) points += 5;

    setScore((s) => s + points);
    setIsRunning(false);
    setRound((r) => r + 1);
    alert(`Nice! You scored +${points} points 🎉`);
  };

  const saveOutfit = async () => {
    const outfit = {
      createdAt: serverTimestamp(),
      items: Object.values(equipped).filter(Boolean).map((i) => i.id),
      background,
      name: `Game Outfit R${round}`,
    };

    await addDoc(collection(db, "users", currentUser.uid, "outfits"), outfit);
    alert("Outfit saved!");
  };

  const allowDrop = (e) => e.preventDefault();
  const dragStart = (e, item) => e.dataTransfer.setData("item", JSON.stringify(item));
  const onDropEquip = (e) => handleEquip(JSON.parse(e.dataTransfer.getData("item")));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="game-container">
      <div className="game-panel">
        <div className="game-info">
          <h2>Outfit Challenge</h2>
          <p style={{ fontStyle: "italic" }}>{challenge}</p>

          <div className="game-stats">
            <span>⏱ Time: {timeLeft}s</span>
            <span>⭐ Score: {score}</span>
            <span>🔁 Round: {round}</span>
          </div>

          <div className="game-buttons">
            <Button onClick={startRound} variant="success">
              {isRunning ? "Restart Round" : "Start Round"}
            </Button>

            <Button variant="primary" disabled={!isRunning} onClick={submitOutfit}>
              Submit Outfit
            </Button>

            <Button
              variant="outline-secondary"
              disabled={!Object.values(equipped).some(Boolean)}
              onClick={saveOutfit}
            >
              Save Outfit
            </Button>

            {/* NEW BUTTON */}
            <Button
              variant="danger"
              disabled={!Object.values(equipped).some(Boolean)}
              onClick={clearEquipped}
            >
              Clear Outfit
            </Button>
          </div>
        </div>

        <motion.div
          className="avatar-box"
          style={{ backgroundImage: `url(${background})` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDrop={onDropEquip}
          onDragOver={allowDrop}
        >
          <img src={baseCharacter} className="avatar-base" alt="base" />

          {Object.entries(equipped).map(([slot, item]) =>
            item ? (
              <motion.img
                key={slot}
                src={item.image}
                className={`avatar-layer layer-${slot}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              />
            ) : null
          )}
        </motion.div>
      </div>

      <div className="closet-panel">
        <h3>Closet</h3>

        <div className="bg-selector">
          {BACKGROUNDS.map((bg) => (
            <img
              key={bg}
              src={bg}
              className={`bg-thumb ${bg === background ? "active" : ""}`}
              onClick={() => setBackground(bg)}
            />
          ))}
        </div>

        <div className="closet-grid">
          {items.map((item) => (
            <motion.img
              key={item.id}
              src={item.image}
              className="closet-item"
              draggable
              onDragStart={(e) => dragStart(e, item)}
              whileHover={{ scale: 1.12 }}
              onClick={() => handleEquip(item)}
            />
          ))}
        </div>
      </div>

      {/* MODAL */}
      <Modal show={!!selectedItem} onHide={() => setSelectedItem(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={selectedItem?.image} style={{ width: "100%", borderRadius: 10 }} />
          <p>
            <strong>Category:</strong> {selectedItem?.category}
          </p>
          <Button variant="danger" onClick={() => handleDelete(selectedItem)}>
            Delete Item
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
