import React, { useState, useEffect, useMemo } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase";
import "../../styles/Closet.css";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { useAuth } from "../../context/AuthContext";

// Lucide icons
import {
  Shirt,
  Inbox,
  ShoppingBag,
  Gem,
  Star,
  Heart,
  Sparkles,
  Layers,
  PlusCircle,
  Trash,
} from "lucide-react";

// NEW subcomponents
import CategoryBar from "./CategoryBar";
import ClosetStats from "./ClosetStats";
import ItemCard from "./ItemCard";

// ---------------------------------------------------------
//  CONSTANTS
// ---------------------------------------------------------

const TAG_OPTIONS = [
  "Casual",
  "Formal",
  "Summer",
  "Winter",
  "Travel",
  "Sporty",
  "Night Out",
  "Comfy",
];

const COLOR_SWATCHES = [
  "#FFB7C5",
  "#C4B5FD",
  "#A5F3FC",
  "#FDE68A",
  "#D1FAE5",
  "#FBCFE8",
  "#E5E7EB",
];

const LUCIDE_ICON_OPTIONS = [
  { name: "Shirt", icon: <Shirt size={16} /> },
  { name: "Inbox", icon: <Inbox size={16} /> },
  { name: "ShoppingBag", icon: <ShoppingBag size={16} /> },
  { name: "Gem", icon: <Gem size={16} /> },
  { name: "Heart", icon: <Heart size={16} /> },
  { name: "Sparkles", icon: <Sparkles size={16} /> },
  { name: "Layers", icon: <Layers size={16} /> },
];

const getLucideIcon = (name, size = 16) => {
  const IconMap = {
    Shirt: <Shirt size={size} />,
    Inbox: <Inbox size={size} />,
    ShoppingBag: <ShoppingBag size={size} />,
    Gem: <Gem size={size} />,
    Heart: <Heart size={size} />,
    Sparkles: <Sparkles size={size} />,
    Layers: <Layers size={size} />,
  };
  return IconMap[name] || null;
};

// ---------------------------------------------------------
//  SIMPLE HELPERS FOR COLOR + SEASON
// ---------------------------------------------------------

const detectColorTag = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.includes("black")) return "Black";
  if (lower.includes("white") || lower.includes("cream")) return "Neutral";
  if (lower.includes("pink")) return "Pink";
  if (lower.includes("green")) return "Green";
  if (lower.includes("blue")) return "Blue";
  if (lower.includes("brown") || lower.includes("beige")) return "Brown";
  return "Mixed";
};

const inferSeasonTag = (category = "", colorTag = "") => {
  const c = category.toLowerCase();
  const col = colorTag.toLowerCase();
  if (c.includes("coat") || c.includes("jumper") || c.includes("hoodie"))
    return "Winter";
  if (c.includes("dress") || c.includes("shorts")) return "Summer";
  if (col === "brown" || col === "beige") return "Autumn";
  if (col === "green" || col === "pink") return "Spring";
  return "All Year";
};

// ---------------------------------------------------------
//  MAIN CLOSET COMPONENT
// ---------------------------------------------------------

