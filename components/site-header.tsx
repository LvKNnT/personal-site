'use client';

import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';

const links = [
  { href: '/', label: 'Profile' },
  { href: '/work', label: 'Work' },
  { href: '/posts', label: 'Posts' },
];

export function SiteHeader() {
  const pathname = usePathname();

  function toggleTheme() {
    const nextDark = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = nextDark ? 'dark' : 'light';
    window.localStorage.setItem('theme', nextDark ? 'dark' : 'light');
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="home-mark" href="/" aria-label="Home">
          <img src="/avatar.jpg" alt="" />
        </a>
        <nav aria-label="Primary navigation">
          {links.map((link) => (
            <a className={pathname === link.href ? 'active' : ''} href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <button className="theme-button" type="button" onClick={toggleTheme} aria-label="Toggle color theme">
          <span className="theme-icon theme-icon-light"><Sun size={18} /></span>
          <span className="theme-icon theme-icon-dark"><Moon size={18} /></span>
        </button>
      </div>
    </header>
  );
}
