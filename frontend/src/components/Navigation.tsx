'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/songs', label: 'Canciones', icon: '🎵' },
    { href: '/chat', label: 'Chat', icon: '💬' },
    { href: '/profile', label: 'Perfil', icon: '👤' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      
    </nav>
  );
}
