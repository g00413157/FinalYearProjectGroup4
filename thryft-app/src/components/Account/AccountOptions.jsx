import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from 'react-bootstrap';

function AccountOptions() {
    return (
        <div className="account-options mb-4">
          <Button variant="outline-primary" className="w-100 mb-2">Edit Profile</Button>
          <Button variant="outline-primary" className="w-100 mb-2">Payment Methods</Button>
          <Button variant="outline-primary" className="w-100 mb-2">Order History</Button>
          <Button variant="light" className="w-100 d-flex align-items-center justify-content-center mt-3">
            <FcGoogle size={20} className="me-2" />
            Connect with Google
          </Button>
        </div>
      );
}

export default AccountOptions;
