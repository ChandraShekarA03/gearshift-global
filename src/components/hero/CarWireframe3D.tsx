"use client";

import { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Environment, Wireframe } from '@react-three/drei';
import * as THREE from 'three';

interface CarZoneProps {
    position: [number, number, number];
    scale: [number, number, number];
    name: string;
    onClick: (name: string) => void;
}

function InteractionZone({ position, scale, name, onClick }: CarZoneProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    // Subtle glow animation
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Gentle pulsing
            const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.05 + 1;
            meshRef.current.scale.lerp(
                new THREE.Vector3(scale[0] * pulse, scale[1] * pulse, scale[2] * pulse),
                delta * 5
            );
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                onClick(name);
            }}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                setHover(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                setHover(false);
                document.body.style.cursor = 'auto';
            }}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color={hovered ? '#00ff88' : '#ffffff'}
                transparent
                opacity={hovered ? 0.3 : 0.1}
                emissive={hovered ? '#00ff88' : '#000000'}
                emissiveIntensity={hovered ? 0.2 : 0}
            />
        </mesh>
    );
}

function RealisticCarModel({ onZoneClick }: { onZoneClick: (zone: string) => void }) {
    const groupRef = useRef<THREE.Group>(null);

    // Slowly rotate the car
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[0, -0.5, 0]}>
            {/* Car Body - Main chassis */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[4.2, 1.2, 8]} />
                <meshStandardMaterial color="#2a4a7a" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Car Body - Hood */}
            <mesh position={[0, 0.8, 2.5]}>
                <boxGeometry args={[3.8, 0.4, 2.5]} />
                <meshStandardMaterial color="#1e3a5f" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Car Body - Trunk/Rear */}
            <mesh position={[0, 0.6, -3]}>
                <boxGeometry args={[3.8, 0.8, 1.5]} />
                <meshStandardMaterial color="#1e3a5f" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Roof */}
            <mesh position={[0, 1.1, -0.5]}>
                <boxGeometry args={[3.6, 0.3, 4]} />
                <meshStandardMaterial color="#1a2e4a" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Windshield */}
            <mesh position={[0, 1.0, 1.2]} rotation={[Math.PI * 0.15, 0, 0]}>
                <planeGeometry args={[3.2, 1.8]} />
                <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} metalness={0} roughness={0} />
            </mesh>

            {/* Rear Window */}
            <mesh position={[0, 1.0, -2.2]} rotation={[Math.PI * -0.1, 0, 0]}>
                <planeGeometry args={[3.2, 1.4]} />
                <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} metalness={0} roughness={0} />
            </mesh>

            {/* Side Windows */}
            <mesh position={[-1.8, 0.9, -0.5]} rotation={[0, Math.PI * 0.5, 0]}>
                <planeGeometry args={[3.5, 1.2]} />
                <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} metalness={0} roughness={0} />
            </mesh>
            <mesh position={[1.8, 0.9, -0.5]} rotation={[0, Math.PI * -0.5, 0]}>
                <planeGeometry args={[3.5, 1.2]} />
                <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} metalness={0} roughness={0} />
            </mesh>

            {/* Wheels */}
            <mesh position={[-2.2, -0.3, 2.5]}>
                <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
            </mesh>
            <mesh position={[2.2, -0.3, 2.5]}>
                <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
            </mesh>
            <mesh position={[-2.2, -0.3, -2.5]}>
                <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
            </mesh>
            <mesh position={[2.2, -0.3, -2.5]}>
                <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
            </mesh>

            {/* Wheel Rims */}
            <mesh position={[-2.2, -0.3, 2.5]}>
                <cylinderGeometry args={[0.25, 0.25, 0.35, 16]} />
                <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0.1} />
            </mesh>
            <mesh position={[2.2, -0.3, 2.5]}>
                <cylinderGeometry args={[0.25, 0.25, 0.35, 16]} />
                <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0.1} />
            </mesh>
            <mesh position={[-2.2, -0.3, -2.5]}>
                <cylinderGeometry args={[0.25, 0.25, 0.35, 16]} />
                <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0.1} />
            </mesh>
            <mesh position={[2.2, -0.3, -2.5]}>
                <cylinderGeometry args={[0.25, 0.25, 0.35, 16]} />
                <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0.1} />
            </mesh>

            {/* Headlights */}
            <mesh position={[-1.2, 0.4, 4.1]}>
                <sphereGeometry args={[0.15]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[1.2, 0.4, 4.1]}>
                <sphereGeometry args={[0.15]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
            </mesh>

            {/* Taillights */}
            <mesh position={[-1.2, 0.4, -4.1]}>
                <sphereGeometry args={[0.12]} />
                <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[1.2, 0.4, -4.1]}>
                <sphereGeometry args={[0.12]} />
                <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.2} />
            </mesh>

            {/* Grille */}
            <mesh position={[0, 0.3, 4.2]}>
                <boxGeometry args={[1.5, 0.6, 0.1]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Exhaust Pipes */}
            <mesh position={[-1.5, -0.1, -4.2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[1.5, -0.1, -4.2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Interactive Zones - Now more integrated with car parts */}
            {/* Engine Bay (Front under hood) */}
            <InteractionZone position={[0, 0.5, 2.5]} scale={[2.5, 1.2, 2]} name="Engine" onClick={onZoneClick} />

            {/* Cabin/Interior (Inside car) */}
            <InteractionZone position={[0, 1.0, -0.5]} scale={[3, 1.8, 3.5]} name="Interior" onClick={onZoneClick} />

            {/* Suspension/Wheels (Around wheels) */}
            <InteractionZone position={[2.2, -0.3, 2.5]} scale={[1, 1, 1]} name="Suspension (FR)" onClick={onZoneClick} />
            <InteractionZone position={[-2.2, -0.3, 2.5]} scale={[1, 1, 1]} name="Suspension (FL)" onClick={onZoneClick} />
            <InteractionZone position={[2.2, -0.3, -2.5]} scale={[1, 1, 1]} name="Suspension (RR)" onClick={onZoneClick} />
            <InteractionZone position={[-2.2, -0.3, -2.5]} scale={[1, 1, 1]} name="Suspension (RL)" onClick={onZoneClick} />

            {/* Exhaust/Rear (Around exhaust) */}
            <InteractionZone position={[0, -0.1, -4]} scale={[2, 0.8, 1.5]} name="Exhaust & Filters" onClick={onZoneClick} />
        </group>
    );
}

