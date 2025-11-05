import React, { useState } from 'react';
import { BsPersonCircle } from 'react-icons/bs';

function ProfileHeader() {
  // state for when Google OAuth is connected
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  return (
    <div className="profile-header d-flex align-items-center mb-4">
      <BsPersonCircle size={64} className="me-3 text-secondary" />
      <div>
        <h5 className="mb-1">{userName || "Your Name"}</h5>
        <p className="text-muted small mb-0">{userEmail || "email@example.com"}</p>
      </div>
    </div>
  );
}

export default ProfileHeader;
