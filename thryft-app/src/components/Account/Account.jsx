import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import AccountInfo from "./AccountInfo";
import { Button, ListGroup } from "react-bootstrap";
import "../../styles/Account.css";
import SettingsList from "./SettingsList";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Account() {
  const [editMode, setEditMode] = useState(false);
  const { currentUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: "",
    location: "",
  });

  const handleSave = async () => {
    if (!currentUser) return;

    const ref = doc(db, "users", currentUser.uid);

    await setDoc(
      ref,
      {
        name: profileData.name,
        location: profileData.location,
      },
      { merge: true }
    );

    alert("Information saved!");
    setEditMode(false);
  };

  return (
    <div className="account-page">

      {/* NEW WRAPPER TO FORCE VERTICAL LAYOUT */}
      <div className="account-wrapper">

        {/* Profile section */}
        <ProfileHeader
          editMode={editMode}
          setEditMode={setEditMode}
        />

        {/* Info form */}
        <AccountInfo
          editMode={editMode}
          user={currentUser}
          setProfileData={setProfileData}
          profileData={profileData}
        />

        {/* Save button */}
        {editMode && (
          <ListGroup className="settings-list p-3">
            <ListGroup.Item
              action
              className="save-list-item"
              onClick={handleSave}
            >
              Save Changes
            </ListGroup.Item>
          </ListGroup>
        )}

        {/* Log Out */}
        <SettingsList />

      </div>
    </div>
  );
}
