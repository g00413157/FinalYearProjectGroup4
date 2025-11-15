import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import "../../styles/Closet.css";
import { db, storage } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useAuth } from "../../context/AuthContext";

export default function Closet() {
  const { currentUser } = useAuth();

  // --------------------------------------------
  // STATE
  // --------------------------------------------
  const [showModal, setShowModal] = useState(false);

  const [categories, setCategories] = useState([
    "Accessories",
    "Bottoms",
    "Shoes",
    "Tops",
  ]);

  const [customCategoryInput, setCustomCategoryInput] = useState("");

  const [items, setItems] = useState([]);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "Tops",
    image: null,
  });

  // Each category gets a ref stored here
  const scrollRefs = useRef({});

  // --------------------------------------------
  // REAL-TIME FETCH USER'S CLOSET
  // --------------------------------------------
  useEffect(() => {
    if (!currentUser) return;

    const closetRef = collection(db, "users", currentUser.uid, "closet");

    const unsubscribe = onSnapshot(closetRef, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setItems(data);

      // Build dynamic categories (default + new)
      const allCats = Array.from(
        new Set([...categories, ...data.map((i) => i.category)])
      ).sort();

      setCategories(allCats);

      // Ensure each category has a scrollRef
      allCats.forEach((cat) => {
        if (!scrollRefs.current[cat]) {
          scrollRefs.current[cat] = React.createRef();
        }
      });
    });

    return unsubscribe;
  }, [currentUser]);

  // --------------------------------------------
  // DRAG SCROLL HANDLERS  (SAFE OUTSIDE LOOP)
  // --------------------------------------------
  const createDragHandlers = (ref) => {
    let isDown = false;
    let startX, scrollLeft;

    const onMouseDown = (e) => {
      isDown = true;
      ref.current.classList.add("active");
      startX = e.pageX - ref.current.offsetLeft;
      scrollLeft = ref.current.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      ref.current.classList.remove("active");
    };

    const onMouseUp = () => {
      isDown = false;
      ref.current.classList.remove("active");
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - ref.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      ref.current.scrollLeft = scrollLeft - walk;
    };

    return { onMouseDown, onMouseLeave, onMouseUp, onMouseMove };
  };

  // --------------------------------------------
  // DELETE ITEM
  // --------------------------------------------
  const handleDeleteItem = async (item) => {
    if (!currentUser) return;

    if (!window.confirm("Delete this item?")) return;

    await deleteDoc(doc(db, "users", currentUser.uid, "closet", item.id));

    if (item.storagePath) {
      const imageRef = ref(storage, item.storagePath);
      await deleteObject(imageRef);
    }
  };

  // --------------------------------------------
  // ADD ITEM
  // --------------------------------------------
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    let imageUrl = "";
    let storagePath = "";

    if (newItem.image instanceof File) {
      const path = `users/${currentUser.uid}/closet/${Date.now()}_${newItem.image.name}`;
      const storageRef = ref(storage, path);

      await uploadBytes(storageRef, newItem.image);
      imageUrl = await getDownloadURL(storageRef);
      storagePath = path;
    }

    await addDoc(collection(db, "users", currentUser.uid, "closet"), {
      name: newItem.name,
      category: newItem.category,
      imageUrl,
      storagePath,
      createdAt: Date.now(),
    });

    setShowModal(false);
    setNewItem({ name: "", category: "Tops", image: null });
    setCustomCategoryInput("");
  };

  // --------------------------------------------
  // ADD NEW CATEGORY
  // --------------------------------------------
  const handleAddCategory = () => {
    if (!customCategoryInput.trim()) return;
    if (categories.includes(customCategoryInput)) return;

    const updated = [...categories, customCategoryInput].sort();
    setCategories(updated);

    // set new item to this category
    setNewItem((prev) => ({
      ...prev,
      category: customCategoryInput,
    }));

    setCustomCategoryInput("");

    // create scroll ref for this category
    scrollRefs.current[customCategoryInput] = React.createRef();
  };

  // --------------------------------------------
  // UI RENDER
  // --------------------------------------------
  return (
    <>
      <div className="closet-appbar">
        <h1 className="closet-appbar-title">My Closet</h1>
      </div>


      <div className="closet-page container mt-4 mb-5">

        {categories.map((category, index) => {
          const categoryItems = items.filter(
            (item) => item.category === category
          );

          if (categoryItems.length === 0) return null;

          const ref = scrollRefs.current[category];
          const drag = createDragHandlers(ref);

          return (
            <div key={category} className="category-section mb-4">

              <h4 className="category-title">{category}</h4>

              <div
                className="scroll-container"
                ref={ref}
                onMouseDown={drag.onMouseDown}
                onMouseLeave={drag.onMouseLeave}
                onMouseUp={drag.onMouseUp}
                onMouseMove={drag.onMouseMove}
              >
                {categoryItems.map((item) => (
                  <Card key={item.id} className="closet-card">

                    <div
                      className="delete-x"
                      onClick={() => handleDeleteItem(item)}
                    >
                      ×
                    </div>

                    <Card.Img
                      variant="top"
                      src={item.imageUrl || "https://via.placeholder.com/200"}
                      className="closet-card-img"
                    />

                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                    </Card.Body>

                  </Card>
                ))}
              </div>

              {index !== categories.length - 1 && (
                <div className="divider-line"></div>
              )}
            </div>
          );
        })}

        {/* Add Item Button */}
        <div className="add-item-container">
          <Button
            variant="dark"
            className="add-item-btn"
            onClick={() => setShowModal(true)}
          >
            + Add New Item
          </Button>
        </div>

        {/* Add Item Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Closet Item</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleAddItem}>

              {/* ADD NEW CATEGORY — NOW AT TOP */}
              <div className="custom-category-box mb-3">
                <Form.Label>Add New Category</Form.Label>

                <div className="custom-cat-row">
                  <Form.Control
                    type="text"
                    placeholder="New category"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                  />
                  <Button variant="dark" onClick={handleAddCategory}>
                    Add
                  </Button>
                </div>
              </div>

              {/* ITEM NAME */}
              <Form.Group className="mb-3">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter item name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                />
              </Form.Group>

              {/* ITEM CATEGORY DROPDOWN */}
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* IMAGE UPLOAD */}
              <Form.Group className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewItem({ ...newItem, image: e.target.files[0] })
                  }
                />
              </Form.Group>

              {/* BUTTONS */}
              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="dark" className="ms-2">
                  Add Item
                </Button>
              </div>

            </Form>
          </Modal.Body>
        </Modal>


      </div >
    </>
  );
}
