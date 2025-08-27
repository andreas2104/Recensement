'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link
            href="/"
            className={`hover:text-gray-300 ${pathname === '/' ? 'font-bold' : ''}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/fokontany"
            className={`hover:text-gray-300 ${pathname === '/fokontany' ? 'font-bold' : ''}`}
          >
            Fokontany
          </Link>
        </li>
      </ul>
    </nav>
  );
}