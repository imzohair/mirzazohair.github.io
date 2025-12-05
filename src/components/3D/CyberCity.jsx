import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Neon Building Component
const NeonBuilding = ({ position, size, color = '#00E5FF', pulseSpeed = 1 }) => {
    const meshRef = useRef();
    const linesRef = useRef();

    useFrame((state) => {
        if (linesRef.current) {
            const pulse = 0.5 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.3;
            linesRef.current.children.forEach((line) => {
                if (line.material) {
                    line.material.opacity = pulse;
                }
            });
        }
    });

    return (
        <group position={position}>
            {/* Building body */}
            <mesh ref={meshRef}>
                <boxGeometry args={size} />
                <meshStandardMaterial
                    color="#0D1520"
                    metalness={0.7}
                    roughness={0.3}
                    emissive="#050810"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Neon edges */}
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
                <lineBasicMaterial color={color} linewidth={2} />
            </lineSegments>

            {/* Neon accent lines */}
            <group ref={linesRef}>
                {[...Array(Math.floor(size[1] / 3))].map((_, i) => (
                    <mesh key={i} position={[0, -size[1] / 2 + 1.5 + i * 3, size[2] / 2 + 0.01]}>
                        <planeGeometry args={[size[0] * 0.8, 0.15]} />
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={1}
                            transparent
                            opacity={0.9}
                        />
                    </mesh>
                ))}
            </group>

            {/* Top glow */}
            <mesh position={[0, size[1] / 2 + 0.05, 0]}>
                <boxGeometry args={[size[0], 0.1, size[2]]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.8}
                />
            </mesh>
        </group>
    );
};

// Sky Bridge Component
const SkyBridge = ({ start, end, color = '#00E5FF' }) => {
    const streakRef = useRef();

    const direction = useMemo(() => {
        return new THREE.Vector3().subVectors(
            new THREE.Vector3(...end),
            new THREE.Vector3(...start)
        );
    }, [start, end]);

    const midPoint = useMemo(() => {
        return [
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2 + 0.5,
            (start[2] + end[2]) / 2,
        ];
    }, [start, end]);

    const length = direction.length();
    const angle = Math.atan2(direction.x, direction.z);

    useFrame((state) => {
        if (streakRef.current) {
            const t = (state.clock.elapsedTime * 0.5) % 1;
            streakRef.current.position.x = start[0] + direction.x * t;
            streakRef.current.position.z = start[2] + direction.z * t;
        }
    });

    return (
        <group>
            {/* Bridge platform */}
            <mesh position={midPoint} rotation={[0, angle, 0]}>
                <boxGeometry args={[2.5, 0.15, length]} />
                <meshStandardMaterial
                    color="#0D1520"
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Edge glow */}
            <mesh position={[midPoint[0], midPoint[1] + 0.1, midPoint[2]]} rotation={[0, angle, 0]}>
                <boxGeometry args={[2.6, 0.08, length]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.7}
                />
            </mesh>

            {/* Rail lights */}
            {[-1.1, 1.1].map((offset, i) => (
                <mesh
                    key={i}
                    position={[
                        midPoint[0] + Math.cos(angle + Math.PI / 2) * offset,
                        midPoint[1] + 0.3,
                        midPoint[2] + Math.sin(angle + Math.PI / 2) * offset,
                    ]}
                    rotation={[0, angle, 0]}
                >
                    <boxGeometry args={[0.15, 0.4, length]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={0.6}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            ))}

            {/* Moving streak */}
            <mesh ref={streakRef} position={start}>
                <sphereGeometry args={[0.2, 12, 12]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    emissive={color}
                    emissiveIntensity={2}
                />
            </mesh>

            {/* Streak light */}
            <pointLight
                position={[start[0], start[1], start[2]]}
                color={color}
                intensity={0.5}
                distance={10}
            />
        </group>
    );
};

// Grid Floor Component
const GridFloor = () => {
    return (
        <group>
            {/* Base floor - slightly visible */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                <planeGeometry args={[300, 300]} />
                <meshStandardMaterial
                    color="#050810"
                    metalness={0.8}
                    roughness={0.4}
                />
            </mesh>

            {/* Grid overlay */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
                <planeGeometry args={[300, 300, 60, 60]} />
                <meshBasicMaterial
                    color="#00E5FF"
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </mesh>

            {/* Center ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
                <ringGeometry args={[18, 22, 64]} />
                <meshStandardMaterial
                    color="#00E5FF"
                    emissive="#00E5FF"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* Outer rings */}
            {[40, 60, 80].map((radius, i) => (
                <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
                    <ringGeometry args={[radius - 0.5, radius + 0.5, 64]} />
                    <meshStandardMaterial
                        color={i % 2 === 0 ? '#00E5FF' : '#A066FF'}
                        emissive={i % 2 === 0 ? '#00E5FF' : '#A066FF'}
                        emissiveIntensity={0.3}
                        transparent
                        opacity={0.4}
                    />
                </mesh>
            ))}
        </group>
    );
};

// Main City Component
const CyberCity = () => {
    // Bridge connections
    const bridges = [
        { start: [0, 1, 12], end: [0, 1, 28] }, // About to Skills
        { start: [12, 1, 0], end: [28, 1, 0] }, // About to Experience
        { start: [-12, 1, 0], end: [-28, 1, 0] }, // About to Education
        { start: [0, 1, -12], end: [0, 1, -28] }, // About to Contact
    ];

    // Generate consistent building positions
    const buildings = useMemo(() => {
        const result = [];
        for (let i = 0; i < 40; i++) {
            const angle = (i / 40) * Math.PI * 2;
            const radius = 55 + (i % 3) * 15;
            const height = 8 + (i % 5) * 6;
            result.push({
                position: [
                    Math.cos(angle) * radius,
                    height / 2,
                    Math.sin(angle) * radius,
                ],
                size: [4 + (i % 3) * 2, height, 4 + (i % 3) * 2],
                color: i % 3 === 0 ? '#00E5FF' : i % 3 === 1 ? '#A066FF' : '#2F6BFF',
                pulseSpeed: 0.3 + (i % 4) * 0.2,
            });
        }
        return result;
    }, []);

    return (
        <group>
            {/* Grid Floor */}
            <GridFloor />

            {/* Background Buildings */}
            {buildings.map((building, i) => (
                <NeonBuilding
                    key={`building-${i}`}
                    position={building.position}
                    size={building.size}
                    color={building.color}
                    pulseSpeed={building.pulseSpeed}
                />
            ))}

            {/* Sky Bridges */}
            {bridges.map((bridge, i) => (
                <SkyBridge
                    key={`bridge-${i}`}
                    start={bridge.start}
                    end={bridge.end}
                    color="#00E5FF"
                />
            ))}

            {/* Central beacon */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 100, 16]} />
                <meshStandardMaterial
                    color="#00E5FF"
                    emissive="#00E5FF"
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.2}
                />
            </mesh>
        </group>
    );
};

export default CyberCity;
