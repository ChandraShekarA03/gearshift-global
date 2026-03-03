"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, Star, Zap, Globe, ChevronDown } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';
import ParticleBackground from './ParticleBackground';

const typewriterTexts = [
    "Perfect Part",
    "Right Solution", 
    "Best Quality",
    "Smart Choice"
];

function TypewriterEffect() {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        const currentText = typewriterTexts[currentTextIndex];
        
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (currentCharIndex < currentText.length) {
                    setDisplayText(prev => prev + currentText[currentCharIndex]);
                    setCurrentCharIndex(prev => prev + 1);
                } else {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (currentCharIndex > 0) {
                    setDisplayText(prev => prev.slice(0, -1));
                    setCurrentCharIndex(prev => prev - 1);
                } else {
                    setIsDeleting(false);
                    setCurrentTextIndex(prev => (prev + 1) % typewriterTexts.length);
                }
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [currentTextIndex, currentCharIndex, isDeleting]);

    return (
        <span className="text-gradient">
            {displayText}
            <span className="animate-pulse">|</span>
        </span>
    );
}

function FloatingElements() {
    const float1 = useSpring({
        from: { transform: 'translateY(0px) rotate(0deg)' },
        to: async (next) => {
            while (true) {
                await next({ transform: 'translateY(-20px) rotate(180deg)' });
                await next({ transform: 'translateY(0px) rotate(360deg)' });
            }
        },
        config: { duration: 4000 },
    });

    const float2 = useSpring({
        from: { transform: 'translateY(0px) rotate(0deg)' },
        to: async (next) => {
            while (true) {
                await next({ transform: 'translateY(-15px) rotate(-180deg)' });
                await next({ transform: 'translateY(0px) rotate(-360deg)' });
            }
        },
        config: { duration: 6000 },
    });

    const float3 = useSpring({
        from: { transform: 'translateY(0px) rotate(0deg)' },
        to: async (next) => {
            while (true) {
                await next({ transform: 'translateY(-25px) rotate(90deg)' });
                await next({ transform: 'translateY(0px) rotate(180deg)' });
            }
        },
        config: { duration: 5000 },
    });

    return (
        <>
            <animated.div 
                style={float1}
                className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-sm"
            />
            <animated.div 
                style={float2}
                className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-sm"
            />
            <animated.div 
                style={float3}
                className="absolute top-1/3 left-1/4 w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-sm"
            />
        </>
    );
}

export default function EnhancedHeroSection() {
    const scrollToStats = () => {
        const statsSection = document.querySelector('#stats-section');
        if (statsSection) {
            statsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-screen bg-gradient-to-br from-background via-surface to-background overflow-hidden flex items-center">
            {/* Interactive Particle Background */}
            <div className="absolute inset-0 z-0">
                <ParticleBackground />
            </div>

            {/* Floating Elements */}
            <FloatingElements />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] z-0" />
            
            {/* Gradient Overlays */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 z-0">
                <div className="w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            </div>
            <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 z-0">
                <div className="w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
            </div>

            <div className="max-width container-padding relative z-10">
                <div className="flex flex-col items-center justify-center min-h-screen py-20 text-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: -60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="space-y-8 max-w-4xl"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-flex items-center space-x-3 rounded-full bg-surface px-6 py-3 border border-primary/20"
                        >
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                                <Star className="h-4 w-4 text-accent fill-current" />
                                <span className="text-sm font-medium text-primary">#1 Automotive Platform</span>
                            </div>
                        </motion.div>

                        {/* Main Title with Typewriter Effect */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="space-y-4"
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                                Find the <br />
                                <TypewriterEffect />
                                <br />
                                <span className="text-foreground">Every Time.</span>
                            </h1>

                            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                                AI-powered search finds guaranteed-fit parts with 99.8% accuracy. 
                                <span className="text-primary font-medium"> Global shipping, expert support, eco-friendly solutions.</span>
                            </p>
                        </motion.div>

                        {/* Interactive Stats Mini Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="grid grid-cols-3 gap-6"
                        >
                            <div className="text-center glass p-4 rounded-xl">
                                <div className="text-2xl font-bold text-primary">2.4M+</div>
                                <div className="text-xs text-muted-foreground">Parts</div>
                            </div>
                            <div className="text-center glass p-4 rounded-xl">
                                <div className="text-2xl font-bold text-primary">180+</div>
                                <div className="text-xs text-muted-foreground">Countries</div>
                            </div>
                            <div className="text-center glass p-4 rounded-xl">
                                <div className="text-2xl font-bold text-primary">99.8%</div>
                                <div className="text-xs text-muted-foreground">Accuracy</div>
                            </div>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/parts">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
                                >
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    <span>Browse Parts</span>
                                </motion.button>
                            </Link>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="glass text-lg px-8 py-4 hover:glass-hover transition-all flex items-center space-x-2 group"
                            >
                                <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                <span>Watch Demo</span>
                            </motion.button>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.0 }}
                            className="flex flex-wrap items-center gap-6 pt-8"
                        >
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Zap className="h-4 w-4 text-accent" />
                                <span>AI-Powered</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Globe className="h-4 w-4 text-accent" />
                                <span>Global Shipping</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Star className="h-4 w-4 text-accent fill-current" />
                                <span>Premium Quality</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <motion.button
                        onClick={scrollToStats}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center space-y-2 text-muted-foreground hover:text-primary transition-colors group"
                    >
                        <span className="text-sm">Discover More</span>
                        <ChevronDown className="h-6 w-6 group-hover:translate-y-1 transition-transform" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}