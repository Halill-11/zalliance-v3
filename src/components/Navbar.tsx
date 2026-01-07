import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAppStore } from '@/lib/store';
export function Navbar() {
  const location = useLocation();
  const isAdmin = useAppStore((s) => s.isAdmin);
  const cartCount = useAppStore((s) => s.cartCount);
  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Collections', path: '/#collections' },
    { name: 'À Propos', path: '/#about' },
  ];
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                ZALLIANCE
              </span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors dark:text-slate-300 dark:hover:text-amber-500"
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" aria-label="Panier">
              <ShoppingBag className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Button>
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
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