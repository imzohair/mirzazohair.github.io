import { useState, useEffect } from 'react';

const useMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isMobileUA = /android|ipad|iphone|ipod/i.test(userAgent.toLowerCase());
            const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth < 1024; // Increased threshold

            const isForceMobile = new URLSearchParams(window.location.search).has('mobile');

            // If explicit mobile UA or Force Mobile param, always true. Otherwise check touch + screen size.
            setIsMobile(isForceMobile || isMobileUA || (isTouch && isSmallScreen));
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

export default useMobile;
