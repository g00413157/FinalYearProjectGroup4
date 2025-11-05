import React from 'react';
import { ListGroup } from 'react-bootstrap';

function SettingsList() {
  return (
    <ListGroup className="settings-list p-3">
      <ListGroup.Item action>Notifications</ListGroup.Item>
      <ListGroup.Item action>Privacy Settings</ListGroup.Item>
      <ListGroup.Item action className="text-danger">Log Out</ListGroup.Item>
    </ListGroup>
  );
}

export default SettingsList;
