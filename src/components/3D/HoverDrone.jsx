import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HoverDrone = ({ position = [0, 2, 0], isMoving = false, moveDirection = { x: 0, y: 0, z: 0 }, debugMode = false }) => {
    const groupRef = useRef();
    const rotorsRef = useRef([]);
    const glowRef = useRef();
    const exhaustRef = useRef();
    const timeRef = useRef(0);

    // Materials
    const materials = useMemo(() => ({
        body: new THREE.MeshStandardMaterial({
            color: '#0B0F17',
            metalness: 0.8,
            roughness: 0.2,
        }),
        edges: new THREE.MeshStandardMaterial({
            color: '#00E5FF',
            emissive: '#00E5FF',
            emissiveIntensity: 0.5,
        }),
        core: new THREE.MeshStandardMaterial({
            color: '#00C2D1',
            emissive: '#00C2D1',
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.9,
        }),
        rotor: new THREE.MeshStandardMaterial({
            color: '#00E5FF',
            emissive: '#00E5FF',
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0.8,
        }),
        wireframe: new THREE.MeshBasicMaterial({
            color: '#00E5FF',
            wireframe: true,
        }),
    }), []);

    // Animation
    useFrame((state, delta) => {
        if (!groupRef.current) return;

        timeRef.current += delta;

        // Idle bobbing
        const bobAmount = Math.sin(timeRef.current * 2) * 0.15;
        groupRef.current.position.y = position[1] + bobAmount;

        // Tilt based on movement
        const targetTiltX = moveDirection.z * 0.3;
        const targetTiltZ = -moveDirection.x * 0.3;

        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            targetTiltX,
            0.1
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
            groupRef.current.rotation.z,
            targetTiltZ,
            0.1
        );

        // Rotor rotation
        rotorsRef.current.forEach((rotor, i) => {
            if (rotor) {
                const speed = isMoving ? 30 : 10;
                rotor.rotation.z += delta * speed * (i % 2 === 0 ? 1 : -1);
            }
        });

        // Underglow pulse
        if (glowRef.current) {
            const pulseIntensity = 0.5 + Math.sin(timeRef.current * 4) * 0.3;
            glowRef.current.material.emissiveIntensity = pulseIntensity;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Main Diamond Body */}
            <mesh material={debugMode ? materials.wireframe : materials.body}>
                <octahedronGeometry args={[0.5, 0]} />
            </mesh>

            {/* Neon Edges */}
            <lineSegments>
                <edgesGeometry args={[new THREE.OctahedronGeometry(0.52, 0)]} />
                <lineBasicMaterial color="#00E5FF" linewidth={2} />
            </lineSegments>

            {/* Pulsing Core */}
            <mesh ref={glowRef} material={materials.core}>
                <sphereGeometry args={[0.2, 16, 16]} />
            </mesh>

            {/* Rotor Arms */}
            {[
                { pos: [0.7, 0, 0.7], idx: 0 },
                { pos: [-0.7, 0, 0.7], idx: 1 },
                { pos: [0.7, 0, -0.7], idx: 2 },
                { pos: [-0.7, 0, -0.7], idx: 3 },
            ].map(({ pos, idx }) => (
                <group key={idx} position={pos}>
                    {/* Arm */}
                    <mesh material={materials.body} rotation={[0, Math.PI / 4, 0]}>
                        <boxGeometry args={[0.08, 0.04, 0.5]} />
                    </mesh>

                    {/* Rotor Disc */}
                    <mesh
                        ref={(el) => (rotorsRef.current[idx] = el)}
                        position={[0, 0.1, 0]}
                        material={materials.rotor}
                    >
                        <cylinderGeometry args={[0.25, 0.25, 0.02, 32]} />
                    </mesh>

                    {/* Rotor Ring */}
                    <mesh position={[0, 0.1, 0]}>
                        <torusGeometry args={[0.28, 0.02, 8, 32]} />
                        <meshStandardMaterial
                            color="#00E5FF"
                            emissive="#00E5FF"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                </group>
            ))}

            {/* Front LED Strip */}
            <mesh position={[0, 0, 0.55]}>
                <boxGeometry args={[0.3, 0.02, 0.02]} />
                <meshStandardMaterial
                    color="#00E5FF"
                    emissive="#00E5FF"
                    emissiveIntensity={1}
                />
            </mesh>

            {/* Underglow Halo */}
            <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.3, 0.5, 32]} />
                <meshStandardMaterial
                    color="#00C2D1"
                    emissive="#00C2D1"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Point Light for glow effect */}
            <pointLight
                color="#00E5FF"
                intensity={isMoving ? 2 : 1}
                distance={5}
                decay={2}
            />
            <pointLight
                color="#00C2D1"
                intensity={0.5}
                distance={3}
                position={[0, -0.5, 0]}
            />

            {/* Exhaust particles (when moving) */}
            {isMoving && (
                <group ref={exhaustRef} position={[0, 0, -0.6]}>
                    {[...Array(5)].map((_, i) => (
                        <mesh
                            key={i}
                            position={[
                                (Math.random() - 0.5) * 0.2,
                                (Math.random() - 0.5) * 0.2,
                                -Math.random() * 0.5,
                            ]}
                        >
                            <sphereGeometry args={[0.02 + Math.random() * 0.02, 8, 8]} />
                            <meshStandardMaterial
                                color="#2F6BFF"
                                emissive="#2F6BFF"
                                emissiveIntensity={1}
                                transparent
                                opacity={0.6}
                            />
                        </mesh>
                    ))}
                </group>
            )}
        </group>
    );
};

export default HoverDrone;
