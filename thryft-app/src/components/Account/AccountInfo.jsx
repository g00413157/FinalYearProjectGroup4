import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

function AccountInfo({ editMode }) {
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="account-info p-3">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your Name"
            disabled={!editMode}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="email@example.com"
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
