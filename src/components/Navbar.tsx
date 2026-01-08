import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { CartSheet } from '@/components/CartSheet';
export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Collections', path: '/#collections' },
    { name: 'À Propos', path: '/#about' },
  ];
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const isHome = location.pathname === '/';
    if (path === '/') {
      if (isHome) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
    } else if (path.startsWith('/#')) {
      const targetId = path.substring(2); // remove '/#'
      if (isHome) {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = targetId;
        }
      } else {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md dark:bg-slate-950/90 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a 
              href="/" 
              onClick={(e) => handleNavClick(e, '/')}
              className="flex items-center gap-2 group"
            >
              <img 
                src="https://placehold.co/180x60/transparent/0F172A?text=ZALLIANCE" 
                alt="ZALLIANCE" 
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors dark:text-slate-300 dark:hover:text-amber-500 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-amber-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Cart Sheet Integration */}
            <CartSheet />
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
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
                      <a
                        key={link.name}
                        href={link.path}
                        onClick={(e) => handleNavClick(e, link.path)}
                        className="text-lg font-medium text-slate-900 hover:text-amber-600 dark:text-slate-100 cursor-pointer"
                      >
                        {link.name}
                      </a>
                    ))}
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