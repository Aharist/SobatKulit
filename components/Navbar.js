'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, useUser, SignOutButton } from '@clerk/nextjs';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: 'Beranda', icon: 'las la-home' },
    { href: '/scanner', label: 'Scanner', icon: 'las la-camera' },
    { href: '/edukasi', label: 'Dermapedia', icon: 'las la-book-medical' },
    { href: '/tracker', label: 'Tracker', icon: 'las la-heartbeat' },
  ];

  const displayName = user?.emailAddresses?.[0]?.emailAddress || user?.phoneNumbers?.[0]?.phoneNumber || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link href="/" className="navbar-brand">
        <img
          src="/assets/logo.png"
          alt="SobatKulit Logo"
          style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
        />
        Sobat<span>Kulit</span>
      </Link>

      <ul className="navbar-links">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="navbar-right">
        {!mounted ? (
          <div style={{ width: '80px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner spinner-sm" />
          </div>
        ) : !isLoaded ? (
          <div style={{ width: '80px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner spinner-sm" />
          </div>
        ) : !isSignedIn ? (
          <Link href="/sign-in" className="btn btn-ghost" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>
            MASUK
          </Link>
        ) : (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              className="profile-trigger"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              id="profile-menu-trigger"
            >
              <span className="profile-avatar">{initials}</span>
              <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </span>
              <i className={`las la-angle-${dropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '0.75rem' }} />
            </button>

            {dropdownOpen && (
              <ProfileDropdown onClose={() => setDropdownOpen(false)} />
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
