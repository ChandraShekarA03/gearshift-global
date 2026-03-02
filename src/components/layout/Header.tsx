"use client";

import Link from 'next/link';
import { Search, Menu, LogOut, User } from 'lucide-react';
import CartNavButton from '@/components/checkout/CartNavButton';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { useState } from 'react';

export default function Header() {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-width container-padding">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div>
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-lg font-bold text-white">G</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold">GearShift</h1>
                  <p className="text-xs text-muted-foreground">Global</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { href: '/parts', label: 'Parts' },
                { href: '/garage', label: 'Garage' },
                { href: '/hub', label: 'DIY Hub' }
              ].map((item, i) => (
                <div key={item.href}>
                  <Link href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </div>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-sm mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search parts..."
                  className="w-full rounded-lg bg-surface px-10 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <CartNavButton />
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:flex items-center space-x-2 text-sm">
                    <User size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{user.email}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="hidden sm:inline-flex items-center space-x-2 btn-secondary text-sm"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                  <button className="sm:hidden">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hidden sm:inline-flex btn-primary text-sm"
                >
                  Sign In
                </button>
              )}
              <button className="md:hidden">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}