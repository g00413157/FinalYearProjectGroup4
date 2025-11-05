import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Account from './Account';
import Login from './LogIn';

export default function AccountWrapper() {
  const { user } = useContext(AuthContext);

  return user ? <Account /> : <Login />;
}
