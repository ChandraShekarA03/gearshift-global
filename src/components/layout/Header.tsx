"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, LogOut, User, X, ChevronDown } from 'lucide-react';
import CartNavButton from '@/components/checkout/CartNavButton';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { useState } from 'react';

export default function Header() {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/parts', label: 'Parts' },
    { href: '/vendors', label: 'Vendors' },
    { href: '/garage', label: 'Garage' },
    { href: '/hub', label: 'DIY Hub' }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="max-width container-padding">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg group-hover:shadow-primary/25 transition-all duration-300 overflow-hidden">
                    <Image
                      src="/Logo.png"
                      alt="GearShift Global Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    GearShift
                  </h1>
                  <p className="text-xs text-primary font-medium">Global</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-surface/50 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 -translate-x-1/2"></span>
                </Link>
              ))}
              {user && (
                <Link
                  href="/profile"
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-surface/50 group"
                >
                  Profile
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 -translate-x-1/2"></span>
                </Link>
              )}
            </nav>

            {/* Search Bar - More Visible */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search parts, vehicles..."
                  className="w-full rounded-xl bg-surface/50 border border-border/50 px-10 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-surface transition-all duration-200"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Button for Mobile */}
              <button className="md:hidden p-2 rounded-lg hover:bg-surface/50 transition-colors">
                <Search className="h-5 w-5 text-muted-foreground" />
              </button>

              <CartNavButton />

              {user ? (
                <div className="relative">
                  {/* Desktop User Menu */}
                  <div className="hidden sm:flex items-center space-x-3">
                    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-surface/50 border border-border/50">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground max-w-32 truncate">
                        {user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <button
                      onClick={signOut}
                      className="p-2 rounded-lg hover:bg-surface/50 text-muted-foreground hover:text-foreground transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Mobile User Menu */}
                  <div className="sm:hidden flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-surface/50 flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hidden sm:inline-flex btn-primary text-sm px-4 py-2"
                >
                  Sign In
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-surface/50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Menu className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
              <div className="px-4 py-4 space-y-3">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search parts, vehicles..."
                    className="w-full rounded-lg bg-surface/50 border border-border/50 px-10 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface/50 rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  {user && (
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface/50 rounded-lg transition-colors"
                    >
                      Profile
                    </Link>
                  )}
                </nav>

                {/* Mobile User Actions */}
                <div className="border-t border-border/40 pt-3 space-y-2">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground truncate">
                          {user.email}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface/50 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full btn-primary text-sm py-2.5"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}