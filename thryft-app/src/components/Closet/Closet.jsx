import React, { useState, useRef } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import "../../styles/Closet.css";

export default function Closet() {
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "Tops", image: "" });

  const categories = [
    {
      title: "Tops",
      items: [
        { name: "Denim Jacket", image: "https://via.placeholder.com/200" },
        { name: "White T-Shirt", image: "https://via.placeholder.com/200" },
        { name: "Hoodie", image: "https://via.placeholder.com/200" },
        { name: "Blouse", image: "https://via.placeholder.com/200" },
        { name: "Tank Top", image: "https://via.placeholder.com/200" },
      ],
    },
    {
      title: "Bottoms",
      items: [
        { name: "Jeans", image: "https://via.placeholder.com/200" },
        { name: "Skirt", image: "https://via.placeholder.com/200" },
        { name: "Joggers", image: "https://via.placeholder.com/200" },
        { name: "Shorts", image: "https://via.placeholder.com/200" },
        { name: "Trousers", image: "https://via.placeholder.com/200" },
      ],
    },
    {
      title: "Shoes",
      items: [
        { name: "Sneakers", image: "https://via.placeholder.com/200" },
        { name: "Boots", image: "https://via.placeholder.com/200" },
        { name: "Heels", image: "https://via.placeholder.com/200" },
        { name: "Sandals", image: "https://via.placeholder.com/200" },
        { name: "Loafers", image: "https://via.placeholder.com/200" },
      ],
    },
    {
      title: "Accessories",
      items: [
        { name: "Watch", image: "https://via.placeholder.com/200" },
        { name: "Hat", image: "https://via.placeholder.com/200" },
        { name: "Scarf", image: "https://via.placeholder.com/200" },
        { name: "Belt", image: "https://via.placeholder.com/200" },
        { name: "Sunglasses", image: "https://via.placeholder.com/200" },
      ],
    },
  ];

  const handleAddItem = (e) => {
    e.preventDefault();
    console.log("New item:", newItem);
    setShowModal(false);
    setNewItem({ name: "", category: "Tops", image: "" });
  };

  // Function to handle dragging
  const useDraggableScroll = (ref) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      ref.current.classList.add("active");
      startX = e.pageX - ref.current.offsetLeft;
      scrollLeft = ref.current.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      ref.current.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDown = false;
      ref.current.classList.remove("active");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - ref.current.offsetLeft;
      const walk = (x - startX) * 1.5; // scroll speed
      ref.current.scrollLeft = scrollLeft - walk;
    };

    return { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove };
  };

  return (
<>
    {/* Top Header */}
    <div className="closet-header">
      <h1>My Closet</h1>
    </div>
    <div className="closet-page container mt-4 mb-5">
      {categories.map((category, index) => {
        const scrollRef = useRef(null);
        const dragHandlers = useDraggableScroll(scrollRef);

        return (
          <div key={index} className="category-section mb-4">
            <h4 className="category-title">{category.title}</h4>
            <div
              className="scroll-container"
              ref={scrollRef}
              onMouseDown={dragHandlers.handleMouseDown}
              onMouseLeave={dragHandlers.handleMouseLeave}
              onMouseUp={dragHandlers.handleMouseUp}
              onMouseMove={dragHandlers.handleMouseMove}
            >
              {category.items.map((item, idx) => (
                <Card key={idx} className="closet-card">
                  <Card.Img variant="top" src={item.image} />
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

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
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
              </Form.Select>
            </Form.Group>

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
    </div>
  </>);
}
