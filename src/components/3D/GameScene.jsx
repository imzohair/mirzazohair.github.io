import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import useGameStore from '../../stores/gameStore';
import soundManager from '../../utils/soundManager';
import useMobile from '../../hooks/useMobile';

// Smooth Drone with SLOWER controls
const SmoothDrone = ({ onPositionChange }) => {
    const droneRef = useRef();
    const keysPressed = useRef({ w: false, a: false, s: false, d: false, space: false, shift: false });
    const velocityRef = useRef(new THREE.Vector3());
    const rotationRef = useRef(0);
    const targetRotationRef = useRef(0);
    const isMovingRef = useRef(false);

    const mobileControls = useGameStore(state => state.mobileControls);

    const handleKeyDown = (e) => {
        const key = e.key.toLowerCase();
        if (key === 'w') keysPressed.current.w = true;
        if (key === 'a') keysPressed.current.a = true;
        if (key === 's') keysPressed.current.s = true;
        if (key === 'd') keysPressed.current.d = true;
        if (key === ' ') { e.preventDefault(); keysPressed.current.space = true; }
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

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            soundManager.stopDroneHum(); // Stop sound on unmount
        };
    }, []);

    useFrame((state, delta) => {
        if (!droneRef.current) return;

        const keys = keysPressed.current;

        // Combine Keyboard & Mobile Inputs
        // Mobile axes: y is inverted on screen (up is negative), but for 3D forward we want negative Z.
        // Joystick up (negative Y) -> Forward (Negative Z)
        // Joystick down (positive Y) -> Backward (Positive Z)
        // Joystick left (negative X) -> Turn Left
        // Joystick right (positive X) -> Turn Right

        const inputForward = keys.w ? 1 : keys.s ? -1 : -mobileControls.joystick.y;
        const inputTurn = keys.d ? -1 : keys.a ? 1 : -mobileControls.joystick.x;
        const inputUp = keys.space || mobileControls.buttons.up;
        const inputDown = keys.shift || mobileControls.buttons.down;

        const acceleration = 0.1;
        const turnSpeed = 0.025;
        const maxSpeed = 0.3;

        // Check if any movement is happening
        const isMoving = Math.abs(inputForward) > 0.1 || Math.abs(inputTurn) > 0.1 || inputUp || inputDown;

        // Start/stop drone hum based on movement
        if (isMoving && !isMovingRef.current) {
            soundManager.startDroneHum();
            isMovingRef.current = true;
        } else if (!isMoving && isMovingRef.current) {
            soundManager.stopDroneHum();
            isMovingRef.current = false;
        }

        // Smooth rotation
        if (Math.abs(inputTurn) > 0.1) {
            targetRotationRef.current += inputTurn * turnSpeed; // Note: inputTurn is already signed correctly
        }

        // Lerp rotation for smoothness
        rotationRef.current = THREE.MathUtils.lerp(rotationRef.current, targetRotationRef.current, 0.1);

        // Movement in direction drone is facing
        const forward = new THREE.Vector3(
            Math.sin(rotationRef.current),
            0,
            Math.cos(rotationRef.current)
        );

        if (Math.abs(inputForward) > 0.1) {
            velocityRef.current.x += forward.x * acceleration * inputForward;
            velocityRef.current.z += forward.z * acceleration * inputForward;
        }

        if (inputUp) {
            velocityRef.current.y += acceleration;
        }
        if (inputDown) {
            velocityRef.current.y -= acceleration;
        }

        // Cap maximum speed
        const horizontalSpeed = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.z ** 2);
        if (horizontalSpeed > maxSpeed) {
            const scale = maxSpeed / horizontalSpeed;
            velocityRef.current.x *= scale;
            velocityRef.current.z *= scale;
        }
        if (Math.abs(velocityRef.current.y) > maxSpeed) {
            velocityRef.current.y = Math.sign(velocityRef.current.y) * maxSpeed;
        }

        // Apply velocity
        droneRef.current.position.x += velocityRef.current.x;
        droneRef.current.position.y += velocityRef.current.y;
        droneRef.current.position.z += velocityRef.current.z;

        // Stronger drag for smoother stop
        velocityRef.current.multiplyScalar(0.92);

        // Update rotation smoothly
        droneRef.current.rotation.y = rotationRef.current;

        // Tilt based on velocity (like real drone)
        const tiltAmount = 0.1;
        droneRef.current.rotation.x = THREE.MathUtils.lerp(
            droneRef.current.rotation.x,
            -velocityRef.current.z * tiltAmount,
            0.1
        );
        droneRef.current.rotation.z = THREE.MathUtils.lerp(
            droneRef.current.rotation.z,
            velocityRef.current.x * tiltAmount,
            0.1
        );

        // Keep above ground
        if (droneRef.current.position.y < 2) {
            droneRef.current.position.y = 2;
            velocityRef.current.y = Math.max(0, velocityRef.current.y);
        }

        // Notify parent
        if (onPositionChange) {
            onPositionChange({
                x: droneRef.current.position.x,
                y: droneRef.current.position.y,
                z: droneRef.current.position.z,
                rotation: rotationRef.current
            });
        }
    });

    return (
        <group ref={droneRef} position={[0, 5, 0]}>
            {/* Drone Body - more detailed */}
            <mesh castShadow>
                <octahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial
                    color="#0D1520"
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#00E5FF"
                    emissiveIntensity={0.4}
                />
            </mesh>

            {/* Neon edges */}
            <lineSegments>
                <edgesGeometry args={[new THREE.OctahedronGeometry(0.82, 0)]} />
                <lineBasicMaterial color="#00E5FF" linewidth={2} />
            </lineSegments>

            {/* Core sphere */}
            <mesh>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color="#00C2D1" transparent opacity={0.8} />
            </mesh>

            {/* Rotors with animation */}
            {[[0.9, 0, 0.9], [-0.9, 0, 0.9], [0.9, 0, -0.9], [-0.9, 0, -0.9]].map((pos, i) => (
                <group key={i} position={pos}>
                    <mesh position={[0, 0.2, 0]} rotation={[0, Math.PI * Math.random(), 0]}>
                        <cylinderGeometry args={[0.35, 0.35, 0.05, 16]} />
                        <meshBasicMaterial color="#00E5FF" transparent opacity={0.7} />
                    </mesh>
                    {/* Rotor ring */}
                    <mesh position={[0, 0.2, 0]}>
                        <torusGeometry args={[0.37, 0.03, 8, 16]} />
                        <meshBasicMaterial color="#00E5FF" />
                    </mesh>
                </group>
            ))}

            {/* Underglow - brighter */}
            <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.5, 0.9, 32]} />
                <meshBasicMaterial color="#00C2D1" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>

            {/* Front LED */}
            <mesh position={[0, 0, 0.9]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshBasicMaterial color="#FFFFFF" />
            </mesh>

            {/* Stronger light */}
            <pointLight color="#00E5FF" intensity={3} distance={20} decay={2} />
        </group>
    );
};

