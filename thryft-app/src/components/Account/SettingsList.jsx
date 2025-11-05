import React from 'react';
import { ListGroup } from 'react-bootstrap';

function SettingsList() {
  return (
    <ListGroup>
      <ListGroup.Item action>Notifications</ListGroup.Item>
      <ListGroup.Item action>Privacy Settings</ListGroup.Item>
      <ListGroup.Item action className="text-danger">Log Out</ListGroup.Item>
    </ListGroup>
  );
}

export default SettingsList;
