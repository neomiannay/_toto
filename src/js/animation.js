import { gsap } from "gsap";

window.addEventListener('load', () => {

        const loader = document.querySelector('.loader');
        const loaderTitle = document.querySelector('.loader-title');

        const tl = gsap.timeline();
    
        tl.to(loaderTitle, {
            duration: 0.5,
            opacity: 1,
            y: -30,
            delay: 0.5,
            ease: "power3.easeIn"
        });
    
        tl.to(loaderTitle, {
            duration: 1,
            '--font-weight': 1000,
            '--font-midline': 1,
            ease: 'power2.out',
            onUpdate: () => {
                const fontWeight = gsap.getProperty(loaderTitle, '--font-weight');
                const fontMidline = gsap.getProperty(loaderTitle, '--font-midline');
                loaderTitle.style.fontVariationSettings = `'wght' ${fontWeight}, 'MIDL' ${fontMidline}, 'CONT' -1000`;
            }
        });
        tl.to(loaderTitle, {
            duration: 0.5,
            '--font-contrast': 1000,
            ease: 'power2.out',
            delay: .5,
            onUpdate: () => {
                const fontContrast = gsap.getProperty(loaderTitle, '--font-contrast');
                loaderTitle.style.fontVariationSettings = `'wght' 1000, 'MIDL' 1, 'CONT' ${fontContrast}`;
            }
        })
    
        tl.to(loader, {
            duration: 1, 
            y: "-100%", 
            ease: "power3.easeInOut",
            delay: 1,
            onComplete: () => {
                document.querySelector('.loader').remove();
            }
        });
});