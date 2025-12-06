import { useState, useEffect } from 'react';

const useMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth < 768; // Standard tablet/mobile breakpoint
            setIsMobile(isTouch && isSmallScreen);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

export default useMobile;
