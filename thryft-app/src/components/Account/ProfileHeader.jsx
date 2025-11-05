import React from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { FaPencilAlt } from 'react-icons/fa';

function ProfileHeader({ editMode, setEditMode }) {
    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    return (
        <div className="profile-header d-flex align-items-center justify-content-between mb-4 p-3">
            <div className="d-flex align-items-center">
                <BsPersonCircle size={64} className="me-3 text-secondary" />
                <div>
                    <h5 className="mb-1">Your Name</h5>
                    <p className="text-muted small mb-0">email@example.com</p>
                </div>
            </div>

            {/* Pencil Icon */}
            <div
                className={`edit-icon-circle ${editMode ? 'rotate-pencil' : ''}`}
                onClick={handleEditClick}
            >
                {/* Use color prop to dynamically change color */}
                <FaPencilAlt
                    size={16}
                    color={editMode ? '#f4a261' : 'white'}
                />
            </div>
        </div>
    );
}

export default ProfileHeader;
