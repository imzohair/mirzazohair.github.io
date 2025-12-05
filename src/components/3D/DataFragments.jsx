import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useGameStore from '../../stores/gameStore';
import portfolioData from '../../data/portfolio.json';

const DataFragment = ({ id, position, onCollect }) => {
    const meshRef = useRef();
    const glowRef = useRef();
    const [collected, setCollected] = useState(false);
    const collectFragment = useGameStore(state => state.collectFragment);
    const collectedFragments = useGameStore(state => state.collectedFragments);

    const isCollected = collectedFragments.includes(id);

    useFrame((state) => {
        if (meshRef.current && !isCollected) {
            // Floating animation
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
            meshRef.current.rotation.y += 0.02;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;

            // Glow pulse
            if (glowRef.current) {
                const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
                glowRef.current.material.emissiveIntensity = pulse;
            }
        }
    });

    const handleClick = () => {
        if (!isCollected) {
            collectFragment(id);
            setCollected(true);
            onCollect && onCollect(id);
        }
    };

    if (isCollected) return null;

    return (
        <group ref={meshRef} position={position} onClick={handleClick}>
            {/* Core crystal */}
            <mesh>
                <octahedronGeometry args={[0.4]} />
                <meshStandardMaterial
                    color="#00E5FF"
                    emissive="#00E5FF"
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Outer glow */}
            <mesh ref={glowRef}>
                <octahedronGeometry args={[0.6]} />
                <meshStandardMaterial
                    color="#00C2D1"
                    emissive="#00C2D1"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Orbit ring */}
            <mesh rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[0.7, 0.02, 16, 32]} />
                <meshStandardMaterial
                    color="#00E5FF"
                    emissive="#00E5FF"
                    emissiveIntensity={0.8}
                />
            </mesh>

            {/* Point light */}
            <pointLight color="#00E5FF" intensity={1} distance={10} />
        </group>
    );
};

const DataFragments = () => {
    const fragments = portfolioData.dataFragments;

    return (
        <group>
            {fragments.map((fragment) => (
                <DataFragment
                    key={fragment.id}
                    id={fragment.id}
                    position={fragment.position}
                />
            ))}
        </group>
    );
};

export default DataFragments;
