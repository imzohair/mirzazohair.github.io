import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import useGameStore from '../../stores/gameStore';

// Glowing Platform Component
const GlowingPlatform = ({ radius, color = '#00E5FF', segments = 64, height = 0.3 }) => {
    return (
        <group>
            {/* Platform base */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[radius, radius, height, segments]} />
                <meshStandardMaterial
                    color="#0D1520"
                    metalness={0.8}
                    roughness={0.3}
                />
            </mesh>

            {/* Edge glow */}
            <mesh position={[0, height / 2 + 0.05, 0]}>
                <ringGeometry args={[radius - 0.5, radius, segments]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Inner glow rings */}
            {[0.3, 0.5, 0.7].map((scale, i) => (
                <mesh key={i} position={[0, height / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[radius * scale - 0.2, radius * scale, segments]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.4}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
};

// About District - Center (0, 0, 0)
export const AboutDistrict = ({ onTrigger }) => {
    const spireRef = useRef();
    const shardsRef = useRef([]);
    const ringRef = useRef();
    const visitDistrict = useGameStore(state => state.visitDistrict);

    useFrame((state) => {
        if (spireRef.current) {
            spireRef.current.rotation.y += 0.005;
        }
        if (ringRef.current) {
            ringRef.current.rotation.z += 0.01;
        }
        shardsRef.current.forEach((shard, i) => {
            if (shard) {
                shard.rotation.y += 0.02 * (i % 2 === 0 ? 1 : -1);
                shard.position.y = 5 + Math.sin(state.clock.elapsedTime + i) * 0.5;
            }
        });
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Platform */}
            <GlowingPlatform radius={18} color="#00E5FF" />

            {/* Data Spire */}
            <group ref={spireRef} position={[0, 0, 0]}>
                <mesh position={[0, 10, 0]}>
                    <cylinderGeometry args={[0.8, 2, 20, 8]} />
                    <meshStandardMaterial
                        color="#0D1520"
                        metalness={0.9}
                        roughness={0.1}
                        emissive="#00E5FF"
                        emissiveIntensity={0.1}
                    />
                </mesh>

                {/* Spire glow rings */}
                {[3, 7, 11, 15, 19].map((y, i) => (
                    <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[1.8 - i * 0.2, 0.08, 16, 32]} />
                        <meshStandardMaterial
                            color="#00E5FF"
                            emissive="#00E5FF"
                            emissiveIntensity={1.5}
                        />
                    </mesh>
                ))}

                {/* Spire top beacon */}
                <mesh position={[0, 21, 0]}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshStandardMaterial
                        color="#00E5FF"
                        emissive="#00E5FF"
                        emissiveIntensity={2}
                    />
                </mesh>
                <pointLight position={[0, 21, 0]} color="#00E5FF" intensity={3} distance={30} />
            </group>

            {/* Rotating ring */}
            <mesh ref={ringRef} position={[0, 12, 0]} rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[4, 0.1, 16, 64]} />
                <meshStandardMaterial
                    color="#00C2D1"
                    emissive="#00C2D1"
                    emissiveIntensity={1}
                />
            </mesh>

            {/* Floating Text */}
            <Text
                position={[0, 25, 0]}
                fontSize={2}
                color="#00E5FF"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="#000000"
            >
                MIRZA ZOHAIR ALI BAIG
            </Text>
            <Text
                position={[0, 22.5, 0]}
                fontSize={0.8}
                color="#9BAEC8"
                anchorX="center"
                anchorY="middle"
            >
                First-Year CS Engineering Student
            </Text>
            <Text
                position={[0, 1.5, 12]}
                fontSize={1}
                color="#00E5FF"
                anchorX="center"
                anchorY="middle"
                rotation={[0, Math.PI, 0]}
            >
                ABOUT DISTRICT
            </Text>

            {/* Rotating Data Shards */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <mesh
                    key={i}
                    ref={(el) => (shardsRef.current[i] = el)}
                    position={[
                        Math.cos((i / 6) * Math.PI * 2) * 10,
                        5,
                        Math.sin((i / 6) * Math.PI * 2) * 10,
                    ]}
                >
                    <octahedronGeometry args={[0.6]} />
                    <meshStandardMaterial
                        color="#00C2D1"
                        emissive="#00C2D1"
                        emissiveIntensity={1}
                        transparent
                        opacity={0.9}
                    />
                </mesh>
            ))}

            {/* Ambient light */}
            <pointLight color="#00E5FF" intensity={3} distance={40} position={[0, 15, 0]} />
        </group>
    );
};

// Skills District - North (0, 0, 40)
export const SkillsDistrict = ({ onTrigger }) => {
    const towersRef = useRef([]);
    const visitDistrict = useGameStore(state => state.visitDistrict);

    const skillCategories = [
        { name: 'CODE', color: '#00E5FF', height: 12 },
        { name: 'WEB', color: '#2F6BFF', height: 15 },
        { name: 'TOOLS', color: '#A066FF', height: 10 },
        { name: 'SOFT', color: '#00C2D1', height: 13 },
    ];

    useFrame((state) => {
        towersRef.current.forEach((tower, i) => {
            if (tower) {
                const pulse = Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
                tower.scale.y = 1 + pulse;
            }
        });
    });

    return (
        <group position={[0, 0, 40]}>
            {/* Platform */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[28, 0.3, 22]} />
                <meshStandardMaterial color="#0D1520" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[28.2, 0.1, 22.2]} />
                <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.5} transparent opacity={0.5} />
            </mesh>

            {/* Skill Towers */}
            {skillCategories.map((skill, i) => (
                <group
                    key={skill.name}
                    position={[(i - 1.5) * 6, 0, 0]}
                    ref={(el) => (towersRef.current[i] = el)}
                >
                    {/* Tower body */}
                    <mesh position={[0, skill.height / 2, 0]}>
                        <boxGeometry args={[3, skill.height, 3]} />
                        <meshStandardMaterial
                            color="#0D1520"
                            metalness={0.8}
                            roughness={0.2}
                            emissive={skill.color}
                            emissiveIntensity={0.1}
                        />
                    </mesh>

                    {/* Tower edge glow */}
                    <lineSegments position={[0, skill.height / 2, 0]}>
                        <edgesGeometry args={[new THREE.BoxGeometry(3, skill.height, 3)]} />
                        <lineBasicMaterial color={skill.color} linewidth={2} />
                    </lineSegments>

                    {/* Tower top glow */}
                    <mesh position={[0, skill.height + 0.15, 0]}>
                        <boxGeometry args={[3, 0.3, 3]} />
                        <meshStandardMaterial
                            color={skill.color}
                            emissive={skill.color}
                            emissiveIntensity={1.5}
                        />
                    </mesh>

                    {/* Hologram label */}
                    <Text
                        position={[0, skill.height + 2, 0]}
                        fontSize={0.7}
                        color={skill.color}
                        anchorX="center"
                    >
                        {skill.name}
                    </Text>

                    {/* Tower light */}
                    <pointLight position={[0, skill.height, 0]} color={skill.color} intensity={1} distance={15} />
                </group>
            ))}

            {/* District label */}
            <Text
                position={[0, 18, 0]}
                fontSize={1.2}
                color="#00E5FF"
                anchorX="center"
            >
                SKILLS DISTRICT
            </Text>

            <pointLight color="#00E5FF" intensity={2} distance={35} position={[0, 12, 0]} />
        </group>
    );
};

