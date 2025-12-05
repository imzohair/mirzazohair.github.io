import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

const PhysicsDrone = ({ onPositionChange }) => {
    const droneRef = useRef();
    const keysPressed = useRef({ w: false, a: false, s: false, d: false, space: false, shift: false });

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            if (key === 'w') keysPressed.current.w = true;
            if (key === 'a') keysPressed.current.a = true;
            if (key === 's') keysPressed.current.s = true;
            if (key === 'd') keysPressed.current.d = true;
            if (key === ' ') keysPressed.current.space = true;
            if (key === 'shift') keysPressed.current.shift = true;
        };

        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase();
            if (key === 'w') keysPressed.current.w = false;
            if (key === 'a') keysPressed.current.a = false;
            if (key === 's') keysPressed.current.s = false;
            if (key === 'd') keysPressed.current.d = false;
            if (key === ' ') keysPressed.current.space = false;
            if (key === 'shift') keysPressed.current.shift = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame(() => {
        if (!droneRef.current) return;

        const drone = droneRef.current;
        const keys = keysPressed.current;

        // Get current velocity and position
        const velocity = drone.linvel();
        const position = drone.translation();

        // Movement forces
        const moveForce = 15;
        const liftForce = 20;
        const turnSpeed = 2;

        // Get drone's current rotation
        const rotation = drone.rotation();
        const euler = new THREE.Euler().setFromQuaternion(rotation);

        // Calculate forward direction based on Y rotation
        const forward = new THREE.Vector3(
            Math.sin(euler.y),
            0,
            Math.cos(euler.y)
        );
        const right = new THREE.Vector3(
            Math.cos(euler.y),
            0,
            -Math.sin(euler.y)
        );

        // Apply forces based on input
        const impulse = { x: 0, y: 0, z: 0 };

        if (keys.w) {
            impulse.x += forward.x * moveForce;
            impulse.z += forward.z * moveForce;
        }
        if (keys.s) {
            impulse.x -= forward.x * moveForce;
            impulse.z -= forward.z * moveForce;
        }

        // Rotation
        if (keys.a) {
            drone.setAngvel({ x: 0, y: turnSpeed, z: 0 }, true);
        } else if (keys.d) {
            drone.setAngvel({ x: 0, y: -turnSpeed, z: 0 }, true);
        } else {
            drone.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }

        // Lift
        if (keys.space) {
            impulse.y += liftForce;
        }
        if (keys.shift) {
            impulse.y -= liftForce;
        }

        // Hover force (gentle upward force to prevent crashing)
        if (position.y < 3 && !keys.shift) {
            impulse.y += 8;
        }

        // Apply impulse
        drone.applyImpulse(impulse, true);

        // Drag (slow down over time)
        drone.setLinvel({
            x: velocity.x * 0.95,
            y: velocity.y * 0.98,
            z: velocity.z * 0.95
        }, true);

        // Notify parent of position change
        if (onPositionChange) {
            onPositionChange({
                x: position.x,
                y: position.y,
                z: position.z,
                rotation: euler.y
            });
        }
    });

    return (
        <RigidBody
            ref={droneRef}
            position={[0, 5, 0]}
            mass={1}
            linearDamping={0.5}
            angularDamping={0.8}
            enabledRotations={[false, true, false]} // Only allow Y-axis rotation
        >
            <group>
                {/* Drone Body - Diamond shape */}
                <mesh castShadow>
                    <octahedronGeometry args={[0.8, 0]} />
                    <meshStandardMaterial
                        color="#0a0a15"
                        metalness={0.9}
                        roughness={0.1}
                        emissive="#00E5FF"
                        emissiveIntensity={0.2}
                    />
                </mesh>

                {/* Neon edges */}
                <lineSegments>
                    <edgesGeometry args={[new THREE.OctahedronGeometry(0.82, 0)]} />
                    <lineBasicMaterial color="#00E5FF" linewidth={2} />
                </lineSegments>

                {/* Rotor discs */}
                {[
                    [0.9, 0, 0.9],
                    [-0.9, 0, 0.9],
                    [0.9, 0, -0.9],
                    [-0.9, 0, -0.9]
                ].map((pos, i) => (
                    <group key={i} position={pos}>
                        <mesh position={[0, 0.2, 0]}>
                            <cylinderGeometry args={[0.35, 0.35, 0.05, 16]} />
                            <meshBasicMaterial color="#00E5FF" transparent opacity={0.7} />
                        </mesh>
                    </group>
                ))}

                {/* Underglow */}
                <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.5, 0.8, 32]} />
                    <meshBasicMaterial color="#00C2D1" transparent opacity={0.5} />
                </mesh>

                {/* Front indicator LED */}
                <mesh position={[0, 0, 0.9]}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshBasicMaterial color="#00E5FF" />
                </mesh>

                {/* Point light for glow */}
                <pointLight color="#00E5FF" intensity={1} distance={10} />
            </group>
        </RigidBody>
    );
};

export default PhysicsDrone;