// Smoother Follow Camera
const SmoothFollowCam = ({ target }) => {
    const { camera } = useThree();
    const currentPosRef = useRef(new THREE.Vector3(0, 15, 25));
    const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

    useFrame(() => {
        if (!target) return;

        // Camera offset - FIXED: now shows front properly
        const offset = new THREE.Vector3(0, 10, -18); // NEGATIVE Z to position behind
        const rotatedOffset = offset.clone();
        rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), target.rotation); // POSITIVE rotation

        // Target camera position
        const targetPos = new THREE.Vector3(
            target.x + rotatedOffset.x,
            target.y + rotatedOffset.y,
            target.z + rotatedOffset.z
        );

        // Smooth follow with lerp
        currentPosRef.current.lerp(targetPos, 0.08);
        camera.position.copy(currentPosRef.current);

        // Look at target
        const lookAtTarget = new THREE.Vector3(target.x, target.y + 1, target.z);
        currentLookAtRef.current.lerp(lookAtTarget, 0.08);
        camera.lookAt(currentLookAtRef.current);
    });

    return null;
};

// Improved Building with ACCURATE proximity detection
const ImprovedBuilding = ({ position, label, color, type, onApproach, onLeave, dronePosition }) => {
    const buildingRef = useRef();
    const wasNearRef = useRef(false);

    useFrame(() => {
        if (!buildingRef.current || !dronePosition) return;

        // Use actual drone position passed from parent
        const dronePos = new THREE.Vector3(dronePosition.x, dronePosition.y, dronePosition.z);
        const buildingPos = buildingRef.current.position;
        const distance = dronePos.distanceTo(buildingPos);

        const proximityRange = 20; // Detection range

        if (distance < proximityRange && !wasNearRef.current) {
            wasNearRef.current = true;
            if (onApproach) onApproach(type);
        } else if (distance >= proximityRange && wasNearRef.current) {
            wasNearRef.current = false;
            if (onLeave) onLeave();
        }
    });

    return (
        <group ref={buildingRef} position={position}>
            {/* Building - better proportions */}
            <mesh position={[0, 10, 0]} castShadow receiveShadow>
                <boxGeometry args={[12, 20, 12]} />
                <meshStandardMaterial
                    color="#0D1520"
                    metalness={0.85}
                    roughness={0.15}
                />
            </mesh>

            {/* Neon edges */}
            <lineSegments position={[0, 10, 0]}>
                <edgesGeometry args={[new THREE.BoxGeometry(12, 20, 12)]} />
                <lineBasicMaterial color={color} linewidth={2} />
            </lineSegments>

            {/* Glowing top */}
            <mesh position={[0, 20.3, 0]}>
                <boxGeometry args={[12.5, 0.5, 12.5]} />
                <meshBasicMaterial color={color} />
            </mesh>

            {/* Vertical neon strips */}
            {[-5, 5].map((x, i) => (
                <mesh key={i} position={[x, 10, 6.1]}>
                    <boxGeometry args={[0.15, 16, 0.15]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            ))}

            {/* Platform */}
            <mesh position={[0, 0.3, 0]} receiveShadow>
                <cylinderGeometry args={[15, 15, 0.6, 6]} />
                <meshStandardMaterial color="#0D1520" metalness={0.75} roughness={0.25} />
            </mesh>

            {/* Platform ring glow */}
            <mesh position={[0, 0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[14, 15, 6]} />
                <meshBasicMaterial color={color} side={THREE.DoubleSide} />
            </mesh>

            {/* Center platform glow */}
            <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[4, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>

            {/* Floating label */}
            <Float speed={2} floatIntensity={0.4}>
                <Text position={[0, 24, 0]} fontSize={2.5} color={color} anchorX="center" fontWeight="bold">
                    {label}
                </Text>
            </Float>

            {/* Stronger light */}
            <pointLight position={[0, 22, 0]} color={color} intensity={4} distance={40} decay={2} />
        </group>
    );
};

// Fragment component - FIXED HEIGHT
const Fragment = ({ position, id, dronePosition }) => {
    const meshRef = useRef();
    const collectedFragments = useGameStore(state => state.collectedFragments);
    const collectFragment = useGameStore(state => state.collectFragment);
    const isCollected = collectedFragments.includes(id);

    useFrame((state) => {
        if (!meshRef.current || isCollected || !dronePosition) return;

        meshRef.current.rotation.y += 0.025;
        meshRef.current.rotation.x += 0.015;

        // Gentle bobbing at fixed height
        const baseY = position[1];
        meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 2) * 0.3;

        // Check collision with actual drone position
        const dronePos = new THREE.Vector3(dronePosition.x, dronePosition.y, dronePosition.z);
        const distance = meshRef.current.position.distanceTo(dronePos);

        if (distance < 2.5) {
            // Play sound and collect
            import('../../utils/soundManager').then(({ default: soundManager }) => {
                soundManager.collectFragment();
            });
            collectFragment(id);
        }
    });

    if (isCollected) return null;

    return (
        <group ref={meshRef} position={position}>
            {/* Crystal */}
            <mesh>
                <octahedronGeometry args={[0.6, 0]} />
                <meshStandardMaterial
                    color="#00E5FF"
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#00E5FF"
                    emissiveIntensity={0.8}
                />
            </mesh>

            {/* Outer glow */}
            <mesh>
                <octahedronGeometry args={[0.75, 0]} />
                <meshBasicMaterial color="#00E5FF" transparent opacity={0.25} wireframe />
            </mesh>

            {/* Inner core */}
            <mesh>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshBasicMaterial color="#FFFFFF" />
            </mesh>

            {/* Point light */}
            <pointLight color="#00E5FF" intensity={2} distance={12} />
        </group>
    );
};

const GameScene = ({ onPanelTrigger, onPanelLeave }) => {
    const [dronePos, setDronePos] = useState({ x: 0, y: 5, z: 0, rotation: 0 });
    const openPanel = useGameStore(state => state.openPanel);
    const closePanel = useGameStore(state => state.closePanel);
    const activePanel = useGameStore(state => state.activePanel);
    const isMobile = useMobile();

    const buildings = [
        { pos: [0, 0, 0], label: 'ABOUT', color: '#00E5FF', type: 'about' },
        { pos: [0, 0, 45], label: 'SKILLS', color: '#2F6BFF', type: 'skills' },
        { pos: [45, 0, 0], label: 'EXPERIENCE', color: '#A066FF', type: 'experience' },
        { pos: [-45, 0, 0], label: 'EDUCATION', color: '#00C2D1', type: 'education' },
        { pos: [0, 0, -45], label: 'CONTACT', color: '#00E5FF', type: 'contact' },
    ];

    // ALL FRAGMENTS AT DRONE HEIGHT (y=5)
    const fragments = [
        { id: 'frag_1', pos: [12, 5, 18] },
        { id: 'frag_2', pos: [-18, 5, 22] },
        { id: 'frag_3', pos: [28, 5, -12] },
        { id: 'frag_4', pos: [-32, 5, 8] },
        { id: 'frag_5', pos: [8, 5, -32] },
        { id: 'frag_6', pos: [22, 5, 28] },
        { id: 'frag_7', pos: [-22, 5, -18] },
        { id: 'frag_8', pos: [38, 5, 18] },
        { id: 'frag_9', pos: [-28, 5, -28] },
        { id: 'frag_10', pos: [0, 8, 0] }, // One slightly higher
    ];

    const handleBuildingProximity = (type) => {
        // Notify parent that we're near a building (don't auto-open)
        if (onPanelTrigger) {
            onPanelTrigger(type);
        }
    };

    const handleBuildingLeave = () => {
        // Notify parent when leaving building range
        if (onPanelLeave) {
            onPanelLeave();
        }
    };

    // ESC key to close panel
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && activePanel) {
                closePanel();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [activePanel, closePanel]);

    return (
        <div className="canvas-container">
            <Canvas
                shadows={!isMobile} // Disable shadows on mobile
                camera={{ position: [0, 15, 25], fov: isMobile ? 75 : 65, near: 0.1, far: 500 }}
                dpr={isMobile ? [1, 1] : [1, 1.5]} // Lower DPR on mobile
                gl={{ antialias: true, powerPreference: 'high-performance' }}
            >
                <Suspense fallback={null}>
                    {/* Better lighting */}
                    <ambientLight intensity={0.4} color="#E6F1FF" />
                    <directionalLight
                        position={[60, 100, 60]}
                        intensity={0.9}
                        color="#ffffff"
                        castShadow={!isMobile} // Disable shadow casting
                        shadow-mapSize-width={isMobile ? 512 : 2048}
                        shadow-mapSize-height={isMobile ? 512 : 2048}
                    />
                    <hemisphereLight intensity={0.3} color="#00E5FF" groundColor="#0a0a15" />

                    {/* Sky */}
                    <color attach="background" args={['#030308']} />
                    <fog attach="fog" args={['#030308', 60, isMobile ? 120 : 180]} />
                    <Stars radius={180} depth={100} count={isMobile ? 1000 : 3000} factor={5} fade speed={0.4} />

                    {/* Ground - better material */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                        <planeGeometry args={[250, 250]} />
                        <meshStandardMaterial
                            color="#050510"
                            metalness={0.4}
                            roughness={0.7}
                        />
                    </mesh>

                    {/* Grid - more subtle */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                        <planeGeometry args={[250, 250, 50, 50]} />
                        <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.08} />
                    </mesh>

                    {/* Drone */}
                    <SmoothDrone onPositionChange={setDronePos} />

                    {/* Buildings - pass drone position */}
                    {buildings.map((b, i) => (
                        <ImprovedBuilding
                            key={i}
                            position={b.pos}
                            label={b.label}
                            color={b.color}
                            type={b.type}
                            dronePosition={dronePos}
                            onApproach={handleBuildingProximity}
                            onLeave={handleBuildingLeave}
                        />
                    ))}

                    {/* Fragments - pass drone position */}
                    {fragments.map((f) => (
                        <Fragment key={f.id} id={f.id} position={f.pos} dronePosition={dronePos} />
                    ))}

                    {/* Camera */}
                    <SmoothFollowCam target={dronePos} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default GameScene;
