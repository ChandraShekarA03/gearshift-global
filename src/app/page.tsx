"use client";

import { Suspense } from 'react';
import AnimatedStats from '@/components/hero/AnimatedStats';
import EnhancedHeroSection from '@/components/hero/EnhancedHeroSection';
import FeatureShowcase from '@/components/hero/FeatureShowcase';
import ProductCarousel from '@/components/hero/ProductCarousel';
import TestimonialSlider from '@/components/hero/TestimonialSlider';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Zap,
  Globe,
  Shield,
  Award
} from 'lucide-react';

// Loading component for Sparks effect
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

// Final CTA Section Component
function FinalCTASection() {
  return (
    <section className="relative py-32 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
      <div className="max-width container-padding relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Sparkles Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 rounded-full bg-white/20 backdrop-blur-md px-6 py-3 text-sm"
          >
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-white font-medium">Ready to Transform Your Business?</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Join the Future of <br />
            <span className="text-yellow-200">Automotive Excellence</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Get started with the most advanced automotive parts platform today. 
            Join over 500,000 professionals who trust GearShift Global for their success.
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/parts">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(255, 255, 255, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary hover:bg-gray-100 font-bold text-lg px-10 py-4 rounded-xl flex items-center space-x-3 group transition-all duration-300 shadow-2xl"
              >
                <span>Start Shopping Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold text-lg px-10 py-4 rounded-xl flex items-center space-x-3 group transition-all duration-300"
              >
                <span>Contact Sales</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mt-12"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white/80">Free 30-Day Trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-white/80">Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-400" />
              <span className="text-white/80">Award Winning Platform</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Enhanced Hero Section */}
      <Suspense fallback={<LoadingFallback />}>
        <EnhancedHeroSection />
      </Suspense>

      {/* Animated Statistics Section */}
      <section id="stats-section">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatedStats />
        </Suspense>
      </section>

      {/* Product Carousel */}
      <Suspense fallback={<LoadingFallback />}>
        <ProductCarousel />
      </Suspense>

      {/* Feature Showcase */}
      <Suspense fallback={<LoadingFallback />}>
        <FeatureShowcase />
      </Suspense>

      {/* Testimonial Slider */}
      <Suspense fallback={<LoadingFallback />}>
        <TestimonialSlider />
      </Suspense>

      {/* Final CTA Section */}
      <FinalCTASection />
    </div>
  );
}