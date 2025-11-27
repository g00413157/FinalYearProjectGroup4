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

import "../../styles/Game.css";

import baseCharacter from "../../assets/base.png";
import room1 from "../../assets/room1.png";
import room2 from "../../assets/room2.jpg";
import street from "../../assets/street.jpeg";
import park from "../../assets/park.jpg";

const BACKGROUNDS = [room1, room2, street, park];
const TOTAL_ROUNDS = 5;

const CHALLENGES = [
  // ------------------------
  // CORE / EVERYDAY THEMES
  // ------------------------
  {
    id: "cozy",
    label: "Comfy & Cozy",
    description: "Build a comfy outfit for relaxing or a casual day out.",
    requiredCategories: ["Tops", "Bottoms", "Shoes"],
    bonusCategories: ["Jackets", "Accessories"],
  },
  {
    id: "retro",
    label: "Retro Vibes",
    description: "Put together a throwback look with retro flair.",
    requiredCategories: ["Tops", "Bottoms", "Shoes"],
    bonusCategories: ["Hats", "Accessories"],
  },
  {
    id: "street",
    label: "Street Style",
    description: "Build a bold, streetwear-inspired outfit.",
    requiredCategories: ["Tops", "Bottoms", "Shoes"],
    bonusCategories: ["Accessories"],
  },
  {
    id: "freestyle",
    label: "Freestyle",
    description: "Anything goes! Just make it look good.",
    requiredCategories: ["Tops", "Bottoms", "Shoes"],
    bonusCategories: ["Jackets", "Accessories", "Hats"],
  },

  // ------------------------
  // DATE / NIGHT OUT
  // ------------------------
  {
    id: "date-night",
    label: "Date Night",
    description: "Style a romantic, put-together outfit for a night out.",
    requiredCategories: ["Tops", "Bottoms", "Shoes"],
    bonusCategories: ["Accessories"],
  },
  {
    id: "girls-night",
    label: "Girls Night Out",
    description: "Fun, trendy, and eye-catching — perfect for the night!",
    requiredCategories: ["Tops", "Bottoms", "Shoes"],
    bonusCategories: ["Accessories"],
  },
  {
    id: "dinner-party",
    label: "Dinner Party",
    description: "Elegant and warm — dress like you're hosting a dinner.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Jackets", "Accessories"],
  },

  // ------------------------
  // SEASONS
  // ------------------------
  {
    id: "summer-day",
    label: "Summer Day Out",
    description: "Choose a breezy outfit perfect for warm weather.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories", "Hats"],
  },
  {
    id: "winter-warm",
    label: "Winter Warm",
    description: "Style a warm, layered outfit for cold weather.",
    requiredCategories: ["Tops", "Bottoms", "Jackets"],
    bonusCategories: ["Accessories", "Hats"],
  },
  {
    id: "spring-fresh",
    label: "Spring Fresh",
    description: "Bright, light, and fresh — perfect spring vibes.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories"],
  },
  {
    id: "autumn-layers",
    label: "Autumn Layers",
    description: "Cosy layered look with warm tones.",
    requiredCategories: ["Tops", "Bottoms", "Jackets"],
    bonusCategories: ["Accessories"],
  },

  // ------------------------
  // WORK & SCHOOL
  // ------------------------
  {
    id: "office-chic",
    label: "Office Chic",
    description: "A clean, professional fit for work.",
    requiredCategories: ["Tops", "Bottoms", "Shoes"],
    bonusCategories: ["Jackets"],
  },
  {
    id: "intern-day",
    label: "Intern Day",
    description: "A sensible but stylish outfit for your first day.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories"],
  },
  {
    id: "back-to-school",
    label: "Back to School",
    description: "A simple, casual school-day look.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories", "Hats"],
  },

  // ------------------------
  // FASHION STYLES
  // ------------------------
  {
    id: "minimalist",
    label: "Minimalist",
    description: "Clean, simple, neutral-toned fashion.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories"],
  },
  {
    id: "maximalist",
    label: "Maximalist",
    description: "Go bold, busy, and expressive!",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories", "Hats"],
  },
  {
    id: "monochrome",
    label: "Monochrome",
    description: "Choose items that all match in colour family.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Shoes"],
  },
  {
    id: "colour-pop",
    label: "Colour Pop",
    description: "Add bold colour accents that stand out.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories"],
  },
  {
    id: "dark-academia",
    label: "Dark Academia",
    description: "Earth tones, classics, and old-money aesthetic.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Jackets"],
  },
  {
    id: "y2k",
    label: "Y2K Throwback",
    description: "Bright, nostalgic Y2K energy.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories", "Hats"],
  },

  // ------------------------
  // EVENTS
  // ------------------------
  {
    id: "festival",
    label: "Festival Fit",
    description: "Colourful, expressive festival outfit.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories", "Hats"],
  },
  {
    id: "concert-night",
    label: "Concert Night",
    description: "Something edgy and iconic for a concert.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Jackets"],
  },
  {
    id: "beach-day",
    label: "Beach Day",
    description: "Light, airy, easy-going beachy vibes.",
    requiredCategories: ["Tops"],
    bonusCategories: ["Accessories", "Hats"],
  },
  {
    id: "gym-run",
    label: "Gym Run",
    description: "A practical, sporty outfit for a workout.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories"],
  },

  // ------------------------
  // WEATHER
  // ------------------------
  {
    id: "rainy-day",
    label: "Rainy Day",
    description: "Something practical for puddles & showers.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Jackets"],
  },
  {
    id: "windy-weather",
    label: "Windy Weather",
    description: "Style an outfit that won't blow away!",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Hats", "Jackets"],
  },

  // ------------------------
  // PERSONALITY THEMES
  // ------------------------
  {
    id: "cute",
    label: "Cute & Soft",
    description: "Soft colours, gentle shapes, cosy vibes.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories"],
  },
  {
    id: "edgy",
    label: "Edgy",
    description: "Dark, sharp, bold outfit choices.",
    requiredCategories: ["Tops", "Bottoms", "Shoes"],
    bonusCategories: ["Jackets", "Accessories"],
  },
  {
    id: "artsy",
    label: "Artsy",
    description: "Creative, expressive, unique pieces.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories"],
  },
  {
    id: "cute-grunge",
    label: "Cute Grunge",
    description: "Mix soft aesthetic with grunge textures.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Jackets"],
  },

  // ------------------------
  // SPECIAL FUN THEMES
  // ------------------------
  {
    id: "mystery",
    label: "Mystery Outfit",
    description: "Choose items that feel dark, elegant, mysterious.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories"],
  },
  {
    id: "character-core",
    label: "Character Core",
    description: "Dress like a character from your favourite show!",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories", "Hats"],
  },
  {
    id: "old-money",
    label: "Old Money",
    description: "Preppy, classic, wealthy aesthetics.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Jackets"],
  },
  {
    id: "soft-girl",
    label: "Soft Girl",
    description: "Pastels, gentle silhouettes, sweet accessories.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories"],
  },
  {
    id: "clean-girl",
    label: "Clean Girl",
    description: "Minimal, sleek, elegant neutrals.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories"],
  },
  {
    id: "vintage-thrift",
    label: "Vintage Thrift",
    description: "Build an outfit using older-looking or thrift-style pieces.",
    requiredCategories: ["Tops", "Bottoms"],
    bonusCategories: ["Accessories"],
  }
];

