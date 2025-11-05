import React, { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import AccountInfo from './AccountInfo';
import { Button } from 'react-bootstrap';
import '../../styles/Account.css';

function Account() {
  const [editMode, setEditMode] = useState(false);

  const handleSave = () => {
    // TODO: Save logic
    alert('Information saved!');
    setEditMode(false);
  };

  return (
    <div className="account-page p-3 pb-5">
      <ProfileHeader editMode={editMode} setEditMode={setEditMode} />
      <AccountInfo editMode={editMode} />

      {editMode && (
        <div className="save-btn-container">
          <Button
            variant="dark"
            size="lg"
            onClick={handleSave}
          >
            Save Information
          </Button>
        </div>
      )}
    </div>
  );
}

export default Account;
