import { useState, useEffect } from 'react';

const useMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isMobileUA = /android|ipad|iphone|ipod/i.test(userAgent.toLowerCase());
            const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth < 1024; // Increased threshold

            // If explicit mobile UA, always true. Otherwise check touch + screen size.
            setIsMobile(isMobileUA || (isTouch && isSmallScreen));
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

export default useMobile;
