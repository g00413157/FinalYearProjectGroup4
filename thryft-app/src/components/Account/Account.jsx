import React from 'react';
import ProfileHeader from './ProfileHeader';
import AccountOptions from './AccountOptions';
import SettingsList from './SettingsList';
import '../../styles/Account.css';

function Account() {
  return (
    <div className="account-page p-3">
      <ProfileHeader />
      <AccountOptions />
      <SettingsList />
    </div>
  );
}

export default Account;
