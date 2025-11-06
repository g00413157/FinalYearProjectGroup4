import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function SettingsList() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear user session
    navigate('/AccountWrapper'); // redirect to log in page
  };

  return (
    <ListGroup className="settings-list p-3">
      <ListGroup.Item
        action
        className="text-danger"
        onClick={handleLogout}
      >
        Log Out
      </ListGroup.Item>
    </ListGroup>
  );
}

export default SettingsList;
