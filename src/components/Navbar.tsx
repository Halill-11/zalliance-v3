import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useAppStore } from '@/lib/store';
import { CartSheet } from '@/components/CartSheet';
export function Navbar() {
  const location = useLocation();
  const isAdmin = useAppStore((s) => s.isAdmin);
  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Collections', path: '/#collections' },
    { name: 'À Propos', path: '/#about' },
  ];
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md dark:bg-slate-950/90 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              {/*
                  LOGO CONFIGURATION:
                  Currently using an inline SVG for immediate visibility and performance.
                  To use a custom image file (PNG/JPG/SVG):
                  1. Comment out or remove the <svg> block below.
                  2. Uncomment the <img> tag below and update the 'src' attribute.
                  <img
                    src="/path/to/your/logo.png"
                    alt="ZALLIANCE"
                    className="h-10 w-auto object-contain"
                  />
              */}
              <svg
                viewBox="0 0 190 40"
                className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="ZALLIANCE Logo"
              >
                <text
                  x="2"
                  y="28"
                  className="fill-slate-900 dark:fill-white"
                  style={{
                    fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
                    fontWeight: 'bold',
                    letterSpacing: '0.05em',
                    fontSize: '26px'
                  }}
                >
                  ZALLIANCE
                </text>
                <rect
                  x="2"
                  y="34"
                  width="155"
                  height="2"
                  className="fill-amber-600"
                />
              </svg>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors dark:text-slate-300 dark:hover:text-amber-500 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-amber-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
              >
                Admin
              </Link>
            )}
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Cart Sheet Integration */}
            <CartSheet />
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left font-display text-xl font-bold">Menu</SheetTitle>
                    <SheetDescription className="text-left">
                      Navigation principale
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="text-lg font-medium text-slate-900 hover:text-amber-600 dark:text-slate-100"
                      >
                        {link.name}
                      </Link>
                    ))}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="text-lg font-medium text-amber-600"
                      >
                        Admin
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}