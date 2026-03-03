"use client";

import { useEffect, useState } from 'react';

export default function SimpleParticleBackground() {
    const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number}>>([]);

    useEffect(() => {
        const particleArray = [];
        for (let i = 0; i < 50; i++) {
            particleArray.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 1,
                speed: Math.random() * 2 + 0.5
            });
        }
        setParticles(particleArray);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-primary/20 animate-pulse"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animationDelay: `${particle.id * 0.1}s`,
                        animationDuration: `${2 + particle.speed}s`
                    }}
                />
            ))}
        </div>
    );
}