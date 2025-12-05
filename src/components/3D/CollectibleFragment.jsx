import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import useGameStore from '../../stores/gameStore';

const CollectibleFragment = ({ position, id }) => {
    const meshRef = useRef();
    const collectedFragments = useGameStore(state => state.collectedFragments);
    const collectFragment = useGameStore(state => state.collectFragment);

    const isCollected = collectedFragments.includes(id);

    useFrame((state) => {
        if (meshRef.current && !isCollected) {
            meshRef.current.rotation.y += 0.02;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
        }
    });

    const handleCollect = () => {
        if (!isCollected) {
            collectFragment(id);
        }
    };

    if (isCollected) return null;

    return (
        <RigidBody
            position={position}
            type="fixed"
            sensor
            onIntersectionEnter={handleCollect}
        >
            <group ref={meshRef}>
                {/* Fragment crystal */}
                <mesh>
                    <octahedronGeometry args={[0.5, 0]} />
                    <meshBasicMaterial
                        color="#00E5FF"
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                {/* Outer glow */}
                <mesh>
                    <octahedronGeometry args={[0.6, 0]} />
                    <meshBasicMaterial
                        color="#00E5FF"
                        transparent
                        opacity={0.3}
                        wireframe
                    />
                </mesh>

                {/* Inner core */}
                <mesh>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshBasicMaterial color="#00C2D1" />
                </mesh>

                {/* Point light */}
                <pointLight color="#00E5FF" intensity={1} distance={8} />

                {/* Rotating particles */}
                {[0, 1, 2, 3].map((i) => (
                    <mesh
                        key={i}
                        position={[
                            Math.cos((i / 4) * Math.PI * 2) * 0.8,
                            0,
                            Math.sin((i / 4) * Math.PI * 2) * 0.8
                        ]}
                    >
                        <sphereGeometry args={[0.08, 8, 8]} />
                        <meshBasicMaterial color="#00E5FF" />
                    </mesh>
                ))}
            </group>
        </RigidBody>
    );
};

export default CollectibleFragment;
