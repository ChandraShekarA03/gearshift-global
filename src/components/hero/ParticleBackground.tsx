"use client";

import { useEffect, useRef } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    opacity: number;
}

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number | null>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ef4444', '#f59e0b'];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const createParticles = () => {
            const particleArray: Particle[] = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
            
            for (let i = 0; i < numberOfParticles; i++) {
                particleArray.push({
                    id: i,
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 3 + 1,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
            particlesRef.current = particleArray;
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particlesRef.current = particlesRef.current.map(particle => {
                // Update position
                let newX = particle.x + particle.vx;
                let newY = particle.y + particle.vy;
                let newVx = particle.vx;
                let newVy = particle.vy;

                // Bounce off walls
                if (newX <= 0 || newX >= canvas.width) {
                    newVx = -particle.vx;
                    newX = Math.max(0, Math.min(canvas.width, newX));
                }
                if (newY <= 0 || newY >= canvas.height) {
                    newVy = -particle.vy;
                    newY = Math.max(0, Math.min(canvas.height, newY));
                }

                // Mouse repulsion
                const dx = mouseRef.current.x - newX;
                const dy = mouseRef.current.y - newY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const repulsionRadius = 100;

                if (distance < repulsionRadius) {
                    const force = (repulsionRadius - distance) / repulsionRadius;
                    newVx -= (dx / distance) * force * 0.5;
                    newVy -= (dy / distance) * force * 0.5;
                }

                // Draw particle
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(newX, newY, particle.size, 0, Math.PI * 2);
                ctx.fill();

                return {
                    ...particle,
                    x: newX,
                    y: newY,
                    vx: newVx * 0.99, // Add slight friction
                    vy: newVy * 0.99
                };
            });

            // Draw connections
            ctx.globalAlpha = 0.1;
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 1;

            particlesRef.current.forEach((particle, i) => {
                particlesRef.current.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // Add new particles on click
            const newParticles: Particle[] = [];
            for (let i = 0; i < 4; i++) {
                newParticles.push({
                    id: Date.now() + i,
                    x: clickX + (Math.random() - 0.5) * 20,
                    y: clickY + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    size: Math.random() * 4 + 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    opacity: 0.8
                });
            }
            particlesRef.current = [...particlesRef.current, ...newParticles];
        };

        resizeCanvas();
        createParticles();
        
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleClick);
        
        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('click', handleClick);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 w-full h-full pointer-events-auto"
            style={{ background: 'transparent' }}
        />
    );
}