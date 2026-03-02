import Link from 'next/link';
import { Shield, Truck, Award, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-background via-background to-surface"
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div
          className="absolute top-0 right-0 -translate-y-12 translate-x-12"
        >
          <div className="w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        </div>
        <div
          className="absolute bottom-0 left-0 translate-y-12 -translate-x-12"
        >
          <div className="w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="max-width container-padding section-padding">
          <div
            className="text-center space-y-8"
          >
            {/* Badge */}
            <div
              className="inline-flex items-center space-x-2 rounded-full bg-surface px-4 py-2 text-sm"
            >
              <Star className="h-4 w-4 text-accent fill-current" />
              <span className="text-muted-foreground">#1 Automotive Parts Platform</span>
            </div>

            {/* Title */}
            <div
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Find the <span className="text-gradient">Perfect Part</span>
                <br />
                <span className="text-foreground">Every Time.</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                AI-powered search finds guaranteed-fit parts. Global shipping, expert support, eco-friendly options.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/parts" className="btn-primary text-lg px-8 py-4">
                <ArrowRight className="inline h-5 w-5 mr-2" />
                Browse Parts
              </Link>

              <button className="glass text-lg px-8 py-4 hover:glass-hover transition-all">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
              <div
                className="text-center"
              >
                <div className="text-3xl font-bold text-accent">2.4M+</div>
                <div className="text-sm text-muted-foreground">Verified Parts</div>
              </div>

              <div
                className="text-center"
              >
                <div className="text-3xl font-bold text-accent">99.8%</div>
                <div className="text-sm text-muted-foreground">Fit Accuracy</div>
              </div>

              <div
                className="text-center"
              >
                <div className="text-3xl font-bold text-accent">150+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>

              <div
                className="text-center"
              >
                <div className="text-3xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="section-padding"
      >
        <div className="max-width container-padding">
          <div
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient">GearShift</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of automotive parts shopping with our cutting-edge platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="glass p-8 text-center hover:glass-hover transition-all"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Assured</h3>
              <p className="text-muted-foreground">
                Every part is inspected and certified. We partner with trusted manufacturers and offer warranties.
              </p>
            </div>

            <div
              className="glass p-8 text-center hover:glass-hover transition-all"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Global Shipping</h3>
              <p className="text-muted-foreground">
                Fast, reliable delivery worldwide. Free shipping on orders over $99. Track your package in real-time.
              </p>
            </div>

            <div
              className="glass p-8 text-center hover:glass-hover transition-all"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Support</h3>
              <p className="text-muted-foreground">
                Our certified technicians are available 24/7. Get installation guides, fitment advice, and technical support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section
        className="bg-surface section-padding"
      >
        <div className="max-width container-padding">
          <div
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you need from our comprehensive catalog of automotive parts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 hover:from-primary/30 hover:to-accent/30 transition-all cursor-pointer"
            >
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-2">Engine Parts</h3>
                <p className="text-sm text-muted-foreground mb-4">High-performance engine components</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-accent">500+</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-muted-foreground">Parts</div>
                    <div className="flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 hover:from-primary/30 hover:to-accent/30 transition-all cursor-pointer"
            >
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-2">Brake Systems</h3>
                <p className="text-sm text-muted-foreground mb-4">Premium braking solutions</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-accent">300+</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-muted-foreground">Parts</div>
                    <div className="flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 hover:from-primary/30 hover:to-accent/30 transition-all cursor-pointer"
            >
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-2">Suspension</h3>
                <p className="text-sm text-muted-foreground mb-4">Ride comfort and handling</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-accent">250+</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-muted-foreground">Parts</div>
                    <div className="flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 hover:from-primary/30 hover:to-accent/30 transition-all cursor-pointer"
            >
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-2">Electrical</h3>
                <p className="text-sm text-muted-foreground mb-4">Lighting and electronics</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-accent">400+</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-muted-foreground">Parts</div>
                    <div className="flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="section-padding"
      >
        <div className="max-width container-padding">
          <div
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Mechanics Worldwide</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our customers say about their experience with GearShift Global.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="glass p-6"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-accent">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
              <p className="text-muted-foreground mb-6">GearShift made finding the right parts for my customer's BMW incredibly easy. The fitment guarantee gave me peace of mind.</p>
              <div>
                <div className="font-semibold">Mike Johnson</div>
                <div className="text-sm text-muted-foreground">Master Technician</div>
                <div className="text-xs text-primary">BMW Specialist</div>
              </div>
            </div>

            <div
              className="glass p-6"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-accent">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
              <p className="text-muted-foreground mb-6">The international shipping is a game-changer. I can now source parts for any vehicle, anywhere in the world.</p>
              <div>
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-sm text-muted-foreground">Auto Shop Owner</div>
                <div className="text-xs text-primary">Vancouver, Canada</div>
              </div>
            </div>

            <div
              className="glass p-6"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-accent">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
              <p className="text-muted-foreground mb-6">Quality parts at competitive prices with excellent customer service. GearShift is my go-to for all automotive needs.</p>
              <div>
                <div className="font-semibold">Carlos Rodriguez</div>
                <div className="text-sm text-muted-foreground">Fleet Manager</div>
                <div className="text-xs text-primary">Mexico City</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="bg-primary text-white section-padding"
      >
        <div className="max-width container-padding text-center space-y-8">
          <div
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Find Your Perfect Part?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of mechanics and auto enthusiasts who trust GearShift Global for their automotive parts needs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/parts" className="glass px-8 py-4 rounded-lg font-medium hover:glass-hover transition-all block">
              Start Shopping
            </Link>
            <Link href="/contact" className="glass px-8 py-4 rounded-lg font-medium hover:glass-hover transition-all block">
              Contact Sales
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 pt-8 text-sm opacity-75">
            <div
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Free Shipping Over $99</span>
            </div>
            <div
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>30-Day Returns</span>
            </div>
            <div
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Expert Support</span>
            </div>
            <div
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Quality Guarantee</span>
            </div>
            <div
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Expert Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}