import { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import useGameStore from '../../stores/gameStore';

const InteractiveBuilding = ({
    position,
    type,
    label,
    color = '#00E5FF',
    onEnter
}) => {
    const buildingRef = useRef();
    const visitDistrict = useGameStore(state => state.visitDistrict);

    const handleProximity = () => {
        visitDistrict(type);
        if (onEnter) {
            onEnter(type);
        }
    };

    // Building shapes based on type
    const getBuildingGeometry = () => {
        switch (type) {
            case 'about':
                return { shape: 'box', size: [12, 15, 12] };
            case 'skills':
                return { shape: 'box', size: [8, 25, 8] };
            case 'experience':
                return { shape: 'box', size: [18, 12, 10] };
            case 'education':
                return { shape: 'cylinder', size: [8, 18, 16] };
            case 'contact':
                return { shape: 'box', size: [10, 20, 10] };
            default:
                return { shape: 'box', size: [10, 15, 10] };
        }
    };

    const geometry = getBuildingGeometry();

    return (
        <group position={position}>
            {/* Invisible proximity trigger */}
            <RigidBody
                type="fixed"
                sensor
                onIntersectionEnter={handleProximity}
            >
                <mesh visible={false}>
                    <sphereGeometry args={[15]} />
                </mesh>
            </RigidBody>

            {/* Building structure */}
            <RigidBody type="fixed" colliders="cuboid">
                <group>
                    {/* Main building body */}
                    <mesh castShadow receiveShadow position={[0, geometry.size[1] / 2, 0]}>
                        {geometry.shape === 'box' ? (
                            <boxGeometry args={geometry.size} />
                        ) : (
                            <cylinderGeometry args={[geometry.size[0], geometry.size[0], geometry.size[1], geometry.size[2]]} />
                        )}
                        <meshStandardMaterial
                            color="#0a0a15"
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </mesh>

                    {/* Neon edges */}
                    <lineSegments position={[0, geometry.size[1] / 2, 0]}>
                        {geometry.shape === 'box' ? (
                            <edgesGeometry args={[new THREE.BoxGeometry(...geometry.size)]} />
                        ) : (
                            <edgesGeometry args={[new THREE.CylinderGeometry(geometry.size[0], geometry.size[0], geometry.size[1], geometry.size[2])]} />
                        )}
                        <lineBasicMaterial color={color} linewidth={2} />
                    </lineSegments>

                    {/* Glowing top */}
                    <mesh position={[0, geometry.size[1] + 0.3, 0]}>
                        {geometry.shape === 'box' ? (
                            <boxGeometry args={[geometry.size[0] + 0.5, 0.5, geometry.size[2] + 0.5]} />
                        ) : (
                            <cylinderGeometry args={[geometry.size[0] + 0.3, geometry.size[0] + 0.3, 0.5, 32]} />
                        )}
                        <meshBasicMaterial color={color} />
                    </mesh>

                    {/* Vertical neon strip */}
                    <mesh position={[geometry.size[0] / 2 + 0.1, geometry.size[1] / 2, 0]}>
                        <boxGeometry args={[0.2, geometry.size[1] * 0.8, 0.2]} />
                        <meshBasicMaterial color={color} />
                    </mesh>

                    {/* Point light */}
                    <pointLight
                        position={[0, geometry.size[1] + 2, 0]}
                        color={color}
                        intensity={2}
                        distance={30}
                    />

                    {/* Floating label */}
                    <Float speed={2} floatIntensity={0.3}>
                        <Text
                            position={[0, geometry.size[1] + 5, 0]}
                            fontSize={2}
                            color={color}
                            anchorX="center"
                            anchorY="middle"
                        >
                            {label}
                        </Text>
                    </Float>

                    {/* Platform base */}
                    <mesh position={[0, 0.3, 0]} receiveShadow>
                        <cylinderGeometry args={[geometry.size[0] + 3, geometry.size[0] + 3, 0.5, 6]} />
                        <meshStandardMaterial
                            color="#0a0a15"
                            metalness={0.7}
                            roughness={0.3}
                        />
                    </mesh>

                    {/* Platform glow ring */}
                    <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[geometry.size[0] + 2, geometry.size[0] + 3, 6]} />
                        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
                    </mesh>
                </group>
            </RigidBody>
        </group>
    );
};

export default InteractiveBuilding;
