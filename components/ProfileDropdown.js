'use client';

import { useState } from 'react';
import { SignOutButton } from '@clerk/nextjs';
import ProfileModal from './ProfileModal';
import ScanHistoryModal from './ScanHistoryModal';

export default function ProfileDropdown({ onClose }) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  return (
    <>
      <div className="profile-dropdown" role="menu" aria-label="Profile menu">
        <button
          className="profile-dropdown-item"
          onClick={() => {
            setShowProfileModal(true);
            onClose();
          }}
          role="menuitem"
          id="menu-edit-profile"
        >
          <i className="las la-user-edit" />
          Edit Profil
        </button>

        <button
          className="profile-dropdown-item"
          onClick={() => {
            setShowHistoryModal(true);
            onClose();
          }}
          role="menuitem"
          id="menu-scan-history"
        >
          <i className="las la-history" />
          Riwayat Scan
        </button>

        <div className="profile-dropdown-divider" />

        <SignOutButton>
          <button
            className="profile-dropdown-item profile-dropdown-item--danger"
            role="menuitem"
            id="menu-logout"
          >
            <i className="las la-sign-out-alt" />
            Keluar
          </button>
        </SignOutButton>
      </div>

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}

      {showHistoryModal && (
        <ScanHistoryModal onClose={() => setShowHistoryModal(false)} />
      )}
    </>
  );
}
