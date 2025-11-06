import React, { useState, useContext } from 'react';
import ProfileHeader from './ProfileHeader';
import AccountInfo from './AccountInfo';
import { Button } from 'react-bootstrap';
import '../../styles/Account.css';
import SettingsList from './SettingsList';
import { AuthContext } from '../../context/AuthContext';

export default function Account() {
  const [editMode, setEditMode] = useState(false);
  const { user } = useContext(AuthContext); // ✅ get user from context

  const handleSave = () => {
    alert('Information saved!');
    setEditMode(false);
  };

  return (
    <div className="account-page p-3 pb-5">
      <ProfileHeader
        editMode={editMode}
        setEditMode={setEditMode}
        user={user} // ✅ pass user down
      />

      <AccountInfo editMode={editMode} user={user} /> {/* ✅ pass user */}

      {editMode && (
        <div className="save-btn-container">
          <Button variant="dark" size="lg" onClick={handleSave}>
            Save Information
          </Button>
        </div>
      )}

      <SettingsList />
    </div>
  );
}
