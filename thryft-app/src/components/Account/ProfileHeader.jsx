import React, { useEffect, useState } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { FaPencilAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

function ProfileHeader({ editMode, setEditMode }) {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);

  // Fetch Firestore user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfileData(snap.data());
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="profile-header d-flex align-items-center justify-content-between mb-4 p-3">
      <div className="d-flex align-items-center">

        {/* Profile Photo */}
        {currentUser?.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="rounded-circle me-3"
            style={{ width: 64, height: 64, objectFit: 'cover' }}
          />
        ) : (
          <BsPersonCircle size={64} className="me-3 text-secondary" />
        )}

        {/* Name + Email */}
        <div>
          <h5 className="mb-1">
            {profileData?.name || currentUser?.displayName || "Your Name"}
          </h5>

          <p className="text-muted small mb-0">
            {currentUser?.email || "email@example.com"}
          </p>
        </div>
      </div>

      {/* Edit Icon */}
      <div
        className={`edit-icon-circle ${editMode ? 'rotate-pencil' : ''}`}
        onClick={handleEditClick}
      >
        <FaPencilAlt size={16} color={editMode ? '#ffc107' : 'white'} />
      </div>
    </div>
  );
}

export default ProfileHeader;
