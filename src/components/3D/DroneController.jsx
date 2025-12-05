import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import useGameStore from '../../stores/gameStore';

const DroneController = ({ droneRef, onMove }) => {
    const { camera, gl } = useThree();
    const controlsRef = useRef();
    const velocityRef = useRef(new THREE.Vector3());
    const directionRef = useRef(new THREE.Vector3());
    const keysRef = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false,
    });

    const updateFlightStats = useGameStore(state => state.updateFlightStats);
    const addXP = useGameStore(state => state.addXP);

    const speed = 15;
    const damping = 0.92;
    const maxVelocity = 25;
    const flightTimeRef = useRef(0);
    const lastPositionRef = useRef(new THREE.Vector3());

    // Keyboard handlers
    const handleKeyDown = useCallback((event) => {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                keysRef.current.forward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                keysRef.current.backward = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                keysRef.current.left = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                keysRef.current.right = true;
                break;
            case 'Space':
                keysRef.current.up = true;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                keysRef.current.down = true;
                break;
            default:
                break;
        }
    }, []);

    const handleKeyUp = useCallback((event) => {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                keysRef.current.forward = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                keysRef.current.backward = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                keysRef.current.left = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                keysRef.current.right = false;
                break;
            case 'Space':
                keysRef.current.up = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                keysRef.current.down = false;
                break;
            default:
                break;
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // Lock pointer on click
        const handleClick = () => {
            if (controlsRef.current) {
                controlsRef.current.lock();
            }
        };
        gl.domElement.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            gl.domElement.removeEventListener('click', handleClick);
        };
    }, [gl, handleKeyDown, handleKeyUp]);

    useFrame((state, delta) => {
        const velocity = velocityRef.current;
        const direction = directionRef.current;
        const keys = keysRef.current;

        // Calculate movement direction
        direction.z = Number(keys.forward) - Number(keys.backward);
        direction.x = Number(keys.right) - Number(keys.left);
        direction.y = Number(keys.up) - Number(keys.down);
        direction.normalize();

        // Apply acceleration
        if (keys.forward || keys.backward) {
            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);
            forward.y = 0;
            forward.normalize();
            velocity.add(forward.multiplyScalar(direction.z * speed * delta));
        }

        if (keys.left || keys.right) {
            const right = new THREE.Vector3();
            camera.getWorldDirection(right);
            right.cross(camera.up);
            right.y = 0;
            right.normalize();
            velocity.add(right.multiplyScalar(direction.x * speed * delta));
        }

        if (keys.up || keys.down) {
            velocity.y += direction.y * speed * delta;
        }

        // Apply damping
        velocity.multiplyScalar(damping);

        // Clamp velocity
        if (velocity.length() > maxVelocity) {
            velocity.normalize().multiplyScalar(maxVelocity);
        }

        // Update camera position
        camera.position.add(velocity.clone().multiplyScalar(delta * 60));

        // Clamp camera height
        camera.position.y = Math.max(2, Math.min(camera.position.y, 80));

        // Clamp to city bounds
        camera.position.x = Math.max(-80, Math.min(camera.position.x, 80));
        camera.position.z = Math.max(-80, Math.min(camera.position.z, 80));

        // Track flight stats
        const isMoving = velocity.length() > 0.1;
        if (isMoving) {
            flightTimeRef.current += delta;

            const distance = camera.position.distanceTo(lastPositionRef.current);

            if (flightTimeRef.current > 1) {
                updateFlightStats({
                    flightTime: delta,
                    altitude: camera.position.y,
                    speed: velocity.length(),
                    distance: distance,
                });
                flightTimeRef.current = 0;
            }
        }

        lastPositionRef.current.copy(camera.position);

        // Notify parent of movement
        if (onMove) {
            onMove({
                position: camera.position.clone(),
                velocity: velocity.clone(),
                isMoving,
                direction: {
                    x: direction.x,
                    y: direction.y,
                    z: direction.z,
                },
            });
        }
    });

    return (
        <PointerLockControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
        />
    );
};

export default DroneController;
