import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

function AccountInfo({ editMode, user }) {
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Load data from Google user
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  return (
    <div className="account-info p-3">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!editMode}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editMode}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            disabled={!editMode}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nearest Charity Shop</Form.Label>
          <Form.Control
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={!editMode}
          />
        </Form.Group>
      </Form>
    </div>
  );
}

export default AccountInfo;
