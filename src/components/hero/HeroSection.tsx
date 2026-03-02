"use client";

import { motion } from 'framer-motion';
// import SmartFitmentSearch from '../search/SmartFitmentSearch';
// import CarWireframe3D from './CarWireframe3D';
import { Leaf, ShieldCheck, Zap, Star, TrendingUp, Car } from 'lucide-react';

export default function HeroSection() {
    return (
        <div className="relative overflow-hidden bg-[var(--color-background)] min-h-[85vh] flex flex-col items-center justify-center pt-20 pb-16 px-6">
            {/* Enhanced Dynamic Background */}
            <div className="absolute top-[-30%] left-[-15%] w-[60%] h-[60%] bg-[var(--color-primary)] rounded-full blur-[200px] opacity-10 pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-15%] w-[50%] h-[50%] bg-[var(--color-accent)] rounded-full blur-[200px] opacity-8 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-[var(--color-success)] rounded-full blur-[100px] opacity-5 pointer-events-none animate-pulse" style={{ animationDelay: '4s' }} />

            {/* Enhanced Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

            <div
                className="z-10 text-center max-w-5xl mx-auto mb-10"
            >
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--color-glass-border)] mb-6"
                >
                    <Star className="w-4 h-4 text-[var(--color-accent)] fill-current" />
                    <span className="text-sm font-medium text-[var(--color-foreground-muted)]">#1 Automotive Parts Platform</span>
                    <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
                </div>

                <h1
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-tight"
                >
                    Find the <span className="text-gradient">Perfect Part</span>.<br />
                    <span className="text-[var(--color-foreground)]">Every Time.</span>
                </h1>

                <p
                    className="text-xl md:text-2xl text-[var(--color-foreground-muted)] max-w-3xl mx-auto mb-10 leading-relaxed"
                >
                    Global access to 2.4M+ verified automotive parts with AI-powered fitment technology.
                    <span className="text-[var(--color-primary)] font-semibold"> 99.8% accuracy guaranteed.</span>
                </p>
            </div>

            <div
                className="z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
            >
                <div className="order-2 lg:order-1">
                    {/* <SmartFitmentSearch /> */}
                    <div className="bg-surface p-8 rounded-2xl border">
                        <h3 className="text-xl font-semibold mb-4">Smart Fitment Search</h3>
                        <p className="text-muted-foreground">AI-powered automotive parts search</p>
                    </div>
                </div>
                <div className="order-1 lg:order-2 w-full">
                    {/* <CarWireframe3D /> */}
                    <div className="h-96 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                            <Car className="w-16 h-16 mx-auto mb-4 text-primary" />
                            <p className="text-lg font-semibold">3D Car Visualization</p>
                            <p className="text-sm text-muted-foreground">Coming Soon</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Value Props */}
            <div
                className="mt-16 z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
            >
                <div className="group glass p-6 rounded-2xl border border-[var(--color-glass-border)] hover:glass-hover transition-all hover:border-[var(--color-primary)]/30">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-[var(--color-gradient-primary)] rounded-2xl text-white group-hover:scale-110 transition-transform shadow-lg">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[var(--color-foreground)] mb-1">Guaranteed Fitment</h3>
                            <p className="text-sm text-[var(--color-foreground-muted)]">99.8% accuracy by VIN or specs</p>
                        </div>
                    </div>
                </div>

                <div className="group glass p-6 rounded-2xl border border-[var(--color-glass-border)] hover:glass-hover transition-all hover:border-[var(--color-success)]/30">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white group-hover:scale-110 transition-transform shadow-lg">
                            <Leaf size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[var(--color-foreground)] mb-1">Eco-Friendly</h3>
                            <p className="text-sm text-[var(--color-foreground-muted)]">Carbon offset on every order</p>
                        </div>
                    </div>
                </div>

                <div className="group glass p-6 rounded-2xl border border-[var(--color-glass-border)] hover:glass-hover transition-all hover:border-[var(--color-accent)]/30">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-[var(--color-gradient-accent)] rounded-2xl text-white group-hover:scale-110 transition-transform shadow-lg">
                            <Zap size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[var(--color-foreground)] mb-1">Lightning Fast</h3>
                            <p className="text-sm text-[var(--color-foreground-muted)]">Global shipping & support</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
