'use client';

import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';

export default function ProfileDropdown({ onClose }) {
  return (
    <div className="profile-dropdown" role="menu" aria-label="Profile menu">
      <Link
        href="/profile"
        className="profile-dropdown-item"
        onClick={onClose}
        role="menuitem"
        id="menu-edit-profile"
      >
        <i className="las la-user-edit" />
        Edit Profil
      </Link>

      <Link
        href="/riwayat"
        className="profile-dropdown-item"
        onClick={onClose}
        role="menuitem"
        id="menu-scan-history"
      >
        <i className="las la-history" />
        Riwayat Scan
      </Link>

      <div className="profile-dropdown-divider" />

      <SignOutButton>
        <button
          className="profile-dropdown-item profile-dropdown-item--danger"
          role="menuitem"
          id="menu-logout"
          onClick={onClose}
        >
          <i className="las la-sign-out-alt" />
          Keluar
        </button>
      </SignOutButton>
    </div>
  );
}
