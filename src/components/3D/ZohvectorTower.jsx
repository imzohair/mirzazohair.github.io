import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import useGameStore from '../../stores/gameStore';

const ZohvectorTower = ({ onEnter, onExit }) => {
    const towerRef = useRef();
    const ringsRef = useRef([]);
    const elevatorRef = useRef();
    const visitDistrict = useGameStore(state => state.visitDistrict);
    const { level, getXPProgress, unlockedBadges, getCompletionPercentage } = useGameStore();

    const xpProgress = getXPProgress();
    const completion = getCompletionPercentage();

    useFrame((state) => {
        // Rotating rings
        ringsRef.current.forEach((ring, i) => {
            if (ring) {
                ring.rotation.y += 0.005 * (i % 2 === 0 ? 1 : -1);
                ring.rotation.z = Math.sin(state.clock.elapsedTime + i) * 0.1;
            }
        });

        // Elevator beam pulse
        if (elevatorRef.current) {
            const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
            elevatorRef.current.material.opacity = pulse;
        }
    });

    return (
        <group position={[0, 35, 0]}>
            {/* Tower Base */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[8, 10, 20, 8]} />
                <meshStandardMaterial
                    color="#0B0F17"
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Tower Top */}
            <mesh position={[0, 15, 0]}>
                <cylinderGeometry args={[5, 8, 10, 8]} />
                <meshStandardMaterial
                    color="#0B0F17"
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Spire */}
            <mesh position={[0, 25, 0]}>
                <coneGeometry args={[3, 10, 8]} />
                <meshStandardMaterial
                    color="#0B0F17"
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Vertical Neon Lines */}
            {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                return (
                    <mesh
                        key={`line-${i}`}
                        position={[
                            Math.cos(angle) * 9,
                            5,
                            Math.sin(angle) * 9,
                        ]}
                    >
                        <boxGeometry args={[0.1, 30, 0.1]} />
                        <meshStandardMaterial
                            color="#00E5FF"
                            emissive="#00E5FF"
                            emissiveIntensity={0.8}
                        />
                    </mesh>
                );
            })}

            {/* Rotating Neon Rings */}
            {[5, 12, 20].map((y, i) => (
                <mesh
                    key={`ring-${i}`}
                    ref={(el) => (ringsRef.current[i] = el)}
                    position={[0, y, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <torusGeometry args={[10 - i * 1.5, 0.1, 16, 64]} />
                    <meshStandardMaterial
                        color={i === 0 ? '#00E5FF' : i === 1 ? '#2F6BFF' : '#A066FF'}
                        emissive={i === 0 ? '#00E5FF' : i === 1 ? '#2F6BFF' : '#A066FF'}
                        emissiveIntensity={0.8}
                    />
                </mesh>
            ))}

            {/* Elevator Beam (from ground to tower) */}
            <mesh ref={elevatorRef} position={[0, -20, 0]}>
                <cylinderGeometry args={[1.5, 1.5, 40, 16]} />
                <meshStandardMaterial
                    color="#00E5FF"
                    emissive="#00E5FF"
                    emissiveIntensity={1}
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* Interior Badge Room (simplified) */}
            <group position={[0, 5, 0]}>
                {/* Central Hologram Pillar */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1, 1, 8, 16]} />
                    <meshStandardMaterial
                        color="#00C2D1"
                        emissive="#00C2D1"
                        emissiveIntensity={0.3}
                        transparent
                        opacity={0.3}
                    />
                </mesh>

                {/* Stats Display */}
                <Text
                    position={[0, 6, 0]}
                    fontSize={0.8}
                    color="#00E5FF"
                    anchorX="center"
                >
                    LEVEL {level}
                </Text>
                <Text
                    position={[0, 5, 0]}
                    fontSize={0.4}
                    color="#9BAEC8"
                    anchorX="center"
                >
                    {xpProgress.currentXP} / {xpProgress.nextLevelXP || 'MAX'} XP
                </Text>
                <Text
                    position={[0, 4, 0]}
                    fontSize={0.4}
                    color="#00C2D1"
                    anchorX="center"
                >
                    {unlockedBadges.length} Badges • {completion}% Complete
                </Text>

                {/* Badge Shelves (360°) */}
                {[...Array(8)].map((_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    const isUnlocked = i < unlockedBadges.length;
                    return (
                        <group
                            key={`badge-${i}`}
                            position={[
                                Math.cos(angle) * 5,
                                2,
                                Math.sin(angle) * 5,
                            ]}
                            rotation={[0, -angle, 0]}
                        >
                            {/* Badge hexagon */}
                            <mesh>
                                <cylinderGeometry args={[0.6, 0.6, 0.1, 6]} />
                                <meshStandardMaterial
                                    color={isUnlocked ? '#00E5FF' : '#2A2A3A'}
                                    emissive={isUnlocked ? '#00E5FF' : '#000000'}
                                    emissiveIntensity={isUnlocked ? 0.5 : 0}
                                />
                            </mesh>
                        </group>
                    );
                })}

                {/* Particle streams */}
                {[...Array(20)].map((_, i) => (
                    <mesh
                        key={`particle-${i}`}
                        position={[
                            (Math.random() - 0.5) * 6,
                            Math.random() * 8 - 2,
                            (Math.random() - 0.5) * 6,
                        ]}
                    >
                        <sphereGeometry args={[0.05, 8, 8]} />
                        <meshStandardMaterial
                            color="#00E5FF"
                            emissive="#00E5FF"
                            emissiveIntensity={1}
                        />
                    </mesh>
                ))}
            </group>

            {/* Tower Label */}
            <Text
                position={[0, 32, 0]}
                fontSize={1.5}
                color="#00E5FF"
                anchorX="center"
            >
                ZOHVECTOR TOWER
            </Text>

            {/* Trigger zone */}
            <mesh
                position={[0, 0, 0]}
                visible={false}
                onClick={() => {
                    visitDistrict('tower');
                    onEnter && onEnter();
                }}
            >
                <cylinderGeometry args={[12, 12, 30, 16]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Lights */}
            <pointLight color="#00E5FF" intensity={3} distance={50} position={[0, 25, 0]} />
            <pointLight color="#A066FF" intensity={2} distance={30} position={[0, 10, 0]} />
        </group>
    );
};

export default ZohvectorTower;
