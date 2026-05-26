'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Beranda', icon: 'las la-home' },
    { href: '/scanner', label: 'Scanner', icon: 'las la-camera' },
    { href: '/edukasi', label: 'Dermapedia', icon: 'las la-book-medical' },
    { href: '/tracker', label: 'Tracker', icon: 'las la-heartbeat' },
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`bottom-nav-item ${pathname === item.href ? 'active' : ''}`}
        >
          <i className={item.icon} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
