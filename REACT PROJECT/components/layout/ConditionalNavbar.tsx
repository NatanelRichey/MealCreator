'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't show navbar on login page (root)
  if (pathname === '/') {
    return null;
  }
  
  return <Navbar />;
}

