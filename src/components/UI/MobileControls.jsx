import { useRef, useEffect, useState } from 'react';
import useGameStore from '../../stores/gameStore';

const MobileControls = () => {
    const setMobileJoystick = useGameStore(state => state.setMobileJoystick);
    const setMobileButton = useGameStore(state => state.setMobileButton);

    const joystickRef = useRef(null);
    const knobRef = useRef(null);
    const [active, setActive] = useState(false);

    // Joystick logic
    useEffect(() => {
        const joystick = joystickRef.current;
        const knob = knobRef.current;

        if (!joystick || !knob) return;

        let startX = 0;
        let startY = 0;
        let moveHandler = null;
        let endHandler = null;

        const handleStart = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            setActive(true);

            moveHandler = (moveEvent) => {
                moveEvent.preventDefault();
                const moveTouch = moveEvent.touches[0];
                const deltaX = moveTouch.clientX - startX;
                const deltaY = moveTouch.clientY - startY;

                const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 40);
                const angle = Math.atan2(deltaY, deltaX);

                const moveX = Math.cos(angle) * distance;
                const moveY = Math.sin(angle) * distance;

                knob.style.transform = `translate(${moveX}px, ${moveY}px)`;

                // Normalizing to -1 to 1
                setMobileJoystick({
                    x: moveX / 40,
                    y: moveY / 40
                });
            };

            endHandler = () => {
                knob.style.transform = `translate(0px, 0px)`;
                setMobileJoystick({ x: 0, y: 0 });
                setActive(false);
                document.removeEventListener('touchmove', moveHandler);
                document.removeEventListener('touchend', endHandler);
            };

            document.addEventListener('touchmove', moveHandler, { passive: false });
            document.addEventListener('touchend', endHandler);
        };

        joystick.addEventListener('touchstart', handleStart, { passive: false });

        return () => {
            if (joystick) joystick.removeEventListener('touchstart', handleStart);
            if (moveHandler) document.removeEventListener('touchmove', moveHandler);
            if (endHandler) document.removeEventListener('touchend', endHandler);
        };
    }, [setMobileJoystick]);

    const handleButton = (btn, pressed) => (e) => {
        if (e) e.preventDefault();
        setMobileButton(btn, pressed);

        // Haptic feedback
        if (pressed && navigator.vibrate) {
            navigator.vibrate(10);
        }
    };

    return (
        <div className="mobile-controls">
            {/* Joystick Area */}
            <div className="joystick-area">
                <div ref={joystickRef} className={`virtual-joystick ${active ? 'active' : ''}`}>
                    <div ref={knobRef} className="knob" />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <button
                    className="control-btn up-btn"
                    onTouchStart={handleButton('up', true)}
                    onTouchEnd={handleButton('up', false)}
                >
                    ▲
                </button>
                <div className="row">
                    <button
                        className="control-btn interact-btn"
                        onTouchStart={handleButton('interact', true)}
                        onTouchEnd={handleButton('interact', false)}
                    >
                        ◎
                    </button>
                    <button
                        className="control-btn down-btn"
                        onTouchStart={handleButton('down', true)}
                        onTouchEnd={handleButton('down', false)}
                    >
                        ▼
                    </button>
                </div>
            </div>

            <style>{`
                .mobile-controls {
                    position: fixed;
                    bottom: 20px;
                    left: 0;
                    right: 0;
                    height: 150px;
                    pointer-events: none;
                    z-index: 9999;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 40px;
                    user-select: none;
                }

                .joystick-area, .action-buttons {
                    pointer-events: auto;
                    display: flex;
                    align-items: center;
                }

                .virtual-joystick {
                    width: 100px;
                    height: 100px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(0, 229, 255, 0.3);
                    border-radius: 50%;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    backdrop-filter: blur(4px);
                    transition: border-color 0.2s;
                }

                .virtual-joystick.active {
                    border-color: rgba(0, 229, 255, 0.8);
                    background: rgba(0, 229, 255, 0.05);
                }

                .knob {
                    width: 40px;
                    height: 40px;
                    background: rgba(0, 229, 255, 0.8);
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
                }

                .action-buttons {
                    flex-direction: column;
                    gap: 10px;
                }

                .row {
                    display: flex;
                    gap: 15px;
                }

                .control-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 1px solid rgba(0, 229, 255, 0.3);
                    background: rgba(13, 21, 32, 0.6);
                    color: #00E5FF;
                    font-size: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    backdrop-filter: blur(4px);
                    outline: none;
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                }

                .control-btn:active {
                    background: rgba(0, 229, 255, 0.2);
                    transform: scale(0.95);
                }

                .interact-btn {
                    width: 60px;
                    height: 60px;
                    border-color: #00E5FF;
                    background: rgba(0, 229, 255, 0.1);
                    font-size: 24px;
                }
            `}</style>
        </div>
    );
};

export default MobileControls;