// Experience District - East (40, 0, 0)
export const ExperienceDistrict = ({ onTrigger }) => {
    const obelisksRef = useRef([]);
    const visitDistrict = useGameStore(state => state.visitDistrict);

    const experiences = [
        { title: 'CLASS REP', year: '2024', color: '#00E5FF' },
        { title: 'WEB DEV', year: '2023', color: '#2F6BFF' },
        { title: 'CAPTAIN', year: '2022', color: '#A066FF' },
        { title: 'HEAD BOY', year: '2021', color: '#00C2D1' },
        { title: 'HOUSE', year: '2020', color: '#00E5FF' },
    ];

    useFrame((state) => {
        obelisksRef.current.forEach((obelisk, i) => {
            if (obelisk) {
                obelisk.children.forEach((child) => {
                    if (child.material && child.material.emissiveIntensity !== undefined) {
                        child.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.5;
                    }
                });
            }
        });
    });

    return (
        <group position={[40, 0, 0]}>
            {/* Platform */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[18, 0.3, 45]} />
                <meshStandardMaterial color="#0D1520" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[18.2, 0.1, 45.2]} />
                <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.5} transparent opacity={0.5} />
            </mesh>

            {/* Timeline Obelisks */}
            {experiences.map((exp, i) => (
                <group
                    key={exp.title}
                    position={[0, 0, (i - 2) * 9]}
                    ref={(el) => (obelisksRef.current[i] = el)}
                >
                    {/* Obelisk */}
                    <mesh position={[0, 5, 0]}>
                        <boxGeometry args={[2, 10, 2]} />
                        <meshStandardMaterial
                            color="#0D1520"
                            metalness={0.9}
                            roughness={0.1}
                            emissive={exp.color}
                            emissiveIntensity={0.1}
                        />
                    </mesh>

                    {/* Vertical neon line */}
                    <mesh position={[1.1, 5, 0]}>
                        <boxGeometry args={[0.1, 9, 0.1]} />
                        <meshStandardMaterial
                            color={exp.color}
                            emissive={exp.color}
                            emissiveIntensity={1.5}
                        />
                    </mesh>

                    {/* Top marker */}
                    <mesh position={[0, 10.5, 0]}>
                        <boxGeometry args={[2.5, 0.3, 2.5]} />
                        <meshStandardMaterial
                            color={exp.color}
                            emissive={exp.color}
                            emissiveIntensity={1}
                        />
                    </mesh>

                    <Text position={[0, 12, 0]} fontSize={0.5} color={exp.color} anchorX="center">
                        {exp.title}
                    </Text>
                    <Text position={[0, 11.2, 0]} fontSize={0.35} color="#9BAEC8" anchorX="center">
                        {exp.year}
                    </Text>

                    <pointLight position={[0, 10, 0]} color={exp.color} intensity={0.8} distance={12} />
                </group>
            ))}

            {/* District label */}
            <Text
                position={[0, 15, 0]}
                fontSize={1}
                color="#00E5FF"
                anchorX="center"
                rotation={[0, -Math.PI / 2, 0]}
            >
                EXPERIENCE DISTRICT
            </Text>

            <pointLight color="#00E5FF" intensity={2} distance={35} position={[0, 10, 0]} />
        </group>
    );
};

