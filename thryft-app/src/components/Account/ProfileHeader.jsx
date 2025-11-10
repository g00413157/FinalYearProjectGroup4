import React, { useContext } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { FaPencilAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

function ProfileHeader({ editMode, setEditMode }) {
  const { user } = useContext(AuthContext);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="profile-header d-flex align-items-center justify-content-between mb-4 p-3">
      <div className="d-flex align-items-center">
        {user?.picture ? (
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle me-3"
            style={{ width: 64, height: 64, objectFit: 'cover' }}
          />
        ) : (
          <BsPersonCircle size={64} className="me-3 text-secondary" />
        )}

        <div>
          <h5 className="mb-1">{user?.name || 'Your Name'}</h5>
          <p className="text-muted small mb-0">{user?.email || 'email@example.com'}</p>
        </div>
      </div>

      {/* Pencil Icon */}
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