export default function CarWireframe3D() {
    const [activeZone, setActiveZone] = useState<string | null>(null);

    const handleZoneClick = (zone: string) => {
        setActiveZone(zone);
        // Future integration: update Zustand store to filter parts catalog based on zone.
    };

    return (
        <div className="w-full h-[550px] relative rounded-3xl overflow-hidden glass border border-[var(--color-glass-border)] hover:border-[var(--color-primary)]/30 transition-all shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
            {/* Enhanced UI Overlay */}
            <div className="absolute top-6 left-6 z-20 pointer-events-none">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-[var(--color-success)] rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-bold text-[var(--color-foreground)]">Interactive Car Explorer</h3>
                </div>
                <div className="glass px-4 py-2 rounded-xl border border-[var(--color-glass-border)]">
                    <p className="text-sm text-[var(--color-primary)] font-mono uppercase tracking-wider">
                        {activeZone ? `Selected: ${activeZone}` : 'Click car zones to explore'}
                    </p>
                </div>
            </div>

            {/* Zone Legend */}
            <div className="absolute top-6 right-6 z-20 pointer-events-none">
                <div className="glass p-4 rounded-xl border border-[var(--color-glass-border)]">
                    <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Available Zones</h4>
                    <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-[var(--color-foreground-muted)]">Engine & Powertrain</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-[var(--color-foreground-muted)]">Interior & Electronics</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            <span className="text-[var(--color-foreground-muted)]">Suspension & Wheels</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-[var(--color-foreground-muted)]">Exhaust & Filters</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/90 via-transparent to-transparent pointer-events-none z-10" />

            {/* 3D Canvas */}
            <Canvas camera={{ position: [8, 5, 10], fov: 45 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" castShadow />
                <pointLight position={[10, 10, 10]} intensity={0.8} color="#3b82f6" />
                <pointLight position={[-10, 5, -10]} intensity={0.6} color="#ffffff" />
                <pointLight position={[0, -5, 5]} intensity={0.4} color="#f59e0b" />
                <spotLight position={[0, 10, 0]} angle={0.3} penumbra={0.5} intensity={0.5} color="#ffffff" />

                <RealisticCarModel onZoneClick={handleZoneClick} />

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minPolarAngle={Math.PI / 8}
                    maxPolarAngle={Math.PI / 2}
                    minDistance={6}
                    maxDistance={15}
                />
                <Environment preset="sunset" />
            </Canvas>
        </div>
    );
}