// Education District - West (-40, 0, 0)
export const EducationDistrict = ({ onTrigger }) => {
    const capRef = useRef();
    const domeRef = useRef();
    const visitDistrict = useGameStore(state => state.visitDistrict);

    useFrame((state) => {
        if (capRef.current) {
            capRef.current.rotation.y += 0.01;
            capRef.current.position.y = 16 + Math.sin(state.clock.elapsedTime) * 0.5;
        }
        if (domeRef.current) {
            domeRef.current.rotation.y += 0.002;
        }
    });

    return (
        <group position={[-40, 0, 0]}>
            {/* Hexagon Platform */}
            <GlowingPlatform radius={18} color="#2F6BFF" segments={6} />

            {/* Academy Building Base */}
            <mesh position={[0, 4.5, 0]}>
                <cylinderGeometry args={[10, 12, 9, 6]} />
                <meshStandardMaterial
                    color="#0D1520"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#2F6BFF"
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Building edge glow */}
            <mesh position={[0, 9.1, 0]}>
                <cylinderGeometry args={[10, 10, 0.2, 6]} />
                <meshStandardMaterial
                    color="#2F6BFF"
                    emissive="#2F6BFF"
                    emissiveIntensity={1}
                />
            </mesh>

            {/* Dome */}
            <group ref={domeRef}>
                <mesh position={[0, 12, 0]}>
                    <sphereGeometry args={[7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial
                        color="#0D1520"
                        metalness={0.9}
                        roughness={0.1}
                        emissive="#A066FF"
                        emissiveIntensity={0.1}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>

            {/* Rotating Graduation Cap */}
            <group ref={capRef} position={[0, 16, 0]}>
                <mesh>
                    <boxGeometry args={[4, 0.3, 4]} />
                    <meshStandardMaterial
                        color="#A066FF"
                        emissive="#A066FF"
                        emissiveIntensity={1}
                        transparent
                        opacity={0.9}
                    />
                </mesh>
                <mesh position={[0, -0.8, 0]}>
                    <cylinderGeometry args={[1.2, 1.2, 1.3, 6]} />
                    <meshStandardMaterial
                        color="#A066FF"
                        emissive="#A066FF"
                        emissiveIntensity={0.8}
                        transparent
                        opacity={0.9}
                    />
                </mesh>
                <pointLight color="#A066FF" intensity={2} distance={20} />
            </group>

            {/* District label */}
            <Text
                position={[0, 20, 0]}
                fontSize={1}
                color="#2F6BFF"
                anchorX="center"
                rotation={[0, Math.PI / 2, 0]}
            >
                EDUCATION DISTRICT
            </Text>

            <pointLight color="#2F6BFF" intensity={3} distance={40} position={[0, 12, 0]} />
        </group>
    );
};

// Contact District - South (0, 0, -40)
export const ContactDistrict = ({ onTrigger }) => {
    const beamRef = useRef();
    const tilesRef = useRef([]);
    const visitDistrict = useGameStore(state => state.visitDistrict);

    const contactMethods = [
        { name: 'EMAIL', icon: '✉', color: '#00E5FF' },
        { name: 'LINKEDIN', icon: '◆', color: '#2F6BFF' },
        { name: 'GITHUB', icon: '⬡', color: '#A066FF' },
        { name: 'RESUME', icon: '◧', color: '#00C2D1' },
    ];

    useFrame((state) => {
        if (beamRef.current) {
            beamRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
        }
        tilesRef.current.forEach((tile, i) => {
            if (tile) {
                tile.position.y = 4 + Math.sin(state.clock.elapsedTime * 1.5 + i * 0.8) * 0.5;
                tile.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.1;
            }
        });
    });

    return (
        <group position={[0, 0, -40]}>
            {/* Platform */}
            <GlowingPlatform radius={16} color="#00E5FF" />

            {/* Communication Antenna */}
            <mesh position={[0, 10, 0]}>
                <cylinderGeometry args={[0.4, 0.8, 20, 8]} />
                <meshStandardMaterial
                    color="#0D1520"
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#00E5FF"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Antenna rings */}
            {[5, 10, 15].map((y, i) => (
                <mesh key={i} position={[0, y, 0]}>
                    <torusGeometry args={[1.5 - i * 0.3, 0.1, 16, 32]} />
                    <meshStandardMaterial
                        color="#00E5FF"
                        emissive="#00E5FF"
                        emissiveIntensity={1}
                    />
                </mesh>
            ))}

            {/* Transmission Beam */}
            <mesh ref={beamRef} position={[0, 35, 0]}>
                <cylinderGeometry args={[0.8, 0.2, 50, 16]} />
                <meshStandardMaterial
                    color="#00E5FF"
                    emissive="#00E5FF"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* Floating Contact Tiles */}
            {contactMethods.map((method, i) => (
                <group
                    key={method.name}
                    position={[
                        Math.cos((i / 4) * Math.PI * 2 + Math.PI / 4) * 9,
                        4,
                        Math.sin((i / 4) * Math.PI * 2 + Math.PI / 4) * 9,
                    ]}
                    ref={(el) => (tilesRef.current[i] = el)}
                >
                    <mesh>
                        <boxGeometry args={[4, 2.5, 0.3]} />
                        <meshStandardMaterial
                            color="#0D1520"
                            metalness={0.8}
                            roughness={0.2}
                            emissive={method.color}
                            emissiveIntensity={0.2}
                        />
                    </mesh>
                    <mesh position={[0, 0, 0.2]}>
                        <boxGeometry args={[4.1, 2.6, 0.05]} />
                        <meshStandardMaterial
                            color={method.color}
                            emissive={method.color}
                            emissiveIntensity={0.5}
                            transparent
                            opacity={0.3}
                        />
                    </mesh>
                    <Text position={[0, 0, 0.2]} fontSize={0.5} color={method.color} anchorX="center">
                        {method.name}
                    </Text>
                    <pointLight color={method.color} intensity={0.5} distance={8} />
                </group>
            ))}

            {/* District label */}
            <Text
                position={[0, 22, 0]}
                fontSize={1}
                color="#00E5FF"
                anchorX="center"
            >
                CONTACT DISTRICT
            </Text>

            <pointLight color="#00E5FF" intensity={3} distance={50} position={[0, 30, 0]} />
        </group>
    );
};

export default {
    AboutDistrict,
    SkillsDistrict,
    ExperienceDistrict,
    EducationDistrict,
    ContactDistrict,
};