const LoadingSpinner = () => <div className="spinner" />;

export default function Game() {
  const { currentUser } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

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
  const [lastRoundPoints, setLastRoundPoints] = useState(null);

  const [challenge, setChallenge] = useState(CHALLENGES[0]);

  // LOAD USER'S CLOSET
  useEffect(() => {
    if (!currentUser) return;
    const refCol = collection(db, "users", currentUser.uid, "closet");

    const unsub = onSnapshot(refCol, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  // TIMER
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      setIsRunning(false);
      setLastRoundPoints(0);
      alert("Time is up!");
      return;
    }

    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [isRunning, timeLeft]);

  // CATEGORY MAPPING
  const mapCategory = (c) =>
    ({
      Tops: "top",
      Bottoms: "bottom",
      Shoes: "shoes",
      Hats: "hat",
      Jackets: "jacket",
      Accessories: "accessory",
    }[c] || null);

  // EQUIP
  const handleEquip = (item) => {
    const slot = mapCategory(item.category);
    if (!slot) return;
    setEquipped((prev) => ({ ...prev, [slot]: item }));
  };

  const clearEquipped = () =>
    setEquipped({
      top: null,
      bottom: null,
      shoes: null,
      hat: null,
      jacket: null,
      accessory: null,
    });

  // CHALLENGE LOGIC
  const chooseRandomChallenge = () =>
    CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];

  const startRound = () => {
    clearEquipped();
    setTimeLeft(30);
    setLastRoundPoints(null);
    setChallenge(chooseRandomChallenge());
    setIsRunning(true);
  };

  const startGame = () => {
    if (!items.length) {
      alert("Your closet is empty! Add items to play.");
      return;
    }
    setGameStarted(true);
    setScore(0);
    setRound(1);
    startRound();
  };

  const endGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setIsRunning(false);
    clearEquipped();
    setRound(1);
    setScore(0);
    setBackground(BACKGROUNDS[0]);
  };

  // SUBMIT
  const submitOutfit = () => {
    if (!equipped.top || !equipped.bottom || !equipped.shoes) {
      alert("You need a top, bottoms, and shoes!");
      return;
    }

    let pts = 0;

    challenge.requiredCategories.forEach((c) => {
      const slot = mapCategory(c);
      if (equipped[slot]) pts += 5;
    });

    challenge.bonusCategories.forEach((c) => {
      const slot = mapCategory(c);
      if (equipped[slot]) pts += 3;
    });

    pts += Math.floor(timeLeft * 0.5);

    setScore((s) => s + pts);
    setLastRoundPoints(pts);
    setIsRunning(false);

    if (round >= TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }

    setRound(round + 1);
    startRound();
    alert(`+${pts} points`);
  };

  // SAVE
  const saveOutfit = async () => {
    const outfit = {
      createdAt: serverTimestamp(),
      items: Object.values(equipped)
        .filter(Boolean)
        .map((i) => i.id),
      background,
      name: `Game Outfit • Round ${round}`,
      challengeId: challenge.id,
    };

    await addDoc(
      collection(db, "users", currentUser.uid, "outfits"),
      outfit
    );
    alert("Outfit saved!");
  };

  // DRAG HANDLERS
  const dragStart = (e, item) =>
    e.dataTransfer.setData("item", JSON.stringify(item));

  const onDropEquip = (e) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("item"));
    handleEquip(item);
  };

  if (loading) return <LoadingSpinner />;

  const hasEquipped = Object.values(equipped).some(Boolean);

  // START SCREEN UI
  if (!gameStarted) {
    return (
      <div className="start-screen">
        <div className="start-card">
          <h1 className="start-title">Outfit Challenge</h1>
          <p className="start-subtitle">
            Build your best looks using your Thryft closet.
          </p>

          <ul className="start-rules">
            <li>Each round has a new challenge.</li>
            <li>You must equip: Top, Bottoms, Shoes.</li>
            <li>Bonus points for hats, jackets, accessories.</li>
            <li>30 seconds per round.</li>
          </ul>

          <Button className="start-btn" onClick={startGame}>
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  // GAME SCREEN UI
  return (
    <div className="game-container">
      <div className="game-inner">

        {/* LEFT COLUMN */}
        <section className="left-column">

          {/* TOP BAR */}
          <div className="section-card top-bar-card">
            <div className="top-bar-left">
              <span className="challenge-pill">{challenge.label}</span>
              <span className="round-pill">
                Round {round}/{TOTAL_ROUNDS}
              </span>
            </div>

            <Button
              variant="outline-danger"
              className="end-game-top"
              onClick={endGame}
            >
              End Game
            </Button>
          </div>

          {/* AVATAR */}
          <div className="section-card avatar-card">
            <motion.div
              className="avatar-stage"
              style={{ backgroundImage: `url(${background})` }}
              onDrop={onDropEquip}
              onDragOver={(e) => e.preventDefault()}
            >
              <img src={baseCharacter} className="avatar-base" alt="" />

              {equipped.top && (
                <img src={equipped.top.image} className="layer-top" alt="" />
              )}
              {equipped.bottom && (
                <img
                  src={equipped.bottom.image}
                  className="layer-bottom"
                  alt=""
                />
              )}
              {equipped.shoes && (
                <img
                  src={equipped.shoes.image}
                  className="layer-shoes"
                  alt=""
                />
              )}
              {equipped.hat && (
                <img src={equipped.hat.image} className="layer-hat" alt="" />
              )}
              {equipped.jacket && (
                <img
                  src={equipped.jacket.image}
                  className="layer-jacket"
                  alt=""
                />
              )}
              {equipped.accessory && (
                <img
                  src={equipped.accessory.image}
                  className="layer-accessory"
                  alt=""
                />
              )}
            </motion.div>
          </div>

          {/* INFO PANEL */}
          <div className="section-card info-card">
            <p className="challenge-description">{challenge.description}</p>

            <div className="game-stats">
              <div className="stat-pill">
                <span className="stat-label">Time</span>
                <span className="stat-value">{timeLeft}s</span>
              </div>

              <div className="stat-pill">
                <span className="stat-label">Score</span>
                <span className="stat-value">{score}</span>
              </div>
            </div>

            <div className="requirements">
              <p>
                <strong>Required:</strong>{" "}
                {challenge.requiredCategories.join(", ")}
              </p>
              <p>
                <strong>Bonus:</strong>{" "}
                {challenge.bonusCategories.join(", ")}
              </p>

              {lastRoundPoints !== null && (
                <p className="last-round-points">
                  +{lastRoundPoints} last round
                </p>
              )}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="section-card button-card">
            <div className="button-row">
              <Button
                variant="primary"
                disabled={!isRunning}
                onClick={submitOutfit}
              >
                Submit Outfit
              </Button>

              <Button
                variant="outline-secondary"
                disabled={!hasEquipped}
                onClick={saveOutfit}
              >
                Save
              </Button>

              <Button
                variant="outline-secondary"
                disabled={!hasEquipped}
                onClick={clearEquipped}
              >
                Clear
              </Button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <section className="right-column">
          <div className="closet-section section-card">

            {/* BACKGROUND SELECT */}
            <div className="background-row">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg}
                  className={`bg-chip ${
                    bg === background ? "bg-chip-active" : ""
                  }`}
                  onClick={() => setBackground(bg)}
                >
                  <img src={bg} className="bg-chip-image" alt="" />
                </button>
              ))}
            </div>

            {/* CLOSET HEADER */}
            <div className="closet-header">
              <h2 className="closet-title">Closet</h2>
              <span className="closet-count">{items.length} items</span>
            </div>

            {/* CLOSET GRID */}
            <div className="closet-scroll">
              <div className="closet-grid">
                {items.map((item) => (
                  <motion.button
                    key={item.id}
                    className="closet-item"
                    draggable
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onDragStart={(e) => dragStart(e, item)}
                    onClick={() => handleEquip(item)}
                    onDoubleClick={() => setSelectedItem(item)}
                  >
                    <img
                      src={item.image}
                      className="closet-item-image"
                      alt=""
                    />
                    <span className="closet-item-name">{item.name}</span>
                    <span className="closet-item-tag">{item.category}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ITEM MODAL */}
      <Modal show={!!selectedItem} onHide={() => setSelectedItem(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <img
            src={selectedItem?.image}
            alt=""
            style={{ width: "100%", borderRadius: 12, marginBottom: 12 }}
          />
          <p>
            <strong>Category:</strong> {selectedItem?.category}
          </p>

          <Button variant="danger" onClick={() => handleDelete(selectedItem)}>
            Delete Item
          </Button>
        </Modal.Body>
      </Modal>

      {/* GAME OVER MODAL */}
      <Modal show={gameOver} onHide={() => setGameOver(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Game Over</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>You completed all rounds!</p>
          <p>
            Final Score: <strong>{score}</strong>
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              setGameOver(false);
              setScore(0);
              setRound(1);
              startRound();
            }}
          >
            Play Again
          </Button>

          <Button variant="outline-secondary" onClick={endGame}>
            Back to Start
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
