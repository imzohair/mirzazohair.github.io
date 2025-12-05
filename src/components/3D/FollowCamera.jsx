import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const FollowCamera = ({ target }) => {
    const { camera } = useThree();
    const targetPosition = useRef(new THREE.Vector3());
    const currentLookAt = useRef(new THREE.Vector3());

    useFrame(() => {
        if (!target) return;

        // Camera offset from drone (behind and above)
        const offset = new THREE.Vector3(0, 8, 15);

        // Rotate offset based on drone's rotation
        const rotatedOffset = offset.clone();
        rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -target.rotation);

        // Target position for camera
        targetPosition.current.set(
            target.x + rotatedOffset.x,
            target.y + rotatedOffset.y,
            target.z + rotatedOffset.z
        );

        // Smooth camera movement (lerp)
        camera.position.lerp(targetPosition.current, 0.1);

        // Look at point slightly ahead of drone
        const lookAtPoint = new THREE.Vector3(
            target.x,
            target.y + 2,
            target.z
        );

        currentLookAt.current.lerp(lookAtPoint, 0.1);
        camera.lookAt(currentLookAt.current);
    });

    return null;
};

export default FollowCamera;