export default function Closet() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // UI State
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortMode, setSortMode] = useState("Newest");
  const [tagFilter, setTagFilter] = useState("All");
  const [seasonFilter, setSeasonFilter] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "Tops",
    image: null,
  });

  // Outfit state
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [newTagValue, setNewTagValue] = useState("");

  // Category modals
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);

  // Category creation
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(COLOR_SWATCHES[0]);
  const [newCategoryIconType, setNewCategoryIconType] = useState("emoji");
  const [emojiInput, setEmojiInput] = useState("");
  const [selectedLucideIcon, setSelectedLucideIcon] = useState("");

  // Delete category
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [reassignTargetCategory, setReassignTargetCategory] = useState("");

  // Firestore data
  const [items, setItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);

  // ---------------------------------------------------------
  //  FETCH ITEMS
  // ---------------------------------------------------------

  useEffect(() => {
    if (!currentUser) return;

    return onSnapshot(
      collection(db, "users", currentUser.uid, "closet"),
      (snapshot) => {
        const mapped = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            favorite: data.favorite ?? false,
            timesWorn: data.timesWorn ?? 0,
            lastWorn: data.lastWorn ?? null,
            colorTag: data.colorTag ?? detectColorTag(data.name),
            seasonTag: data.seasonTag ?? inferSeasonTag(data.category, detectColorTag(data.name)),
          };
        });
        setItems(mapped);
      }
    );
  }, [currentUser]);

  // fetch outfits
  useEffect(() => {
    if (!currentUser) return;
    return onSnapshot(
      collection(db, "users", currentUser.uid, "outfits"),
      (snapshot) =>
        setOutfits(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
  }, [currentUser]);

  // fetch custom categories
  useEffect(() => {
    if (!currentUser) return;
    return onSnapshot(
      collection(db, "users", currentUser.uid, "customCategories"),
      (snapshot) => {
        const cats = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setCustomCategories(cats);
      }
    );
  }, [currentUser]);

  // ---------------------------------------------------------
  //  CATEGORY SYSTEM
  // ---------------------------------------------------------

  const BASE_CATEGORIES = [
    { name: "All", icon: <Layers size={16} /> },
    { name: "Tops", icon: <Shirt size={16} /> },
    { name: "Bottoms", icon: <Inbox size={16} /> },
    { name: "Shoes", icon: <ShoppingBag size={16} /> },
    { name: "Accessories", icon: <Gem size={16} /> },
  ];

  const SPECIAL_CATEGORY = {
    name: "Saved Outfits",
    icon: <Star size={16} className="text-yellow-500" />,
  };

  const mergedCategories = [
    ...BASE_CATEGORIES,
    ...customCategories
      .map((cat) => ({
        name: cat.name,
        color: cat.color,
        iconType: cat.iconType,
        icon:
          cat.iconType === "emoji"
            ? cat.icon
            : getLucideIcon(cat.icon),
        id: cat.id,
        isCustom: true,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  ];

  const categories = [...mergedCategories, SPECIAL_CATEGORY];

  const showingOutfits = activeCategory === "Saved Outfits";

  // ---------------------------------------------------------
  //  FAVORITES + FILTERED ITEMS
  // ---------------------------------------------------------

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      const matchesFavorite = !showFavoritesOnly || item.favorite;

      const matchesSeason =
        seasonFilter === "All" || item.seasonTag === seasonFilter;

      return matchesSearch && matchesCategory && matchesFavorite && matchesSeason;
    });
  }, [items, search, activeCategory, showFavoritesOnly, seasonFilter]);

  // ---------------------------------------------------------
  //  FILTERED OUTFITS
  // ---------------------------------------------------------

  let filteredOutfits = outfits.map((outfit) => {
    const previewItems = items.filter((i) => outfit.items?.includes(i.id));
    return { ...outfit, previewItems };
  });

  if (tagFilter !== "All") {
    filteredOutfits = filteredOutfits.filter((o) =>
      o.tags?.includes(tagFilter)
    );
  }

  filteredOutfits.sort((a, b) => {
    if (sortMode === "Newest")
      return b.createdAt?.toDate() - a.createdAt?.toDate();
    if (sortMode === "Oldest")
      return a.createdAt?.toDate() - b.createdAt?.toDate();
    if (sortMode === "A-Z") return (a.name || "").localeCompare(b.name || "");
    if (sortMode === "Z-A") return (b.name || "").localeCompare(a.name || "");
    return 0;
  });

  // ---------------------------------------------------------
  //  RECENTLY WORN + STATS
  // ---------------------------------------------------------

  const recentlyWornItems = useMemo(() => {
    return items
      .filter((i) => i.lastWorn)
      .sort(
        (a, b) =>
          b.lastWorn?.toMillis?.() - a.lastWorn?.toMillis?.()
      )
      .slice(0, 10);
  }, [items]);

  const stats = useMemo(() => {
    const total = items.length;
    const favorites = items.filter((i) => i.favorite).length;

    const wornThisMonth = items.filter((i) => {
      if (!i.lastWorn) return false;
      const d = i.lastWorn.toDate ? i.lastWorn.toDate() : new Date(i.lastWorn);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const categoryCounts = {};
    items.forEach((i) => {
      categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
    });
    let mostUsedCategory = null;
    let maxCount = 0;
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > maxCount) {
        mostUsedCategory = cat;
        maxCount = count;
      }
    });

    const colorSet = new Set(items.map((i) => i.colorTag));
    const colorTags = Array.from(colorSet).filter(Boolean);

    return {
      totalItems: total,
      favorites,
      wornThisMonth,
      mostUsedCategory,
      colorTags,
    };
  }, [items]);

  // ---------------------------------------------------------
  //  FIRESTORE ACTIONS
  // ---------------------------------------------------------

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.image || !currentUser) return;

    const imgRef = ref(
      storage,
      `users/${currentUser.uid}/closet/${Date.now()}_${newItem.image.name}`
    );

    await uploadBytes(imgRef, newItem.image);
    const url = await getDownloadURL(imgRef);

    const colorTag = detectColorTag(newItem.name);
    const seasonTag = inferSeasonTag(newItem.category, colorTag);

    await addDoc(collection(db, "users", currentUser.uid, "closet"), {
      name: newItem.name,
      category: newItem.category,
      image: url,
      favorite: false,
      timesWorn: 0,
      lastWorn: null,
      colorTag,
      seasonTag,
      createdAt: Timestamp.now(),
    });

    setNewItem({ name: "", category: "Tops", image: null });
    setShowAddItemModal(false);
  };

  const handleDeleteItem = async (item) => {
    if (!currentUser) return;
    await deleteDoc(
      doc(db, "users", currentUser.uid, "closet", item.id)
    );
    if (item.image) {
      try {
        await deleteObject(ref(storage, item.image));
      } catch (e) {
        console.warn("Image already deleted / missing", e);
      }
    }
  };

  const toggleFavorite = async (item) => {
    if (!currentUser) return;
    const refDoc = doc(
      db,
      "users",
      currentUser.uid,
      "closet",
      item.id
    );
    await updateDoc(refDoc, { favorite: !item.favorite });
  };

  const markItemWorn = async (item) => {
    if (!currentUser) return;
    const refDoc = doc(
      db,
      "users",
      currentUser.uid,
      "closet",
      item.id
    );
    await updateDoc(refDoc, {
      timesWorn: (item.timesWorn || 0) + 1,
      lastWorn: Timestamp.now(),
    });
  };

  const requestDeleteCategory = (cat) => {
    setCategoryToDelete(cat);
    setShowDeleteCategoryModal(true);
  };

  // ---------------------------------------------------------
  //  CATEGORY MODALS (reuse your existing logic)
  // ---------------------------------------------------------

  const AddCategoryModal = () => (
    <Modal
      show={showAddCategoryModal}
      onHide={() => setShowAddCategoryModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>New Category</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* CATEGORY NAME */}
        <div className="mb-3">
          <label className="font-semibold">Category Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g., Dresses"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </div>

        {/* ICON TYPE */}
        <div className="mb-3">
          <label className="font-semibold block mb-2">Icon Type</label>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={newCategoryIconType === "emoji"}
                onChange={() => setNewCategoryIconType("emoji")}
              />
              Emoji
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={newCategoryIconType === "lucide"}
                onChange={() => setNewCategoryIconType("lucide")}
              />
              Icon
            </label>
          </div>
        </div>

        {/* EMOJI PICKER */}
        {newCategoryIconType === "emoji" && (
          <div className="mb-4">
            <label className="font-semibold block mb-1">Choose Emoji</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-2xl"
              placeholder="Tap to enter emoji"
              value={emojiInput}
              onChange={(e) => setEmojiInput(e.target.value)}
            />
          </div>
        )}

        {/* LUCIDE ICONS */}
        {newCategoryIconType === "lucide" && (
          <div className="mb-4">
            <label className="font-semibold block mb-2">Choose Icon</label>
            <div className="grid grid-cols-4 gap-3">
              {LUCIDE_ICON_OPTIONS.map((iconObj) => (
                <button
                  type="button"
                  key={iconObj.name}
                  onClick={() => setSelectedLucideIcon(iconObj.name)}
                  className={`border rounded-lg p-2 flex items-center justify-center transition ${
                    selectedLucideIcon === iconObj.name
                      ? "bg-thryftGreen text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {iconObj.icon}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* COLOR PICKER */}
        <div className="mb-3">
          <label className="font-semibold block mb-1">Color</label>

          <div className="flex gap-3 mt-2 flex-wrap">
            {COLOR_SWATCHES.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setNewCategoryColor(color)}
                className="w-8 h-8 rounded-full border"
                style={{
                  backgroundColor: color,
                  borderColor:
                    newCategoryColor === color ? "black" : "transparent",
                  borderWidth: newCategoryColor === color ? 2 : 1,
                }}
              />
            ))}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <input
              type="color"
              className="w-10 h-10 rounded"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
            />
            <span>{newCategoryColor}</span>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowAddCategoryModal(false)}
        >
          Cancel
        </Button>

        <Button
          variant="success"
          disabled={
            !newCategoryName.trim() ||
            (newCategoryIconType === "emoji" && !emojiInput.trim()) ||
            (newCategoryIconType === "lucide" && !selectedLucideIcon)
          }
          onClick={async () => {
            const icon =
              newCategoryIconType === "emoji" ? emojiInput : selectedLucideIcon;

            await addDoc(
              collection(db, "users", currentUser.uid, "customCategories"),
              {
                name: newCategoryName,
                color: newCategoryColor,
                iconType: newCategoryIconType,
                icon,
              }
            );

            setNewCategoryName("");
            setEmojiInput("");
            setSelectedLucideIcon("");
            setNewCategoryIconType("emoji");
            setShowAddCategoryModal(false);
          }}
        >
          Add Category
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const DeleteCategoryModal = () => (
    <Modal
      show={showDeleteCategoryModal}
      onHide={() => setShowDeleteCategoryModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Category</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {categoryToDelete && (
          <>
            <p className="mb-2">
              Category: <strong>{categoryToDelete.name}</strong>
            </p>
            <p>
              Contains{" "}
              <strong>
                {
                  items.filter(
                    (item) => item.category === categoryToDelete.name
                  ).length
                }
              </strong>{" "}
              items.
            </p>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowDeleteCategoryModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            setShowDeleteCategoryModal(false);
            setShowReassignModal(true);
          }}
        >
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const ReassignModal = () => (
    <Modal
      show={showReassignModal}
      onHide={() => setShowReassignModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Reassign Items</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-2">Reassign items from:</p>
        <p className="font-semibold mb-3">{categoryToDelete?.name}</p>

        <Form.Select
          value={reassignTargetCategory}
          onChange={(e) => setReassignTargetCategory(e.target.value)}
        >
          <option value="">Select new category</option>
          {categories
            .filter(
              (cat) =>
                cat.name !== "Saved Outfits" &&
                cat.name !== categoryToDelete?.name
            )
            .map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
        </Form.Select>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowReassignModal(false)}
        >
          Cancel
        </Button>

        <Button
          variant="danger"
          disabled={!reassignTargetCategory}
          onClick={async () => {
            const batch = writeBatch(db);

            items.forEach((item) => {
              if (item.category === categoryToDelete.name) {
                const refDoc = doc(
                  db,
                  "users",
                  currentUser.uid,
                  "closet",
                  item.id
                );
                batch.update(refDoc, {
                  category: reassignTargetCategory,
                });
              }
            });

            const catRef = doc(
              db,
              "users",
              currentUser.uid,
              "customCategories",
              categoryToDelete.id
            );

            batch.delete(catRef);

            await batch.commit();

            setShowReassignModal(false);
            setCategoryToDelete(null);
            setReassignTargetCategory("");
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // ---------------------------------------------------------
  //  RETURN — FULL UI
  // ---------------------------------------------------------

  return (
    <>
      <div className="closet-page pb-32">
        {/* TITLE */}
        <h1 className="closet-title text-3xl font-bold px-4 pt-6 text-gray-900 mb-2">
          My Closet
        </h1>
        <p className="closet-subtitle px-4 mb-4">
          Curate your wardrobe like a magazine spread.
        </p>

        {/* BUILD OUTFIT BUTTON */}
        <button
          onClick={() => navigate("/outfits")}
          className="closet-build-btn ml-4 px-4 py-2 bg-thryftGreen text-white rounded-lg shadow hover:scale-105 transition"
        >
          Build an Outfit
        </button>

        {/* STATS */}
        <ClosetStats stats={stats} />

        {/* SEARCH (not in Saved Outfits) */}
        {!showingOutfits && (
          <div className="px-4 mt-4">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full px-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-thryftGreen"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* CATEGORY + FILTER BAR */}
        <div className="section-divider">Categories</div>

        <CategoryBar
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          seasonFilter={seasonFilter}
          setSeasonFilter={setSeasonFilter}
          onAddCategory={() => setShowAddCategoryModal(true)}
          onRequestDeleteCategory={requestDeleteCategory}
        />

        {/* ===============================
            SAVED OUTFITS
        =============================== */}
        {showingOutfits && (
          <>
            <div className="px-4 mb-4 flex justify-between items-center">
              <div>
                <label className="font-semibold mr-2">Sort:</label>
                <select
                  className="border px-2 py-1 rounded"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value)}
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>A-Z</option>
                  <option>Z-A</option>
                </select>
              </div>

              <div>
                <label className="font-semibold mr-2">Tag:</label>
                <select
                  className="border px-2 py-1 rounded"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                >
                  <option>All</option>
                  {TAG_OPTIONS.map((tag) => (
                    <option key={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="section-divider">Saved Looks</div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
              {filteredOutfits.map((outfit) => (
                <motion.div
                  key={outfit.id}
                  layout
                  onClick={() => {
                    setSelectedOutfit(outfit);
                    setRenameValue(outfit.name || "");
                  }}
                  className="closet-outfit-card editorial-card bg-white rounded-xl shadow-md p-2 cursor-pointer hover:scale-[1.02] transition"
                >
                  <div className="rounded-lg overflow-hidden h-[180px] grid grid-rows-2 grid-cols-2 gap-1">
                    <img
                      src={outfit.previewItems[0]?.image}
                      className="col-span-2 row-span-1 object-cover w-full h-full"
                    />
                    <img
                      src={outfit.previewItems[1]?.image}
                      className="object-cover w-full h-full"
                    />
                    <div className="relative">
                      <img
                        src={outfit.previewItems[2]?.image}
                        className="object-cover w-full h-full"
                      />
                      {outfit.previewItems.length > 3 && (
                        <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-sm font-semibold rounded">
                          +{outfit.previewItems.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-center mt-2 font-medium">
                    {outfit.name || "Untitled Outfit"}
                  </p>

                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {outfit.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-200 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* ===============================
            RECENTLY WORN STRIP
        =============================== */}
        {!showingOutfits && recentlyWornItems.length > 0 && (
          <>
            <div className="section-divider">Recently Worn</div>
            <div className="px-4 mb-2 overflow-x-auto scrollbar-hide">
              <div className="flex gap-3">
                {recentlyWornItems.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-[120px] flex-shrink-0 editorial-card polaroid"
                  >
                    <img
                      src={item.image}
                      className="w-full h-[90px] object-cover rounded-lg"
                    />
                    <div className="polaroid-label text-xs mt-1">
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===============================
            CLOSET ITEMS
        =============================== */}
        <div className="section-divider">Your Wardrobe</div>

        {!showingOutfits && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onImageClick={() => setSelectedItem(item)}
                onDelete={() => handleDeleteItem(item)}
                onToggleFavorite={() => toggleFavorite(item)}
                onMarkWorn={() => markItemWorn(item)}
              />
            ))}
          </div>
        )}

        {/* ADD ITEM BUTTON */}
        {!showingOutfits && (
          <button
            type="button"
            onClick={() => setShowAddItemModal(true)}
            className="fixed bottom-[120px] right-6 bg-thryftGreen text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-4xl hover:scale-110 transition-all duration-200 z-[9999]"
          >
            +
          </button>
        )}

        {/* BACK TO TOP BUTTON */}
        <button
          type="button"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          className="fixed bottom-[120px] left-6 bg-gray-800 text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-xl hover:scale-110 transition z-[9999]"
        >
          ↑
        </button>
      </div>

      {/* OUTFIT DETAIL MODAL (unchanged, just reused) */}
      {selectedOutfit && (
        <Modal
          show={true}
          onHide={() => setSelectedOutfit(null)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Outfit</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Rename */}
            <div className="mb-3">
              <label className="font-semibold">Outfit Name</label>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
              <button
                className="mt-2 px-4 py-1 bg-thryftGreen text-white rounded"
                onClick={async () => {
                  const refDoc = doc(
                    db,
                    "users",
                    currentUser.uid,
                    "outfits",
                    selectedOutfit.id
                  );
                  await updateDoc(refDoc, { name: renameValue });
                }}
              >
                Save Name
              </button>
            </div>

            {/* TAGS */}
            <div className="mb-3">
              <label className="font-semibold">Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedOutfit.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={async () => {
                        const refDoc = doc(
                          db,
                          "users",
                          currentUser.uid,
                          "outfits",
                          selectedOutfit.id
                        );
                        await updateDoc(refDoc, {
                          tags: selectedOutfit.tags.filter((t) => t !== tag),
                        });
                      }}
                    >
                      <Trash size={14} />
                    </button>
                  </span>
                ))}
              </div>

              {/* ADD TAG */}
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={newTagValue}
                  onChange={(e) => setNewTagValue(e.target.value)}
                  className="border rounded px-3 py-1 flex-1"
                  placeholder="Add tag..."
                />
                <button
                  className="bg-thryftGreen text-white px-4 rounded"
                  onClick={async () => {
                    if (!newTagValue.trim()) return;

                    const newTags = [
                      ...(selectedOutfit.tags || []),
                      newTagValue,
                    ];

                    const refDoc = doc(
                      db,
                      "users",
                      currentUser.uid,
                      "outfits",
                      selectedOutfit.id
                    );

                    await updateDoc(refDoc, { tags: newTags });
                    setNewTagValue("");
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* DELETE OUTFIT */}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={async () => {
                await deleteDoc(
                  doc(
                    db,
                    "users",
                    currentUser.uid,
                    "outfits",
                    selectedOutfit.id
                  )
                );
                setSelectedOutfit(null);
              }}
            >
              Delete Outfit
            </button>
          </Modal.Body>
        </Modal>
      )}

      {/* CATEGORY + REASSIGN MODALS */}
      <AddCategoryModal />
      <DeleteCategoryModal />
      <ReassignModal />

      {/* ADD ITEM MODAL */}
      <Modal
        show={showAddItemModal}
        onHide={() => setShowAddItemModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newItem?.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="mt-3">Category</Form.Label>
              <Form.Select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
              >
                <option>Tops</option>
                <option>Bottoms</option>
                <option>Shoes</option>
                <option>Accessories</option>
                {customCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label className="mt-3">Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    image: e.target.files[0],
                  })
                }
              />
            </Form.Group>

            {newItem.image && (
              <img
                src={URL.createObjectURL(newItem.image)}
                className="mt-3 w-full h-48 object-cover rounded-lg"
              />
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowAddItemModal(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="success"
            disabled={!newItem.name || !newItem.image}
            onClick={handleAddItem}
          >
            Add Item
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
