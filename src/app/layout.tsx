import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GearShift Global - Premium Automotive Parts",
  description: "Find guaranteed-fit automotive parts with AI-powered search. Global shipping, expert support, and eco-friendly options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Main Content */}
            <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-border bg-surface">
            <div className="max-width container-padding section-padding">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                      <span className="text-lg font-bold text-white">G</span>
                    </div>
                    <div>
                      <h3 className="font-bold">GearShift Global</h3>
                      <p className="text-sm text-muted-foreground">Premium Automotive Parts</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Revolutionizing automotive parts sourcing with guaranteed fitment and global delivery.
                  </p>
                </div>

                {/* Platform */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Platform</h4>
                  <div className="space-y-2">
                    <Link href="/parts" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Browse Parts
                    </Link>
                    <Link href="/garage" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      My Garage
                    </Link>
                    <Link href="/compatibility" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Compatibility
                    </Link>
                  </div>
                </div>

                {/* Support */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Support</h4>
                  <div className="space-y-2">
                    <Link href="/help" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Help Center
                    </Link>
                    <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Contact Us
                    </Link>
                    <Link href="/shipping" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Shipping Info
                    </Link>
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Company</h4>
                  <div className="space-y-2">
                    <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      About Us
                    </Link>
                    <Link href="/careers" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Careers
                    </Link>
                    <Link href="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Blog
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} GearShift Global. All rights reserved.
                  </p>
                  <div className="flex space-x-6 text-sm text-muted-foreground">
                    <Link href="/privacy" className="hover:text-foreground transition-colors">
                      Privacy
                    </Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">
                      Terms
                    </Link>
                    <Link href="/cookies" className="hover:text-foreground transition-colors">
                      Cookies
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}
