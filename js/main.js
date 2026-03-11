document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initSpaceScene();
    setCurrentYear();
});

function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    });
}

function initScrollEffects() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav__link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -80% 0px' });

    sections.forEach(section => observer.observe(section));
}

function initAnimations() {
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${index * 0.1}s`;
                entry.target.classList.add('animate-fade-in-up');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

    document.querySelectorAll('.section').forEach(el => {
        el.style.opacity = '0';
        animateOnScroll.observe(el);
    });

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card, .skill-category').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        cardObserver.observe(el);
    });
}

function setCurrentYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.getElementById('nav')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ================================
// FLYING THROUGH SPACE
// ================================

function initSpaceScene() {
    const canvas = document.getElementById('spaceCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, centerX, centerY;
    let animationId;
    let time = 0;
    
    // Flight speed
    const flightSpeed = 0.8;

    // 3D Stars flying past
    const stars = [];
    const starCount = 400;
    const starDepth = 1500;

    // Gas clouds with depth - colorful clouds to fly through
    const gasClouds = [];
    const maxGasClouds = 20;

    // Space encounters - only one major object visible at a time
    // Types: planet, blackHole, debris, spaceStation, alienShip
    let currentEncounter = null;
    let lastEncounterType = null;
    const encounterSpawnChance = 0.015; // Higher chance for more frequent encounters
    const recentPlanetTypes = []; // Track recent planet types to avoid repetition

    // Comets flying across
    const comets = [];
    const maxComets = 3;

    // Bright stars
    const brightStars = [];
    const maxBrightStars = 5;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centerX = width / 2;
        centerY = height / 2;
        initStars();
        initGasClouds();
        
        // Initialize encounter and bright stars
        if (!currentEncounter) {
            currentEncounter = createPlanet(true); // Start with a planet mid-flight
        }
        if (brightStars.length === 0) {
            for (let i = 0; i < 3; i++) {
                brightStars.push(createBrightStar(true)); // Initial spawn distributed
            }
        }
    }

    function initStars() {
        stars.length = 0;
        for (let i = 0; i < starCount; i++) {
            stars.push(createStar());
        }
    }

    function createStar() {
        // Natural star colors - mostly white with slight variations
        const colorVariants = [
            [255, 255, 255],     // White
            [255, 255, 240],     // Warm white
            [240, 245, 255],     // Cool white
            [255, 250, 230],     // Slightly yellow
            [230, 240, 255],     // Slightly blue
        ];
        return {
            x: (Math.random() - 0.5) * width * 3,
            y: (Math.random() - 0.5) * height * 3,
            z: Math.random() * starDepth,
            size: 0.5 + Math.random() * 1.5,
            color: colorVariants[Math.floor(Math.random() * colorVariants.length)],
        };
    }

    function resetStar(star) {
        star.x = (Math.random() - 0.5) * width * 3;
        star.y = (Math.random() - 0.5) * height * 3;
        star.z = starDepth;
    }

    function initGasClouds() {
        gasClouds.length = 0;
        for (let i = 0; i < maxGasClouds; i++) {
            gasClouds.push(createGasCloud(true));
        }
    }

    // Global spectrum position for color cycling
    let spectrumHue = 0;
    const spectrumSpeed = 0.025; // Very slow transitions - ~40 seconds per color band

    // Convert HSL to RGB
    function hslToRgb(h, s, l) {
        s /= 100; l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
    }

    function createGasCloud(initialSpawn = false) {
        // Fluffy clouds for immersive flying experience
        const baseRadius = 200 + Math.random() * 500;
        
        let x, y, z;
        let assignedHue;
        
        if (initialSpawn) {
            // Initial clouds spread evenly across different depths for immediate presence
            z = 100 + Math.random() * 1800;
            const spawnScale = 400 / z;
            const angle = Math.random() * Math.PI * 2;
            const maxDist = Math.max(width, height) * 1.5 / spawnScale;
            const dist = Math.random() * maxDist;
            x = Math.cos(angle) * dist;
            y = Math.sin(angle) * dist;
            // Initial clouds get spread across the spectrum based on their depth
            assignedHue = (z / 1800) * 360;
        } else {
            // New clouds spawn very far away for gradual fade-in
            z = 1800 + Math.random() * 600;
            const spawnScale = 400 / z;
            const angle = Math.random() * Math.PI * 2;
            const maxDist = Math.max(width, height) * 1.2 / spawnScale;
            const dist = Math.random() * maxDist;
            x = Math.cos(angle) * dist;
            y = Math.sin(angle) * dist;
            // New clouds get the current spectrum position - fixed for their lifetime
            assignedHue = spectrumHue;
        }
        
        return {
            x, y, z,
            baseRadius,
            assignedHue, // Fixed color for this cloud's lifetime
            saturation: 75 + Math.random() * 20, // 75-95 (very saturated)
            lightness: 55 + Math.random() * 20, // 55-75 (bright and vivid)
            glowLightness: 65 + Math.random() * 20, // 65-85 (bright core)
            opacity: 0.25 + Math.random() * 0.45, // 0.25-0.7 (very dense)
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.002 + Math.random() * 0.006,
            stretch: 0.5 + Math.random() * 0.7,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.008, // Faster rotation
            // Additional variation
            coreSize: 0.3 + Math.random() * 0.4, // Larger, more prominent cores
            fadeStyle: Math.floor(Math.random() * 3),
        };
    }

    function resetGasCloud(cloud) {
        // Spawn very far away so clouds fade in gradually from darkness
        cloud.z = 1800 + Math.random() * 600; // Very far (1800-2400)
        const spawnScale = 400 / cloud.z;
        const angle = Math.random() * Math.PI * 2;
        // Spawn across the field
        const maxDist = Math.max(width, height) * 1.2 / spawnScale;
        const dist = Math.random() * maxDist;
        cloud.x = Math.cos(angle) * dist;
        cloud.y = Math.sin(angle) * dist;
        cloud.baseRadius = 200 + Math.random() * 500;
        // Assign current spectrum position - this cloud keeps this color
        cloud.assignedHue = spectrumHue + (Math.random() - 0.5) * 20; // Small variation
        cloud.saturation = 75 + Math.random() * 20;
        cloud.lightness = 55 + Math.random() * 20;
        cloud.glowLightness = 65 + Math.random() * 20;
        cloud.opacity = 0.25 + Math.random() * 0.45;
        cloud.stretch = 0.5 + Math.random() * 0.7;
        cloud.coreSize = 0.3 + Math.random() * 0.4;
        cloud.fadeStyle = Math.floor(Math.random() * 3);
        // Clear puffs so they get regenerated with new shape
        cloud.puffs = null;
    }

    // Archetypal planet types
    const planetTypes = [
        { 
            type: 'gas-giant',
            colors: [[210, 180, 140], [230, 200, 160], [180, 140, 100], [160, 120, 80]],
            hasBands: true, hasStorm: true, hasRingChance: 0.7,
            ringColor: [220, 200, 170]
        },
        { 
            type: 'ice',
            colors: [[200, 230, 255], [170, 210, 245], [140, 190, 235], [100, 160, 220]],
            hasBands: false, hasStorm: false, hasCracks: true, hasRingChance: 0.3,
            ringColor: [200, 220, 255]
        },
        { 
            type: 'lava',
            colors: [[80, 40, 30], [60, 30, 20], [100, 50, 30], [40, 20, 15]],
            hasBands: false, hasStorm: false, hasLava: true, hasRingChance: 0.05,
            glowColor: [255, 100, 20]
        },
        { 
            type: 'lush',
            colors: [[60, 140, 80], [40, 120, 60], [80, 160, 100], [30, 90, 50]],
            hasBands: false, hasStorm: false, hasOceans: true, hasClouds: true, hasRingChance: 0.1,
            oceanColor: [40, 100, 180]
        },
        { 
            type: 'ocean',
            colors: [[30, 90, 160], [40, 110, 180], [20, 70, 140], [50, 130, 200]],
            hasBands: false, hasStorm: false, hasClouds: true, hasRingChance: 0.1,
        },
        { 
            type: 'desert',
            colors: [[210, 170, 120], [190, 150, 100], [230, 190, 140], [170, 130, 80]],
            hasBands: false, hasStorm: false, hasDunes: true, hasRingChance: 0.1,
        },
        { 
            type: 'ice-giant',
            colors: [[100, 180, 220], [80, 160, 200], [120, 200, 240], [60, 140, 180]],
            hasBands: true, hasStorm: false, hasRingChance: 0.5,
            ringColor: [180, 210, 240]
        },
        { 
            type: 'toxic',
            colors: [[180, 190, 100], [160, 170, 80], [200, 210, 120], [140, 150, 60]],
            hasBands: false, hasStorm: false, hasClouds: true, hasRingChance: 0.1,
            cloudColor: [200, 200, 100]
        },
    ];

    function createPlanet(initialSpawn = false) {
        // Pick a planet type that wasn't recently used
        let typeData;
        let attempts = 0;
        do {
            typeData = planetTypes[Math.floor(Math.random() * planetTypes.length)];
            attempts++;
        } while (recentPlanetTypes.includes(typeData.type) && attempts < 10);
        
        // Track this type to avoid repetition
        recentPlanetTypes.push(typeData.type);
        if (recentPlanetTypes.length > 4) {
            recentPlanetTypes.shift(); // Keep only last 4 types
        }
        
        // Add color variation to this instance
        const colorVariance = 25;
        const variedColors = typeData.colors.map(c => [
            Math.round(Math.min(255, Math.max(0, c[0] + (Math.random() - 0.5) * colorVariance))),
            Math.round(Math.min(255, Math.max(0, c[1] + (Math.random() - 0.5) * colorVariance))),
            Math.round(Math.min(255, Math.max(0, c[2] + (Math.random() - 0.5) * colorVariance))),
        ]);
        
        const hasRing = Math.random() < typeData.hasRingChance;
        
        // Generate ring systems (1-3 sets with different orientations)
        let ringSystems = [];
        if (hasRing) {
            const ringCount = Math.random() < 0.15 ? 3 : Math.random() < 0.35 ? 2 : 1;
            const baseColor = typeData.ringColor || [200, 190, 170];
            
            for (let r = 0; r < ringCount; r++) {
                // Vary color slightly for each ring system
                const colorVariance = r * 20;
                const ringColor = [
                    Math.min(255, baseColor[0] + (Math.random() - 0.5) * colorVariance),
                    Math.min(255, baseColor[1] + (Math.random() - 0.5) * colorVariance),
                    Math.min(255, baseColor[2] + (Math.random() - 0.5) * colorVariance),
                ];
                
                // Different orientations for each ring
                let tilt, rotationAngle;
                if (r === 0) {
                    tilt = 0.2 + Math.random() * 0.3;
                    rotationAngle = 0;
                } else if (r === 1) {
                    // Second ring - different orientation
                    tilt = 0.15 + Math.random() * 0.35;
                    rotationAngle = (Math.random() - 0.5) * 0.8; // Slight rotation offset
                } else {
                    // Third ring - more varied
                    tilt = 0.1 + Math.random() * 0.4;
                    rotationAngle = (Math.random() - 0.5) * 1.2;
                }
                
                ringSystems.push({
                    color: ringColor,
                    tilt: tilt,
                    rotationAngle: rotationAngle,
                    innerRadius: 1.25 + r * 0.35,
                    outerRadius: 1.6 + r * 0.4 + Math.random() * 0.3,
                    opacity: 0.7 - r * 0.15,
                    hasGap: Math.random() > 0.4,
                    gapPosition: 0.3 + Math.random() * 0.4,
                    particleDensity: 3 + Math.floor(Math.random() * 3),
                });
            }
        }
        
        let x, y, z;
        
        if (initialSpawn) {
            // Initial spawn - visible immediately, will fly past
            z = 300 + Math.random() * 400;
            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * 150; // Small offset so it's near center
            x = Math.cos(angle) * dist;
            y = Math.sin(angle) * dist;
        } else {
            // Spawn far away - small world position so it appears near center at distance
            z = 1000 + Math.random() * 400;
            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * 200; // Small world offset
            x = Math.cos(angle) * dist;
            y = Math.sin(angle) * dist;
        }
        
        return {
            encounterType: 'planet',
            x, y, z,
            baseSize: 40 + Math.random() * 100, // More size variation
            planetType: typeData.type,
            colors: variedColors,
            hasBands: typeData.hasBands,
            hasStorm: typeData.hasStorm && Math.random() > 0.4,
            hasCracks: typeData.hasCracks || false,
            hasLava: typeData.hasLava || false,
            hasOceans: typeData.hasOceans || false,
            hasClouds: typeData.hasClouds || false,
            hasDunes: typeData.hasDunes || false,
            glowColor: typeData.glowColor ? [
                Math.round(Math.min(255, Math.max(0, typeData.glowColor[0] + (Math.random() - 0.5) * 30))),
                Math.round(Math.min(255, Math.max(0, typeData.glowColor[1] + (Math.random() - 0.5) * 30))),
                Math.round(Math.min(255, Math.max(0, typeData.glowColor[2] + (Math.random() - 0.5) * 30))),
            ] : null,
            oceanColor: typeData.oceanColor ? [
                Math.round(Math.min(255, Math.max(0, typeData.oceanColor[0] + (Math.random() - 0.5) * 30))),
                Math.round(Math.min(255, Math.max(0, typeData.oceanColor[1] + (Math.random() - 0.5) * 30))),
                Math.round(Math.min(255, Math.max(0, typeData.oceanColor[2] + (Math.random() - 0.5) * 30))),
            ] : null,
            cloudColor: typeData.cloudColor ? [
                Math.round(Math.min(255, Math.max(0, typeData.cloudColor[0] + (Math.random() - 0.5) * 20))),
                Math.round(Math.min(255, Math.max(0, typeData.cloudColor[1] + (Math.random() - 0.5) * 20))),
                Math.round(Math.min(255, Math.max(0, typeData.cloudColor[2] + (Math.random() - 0.5) * 20))),
            ] : null,
            stormPos: { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.3 },
            stormSize: 0.12 + Math.random() * 0.12, // Vary storm size
            hasRing: hasRing,
            ringSystems: ringSystems,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: 0.001 + Math.random() * 0.003, // Vary rotation speed
            bandOffset: Math.random() * 1000,
            bandCount: 6 + Math.floor(Math.random() * 6), // Vary number of bands
            crackSeed: Math.random() * 10000,
            crackCount: 4 + Math.floor(Math.random() * 5), // Vary crack count
            cloudCount: 3 + Math.floor(Math.random() * 4), // Vary cloud count
            oceanCount: 2 + Math.floor(Math.random() * 3), // Vary ocean patches
        };
    }

    function createBlackHole() {
        const spawnZ = 1000 + Math.random() * 400;
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 150;
        
        return {
            type: 'blackHole',
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            z: spawnZ,
            baseSize: 50 + Math.random() * 70,
            warpPhase: Math.random() * Math.PI * 2,
        };
    }

    function createDebris() {
        const spawnZ = 1000 + Math.random() * 400;
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 150;
        
        // Generate random debris pieces
        const pieceCount = 8 + Math.floor(Math.random() * 12);
        const pieces = [];
        for (let i = 0; i < pieceCount; i++) {
            const pieceAngle = Math.random() * Math.PI * 2;
            const pieceDist = Math.random() * 0.8;
            pieces.push({
                x: Math.cos(pieceAngle) * pieceDist,
                y: Math.sin(pieceAngle) * pieceDist,
                size: 0.1 + Math.random() * 0.3,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.05,
                color: Math.random() > 0.3 ? [80, 80, 90] : [60, 50, 40],
            });
        }
        
        return {
            type: 'debris',
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            z: spawnZ,
            baseSize: 50 + Math.random() * 70,
            pieces: pieces,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.003,
        };
    }

    function createSpaceStation() {
        const spawnZ = 1000 + Math.random() * 400;
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 150;
        
        // Station configuration
        const moduleCount = 3 + Math.floor(Math.random() * 3);
        const hasSolarPanels = Math.random() > 0.3;
        const hasAntenna = Math.random() > 0.5;
        const stationType = Math.floor(Math.random() * 3); // 0: linear, 1: circular, 2: cross
        
        return {
            type: 'spaceStation',
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            z: spawnZ,
            baseSize: 60 + Math.random() * 50,
            moduleCount,
            hasSolarPanels,
            hasAntenna,
            stationType,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.002,
            lightPhase: Math.random() * Math.PI * 2,
            primaryColor: [180, 180, 190],
            accentColor: [100, 150, 200],
        };
    }

    function createAlienShip() {
        const spawnZ = 1000 + Math.random() * 400;
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 150;
        
        // Alien ship variations
        const shipType = Math.floor(Math.random() * 4); // 0: saucer, 1: angular, 2: organic, 3: crystalline
        const glowColors = [
            [100, 255, 200], // Cyan-green
            [255, 100, 255], // Magenta
            [100, 200, 255], // Light blue
            [255, 200, 100], // Gold
        ];
        const glowColor = glowColors[Math.floor(Math.random() * glowColors.length)];
        
        return {
            type: 'alienShip',
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            z: spawnZ,
            baseSize: 40 + Math.random() * 50,
            shipType,
            glowColor,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.008,
            pulsePhase: Math.random() * Math.PI * 2,
            wobble: Math.random() * Math.PI * 2,
        };
    }

    function createRandomEncounter() {
        // Weighted random selection - planets most common, black holes rarest
        const roll = Math.random();
        let type;
        
        if (roll < 0.45) {
            type = 'planet';
        } else if (roll < 0.65) {
            type = 'debris';
        } else if (roll < 0.80) {
            type = 'spaceStation';
        } else if (roll < 0.93) {
            type = 'alienShip';
        } else {
            type = 'blackHole';
        }
        
        // Avoid same type twice in a row
        if (type === lastEncounterType && Math.random() > 0.3) {
            const types = ['planet', 'debris', 'spaceStation', 'alienShip', 'blackHole'];
            type = types[Math.floor(Math.random() * types.length)];
        }
        lastEncounterType = type;
        
        switch (type) {
            case 'planet': return createPlanet();
            case 'blackHole': return createBlackHole();
            case 'debris': return createDebris();
            case 'spaceStation': return createSpaceStation();
            case 'alienShip': return createAlienShip();
            default: return createPlanet();
        }
    }

    function createComet() {
        // Comets fly across the field of view at various depths
        const colors = [[220, 240, 255], [255, 250, 240], [200, 255, 220], [255, 220, 200]];
        const startZ = 400 + Math.random() * 800;
        const angle = Math.random() * Math.PI * 2;
        
        return {
            x: (Math.random() - 0.5) * width * 2,
            y: (Math.random() - 0.5) * height * 2,
            z: startZ,
            vx: Math.cos(angle) * (3 + Math.random() * 4),
            vy: Math.sin(angle) * (3 + Math.random() * 4),
            baseSize: 2 + Math.random() * 3,
            tailLength: 60 + Math.random() * 80,
            color: colors[Math.floor(Math.random() * colors.length)],
        };
    }

    // Stellar classification - color and size ranges
    const starTypes = [
        { name: 'O-blue', color: [155, 176, 255], sizeRange: [6, 12], rarity: 0.05 },      // Blue giant - rare, very large
        { name: 'B-blue-white', color: [170, 191, 255], sizeRange: [5, 10], rarity: 0.08 }, // Blue-white - rare, large
        { name: 'A-white', color: [255, 255, 255], sizeRange: [4, 8], rarity: 0.12 },       // White - uncommon
        { name: 'F-yellow-white', color: [255, 255, 220], sizeRange: [3, 7], rarity: 0.15 }, // Yellow-white
        { name: 'G-yellow', color: [255, 244, 160], sizeRange: [3, 6], rarity: 0.20 },      // Yellow (Sun-like)
        { name: 'K-orange', color: [255, 210, 140], sizeRange: [3, 8], rarity: 0.20 },      // Orange
        { name: 'M-red', color: [255, 180, 150], sizeRange: [2, 5], rarity: 0.15 },         // Red dwarf - common, small
        { name: 'M-red-giant', color: [255, 150, 120], sizeRange: [8, 15], rarity: 0.05 },  // Red giant - rare, huge
    ];

    function createBrightStar(initialSpawn = false) {
        // Select star type based on rarity weights
        let roll = Math.random();
        let selectedType = starTypes[0];
        let cumulative = 0;
        
        for (const type of starTypes) {
            cumulative += type.rarity;
            if (roll <= cumulative) {
                selectedType = type;
                break;
            }
        }
        
        const sizeMin = selectedType.sizeRange[0];
        const sizeMax = selectedType.sizeRange[1];
        const size = sizeMin + Math.random() * (sizeMax - sizeMin);
        
        // Add slight color variation
        const colorVar = 15;
        const color = [
            Math.round(Math.min(255, Math.max(0, selectedType.color[0] + (Math.random() - 0.5) * colorVar))),
            Math.round(Math.min(255, Math.max(0, selectedType.color[1] + (Math.random() - 0.5) * colorVar))),
            Math.round(Math.min(255, Math.max(0, selectedType.color[2] + (Math.random() - 0.5) * colorVar))),
        ];
        
        let x, y, z;
        
        if (initialSpawn) {
            // Initial spawn distributed across various depths
            z = 200 + Math.random() * 1000;
            // Can be anywhere on screen
            x = (Math.random() - 0.5) * width * 2;
            y = (Math.random() - 0.5) * height * 2;
        } else {
            // Spawn far away at edges
            z = 1100 + Math.random() * 400;
            const spawnScale = 300 / z;
            const angle = Math.random() * Math.PI * 2;
            const minDist = Math.max(width, height) * 0.5 / spawnScale;
            const maxDist = Math.max(width, height) * 1.2 / spawnScale;
            const dist = minDist + Math.random() * (maxDist - minDist);
            x = Math.cos(angle) * dist;
            y = Math.sin(angle) * dist;
        }
        
        return {
            x, y, z,
            baseSize: size,
            color: color,
            starType: selectedType.name,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.02 + Math.random() * 0.03,
        };
    }

    function drawBackground() {
        // Static deep space background - no color tint
        ctx.fillStyle = 'rgb(5, 5, 12)';
        ctx.fillRect(0, 0, width, height);
    }

    function drawGasClouds() {
        // Sort by depth (far to near)
        gasClouds.sort((a, b) => b.z - a.z);

        const maxVisibleZ = 1800;
        const fullVisibleZ = 300;
        const fadeRange = maxVisibleZ - fullVisibleZ;

        for (let i = 0; i < gasClouds.length; i++) {
            const cloud = gasClouds[i];
            
            cloud.z -= flightSpeed * 3;
            
            // Early exit for invisible clouds
            if (cloud.z > maxVisibleZ) {
                cloud.wobble += cloud.wobbleSpeed;
                cloud.rotation += cloud.rotationSpeed;
                continue;
            }

            // Reset if cloud passed through viewer
            if (cloud.z < 20) {
                resetGasCloud(cloud);
                continue;
            }

            cloud.wobble += cloud.wobbleSpeed;
            cloud.rotation += cloud.rotationSpeed;

            // 3D projection
            const scale = 400 / cloud.z;
            const x = centerX + cloud.x * scale;
            const y = centerY + cloud.y * scale;
            const radius = cloud.baseRadius * scale;

            // Reset if fully off screen
            const buffer = radius * 2;
            if (x < -buffer || x > width + buffer || y < -buffer || y > height + buffer) {
                resetGasCloud(cloud);
                continue;
            }

            // Skip if too small
            if (radius < 15) continue;
            
            // Calculate opacity early for LOD decisions
            const depthFade = (maxVisibleZ - cloud.z) / fadeRange;
            const smoothFade = depthFade * depthFade * depthFade;
            const edgeFade = getEdgeFade(x, y, 200);
            const wobbleMod = 0.4 + Math.sin(cloud.wobble) * 0.1;
            const baseOpacity = cloud.opacity * smoothFade * edgeFade * wobbleMod * 0.55;

            if (baseOpacity < 0.01) continue;
            
            // Generate puffs if needed
            if (!cloud.puffs) {
                cloud.puffs = [];
                const clusterCount = 5 + Math.floor(Math.random() * 4);
                
                for (let c = 0; c < clusterCount; c++) {
                    const clusterAngle = (c / clusterCount) * Math.PI * 2 + Math.random() * 0.5;
                    const clusterDist = 0.2 + Math.random() * 0.4;
                    const clusterX = Math.cos(clusterAngle) * clusterDist;
                    const clusterY = Math.sin(clusterAngle) * clusterDist * 0.6;
                    const clusterSize = 0.4 + Math.random() * 0.3;
                    
                    cloud.puffs.push({
                        baseX: clusterX, baseY: clusterY,
                        size: clusterSize,
                        brightness: 0.9 + Math.random() * 0.1,
                        driftAngle: Math.random() * Math.PI * 2,
                        driftSpeed: 0.008 + Math.random() * 0.012,
                        driftRadius: 0.03 + Math.random() * 0.05,
                        pulsePhase: Math.random() * Math.PI * 2,
                        pulseSpeed: 0.02 + Math.random() * 0.03,
                        pulseAmount: 0.1 + Math.random() * 0.15,
                    });
                    
                    const subPuffs = 3 + Math.floor(Math.random() * 3);
                    for (let s = 0; s < subPuffs; s++) {
                        const subAngle = Math.random() * Math.PI * 2;
                        const subDist = clusterSize * (0.3 + Math.random() * 0.4);
                        cloud.puffs.push({
                            baseX: clusterX + Math.cos(subAngle) * subDist,
                            baseY: clusterY + Math.sin(subAngle) * subDist * 0.6,
                            size: clusterSize * (0.5 + Math.random() * 0.4),
                            brightness: 0.7 + Math.random() * 0.3,
                            driftAngle: Math.random() * Math.PI * 2,
                            driftSpeed: 0.01 + Math.random() * 0.015,
                            driftRadius: 0.04 + Math.random() * 0.06,
                            pulsePhase: Math.random() * Math.PI * 2,
                            pulseSpeed: 0.025 + Math.random() * 0.035,
                            pulseAmount: 0.12 + Math.random() * 0.18,
                        });
                    }
                }
                
                cloud.puffs.push({
                    baseX: 0, baseY: 0,
                    size: 0.5 + Math.random() * 0.2,
                    brightness: 1,
                    driftAngle: 0, driftSpeed: 0.005, driftRadius: 0.02,
                    pulsePhase: 0, pulseSpeed: 0.015, pulseAmount: 0.08,
                });
                
                cloud.puffs.sort((a, b) => b.size - a.size);
            }

            // Calculate colors once per cloud
            const cloudHue = ((cloud.assignedHue % 360) + 360) % 360;
            const nextHue = (cloudHue + 40) % 360;
            const primaryColor = hslToRgb(cloudHue, 85, 60);
            const secondaryColor = hslToRgb(nextHue, 80, 65);
            
            // Smooth LOD factor (0 = far/faint, 1 = close/visible)
            const lodFactor = Math.min(1, baseOpacity * 4); // Scales 0-0.25 opacity to 0-1
            const animationScale = 0.3 + lodFactor * 0.7; // Animation reduced when distant

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(cloud.rotation);
            ctx.scale(1, cloud.stretch);
            
            // Draw puffs with smooth LOD
            const puffs = cloud.puffs;
            const puffCount = puffs.length;
            
            // Smoothly reduce number of puffs rendered based on LOD
            const maxPuffsToRender = Math.ceil(puffCount * (0.4 + lodFactor * 0.6));
            
            for (let p = 0; p < maxPuffsToRender; p++) {
                const puff = puffs[p];
                
                // Scale animation intensity with distance
                puff.driftAngle += puff.driftSpeed * animationScale;
                puff.pulsePhase += puff.pulseSpeed * animationScale;
                
                const driftX = Math.cos(puff.driftAngle) * puff.driftRadius * animationScale;
                const driftY = Math.sin(puff.driftAngle) * puff.driftRadius * 0.6 * animationScale;
                const animatedX = puff.baseX + driftX;
                const animatedY = puff.baseY + driftY;
                
                const puffX = animatedX * radius;
                const puffY = animatedY * radius;
                const pulseAmount = puff.pulseAmount * animationScale;
                const pulse = 1 + Math.sin(puff.pulsePhase) * pulseAmount;
                const puffRadius = radius * puff.size * pulse;
                
                // Smooth size threshold based on LOD
                const minPuffSize = 3 + (1 - lodFactor) * 8;
                if (puffRadius < minPuffSize) continue;
                
                // Color blending
                const blendFactor = (animatedX + animatedY + 1) * 0.5;
                const smoothBlend = blendFactor * blendFactor * (3 - 2 * blendFactor);
                const invBlend = 1 - smoothBlend;
                
                const tr = (primaryColor[0] * invBlend + secondaryColor[0] * smoothBlend) | 0;
                const tg = (primaryColor[1] * invBlend + secondaryColor[1] * smoothBlend) | 0;
                const tb = (primaryColor[2] * invBlend + secondaryColor[2] * smoothBlend) | 0;
                
                const baseBright = 230 + puff.brightness * 20;
                const shadowBright = 190 + puff.brightness * 25;
                const white = 0.25;
                const tint = 0.75;
                
                const r = (baseBright * white + tr * tint) | 0;
                const g = (baseBright * white + tg * tint) | 0;
                const b = (baseBright * white + tb * tint) | 0;
                const sr = (shadowBright * white + tr * tint * 0.85) | 0;
                const sg = (shadowBright * white + tg * tint * 0.85) | 0;
                const sb = (shadowBright * white + tb * tint * 0.85) | 0;
                
                const puffOpacity = baseOpacity * (0.6 + puff.brightness * 0.4);
                
                const puffGrad = ctx.createRadialGradient(
                    puffX - puffRadius * 0.2, puffY - puffRadius * 0.2, 0,
                    puffX, puffY, puffRadius
                );
                
                puffGrad.addColorStop(0, `rgba(${Math.min(255, r + 20)},${Math.min(255, g + 20)},${Math.min(255, b + 20)},${puffOpacity})`);
                puffGrad.addColorStop(0.5, `rgba(${r},${g},${b},${puffOpacity * 0.8})`);
                puffGrad.addColorStop(1, `rgba(${sr},${sg},${sb},0)`);
                
                ctx.fillStyle = puffGrad;
                ctx.beginPath();
                ctx.arc(puffX, puffY, puffRadius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Smooth highlight/glow intensity based on LOD (no hard cutoff)
            const effectIntensity = Math.max(0, (lodFactor - 0.3) / 0.7); // Fades in from 0.3-1.0
            
            if (effectIntensity > 0.01) {
                // Subtle highlight - intensity scales smoothly
                const highlightGrad = ctx.createRadialGradient(-radius * 0.2, -radius * 0.25, 0, 0, 0, radius * 0.5);
                highlightGrad.addColorStop(0, `rgba(255,255,255,${baseOpacity * 0.12 * effectIntensity})`);
                highlightGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = highlightGrad;
                ctx.beginPath();
                ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
                ctx.fill();
                
                // Outer glow - intensity scales smoothly
                const glowRadius = radius * (1.1 + effectIntensity * 0.15);
                const glowGrad = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, glowRadius);
                glowGrad.addColorStop(0, 'transparent');
                glowGrad.addColorStop(0.5, `rgba(${primaryColor[0]},${primaryColor[1]},${primaryColor[2]},${baseOpacity * 0.1 * effectIntensity})`);
                glowGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = glowGrad;
                ctx.beginPath();
                ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    // Calculate edge fade - objects fade as they approach screen edges
    function getEdgeFade(x, y, buffer = 100) {
        const fadeLeft = Math.min(1, x / buffer);
        const fadeRight = Math.min(1, (width - x) / buffer);
        const fadeTop = Math.min(1, y / buffer);
        const fadeBottom = Math.min(1, (height - y) / buffer);
        return Math.max(0, Math.min(fadeLeft, fadeRight, fadeTop, fadeBottom));
    }

    function drawStars() {
        stars.forEach(star => {
            // Move star towards viewer
            const prevZ = star.z;
            star.z -= flightSpeed * 8;

            // 3D to 2D projection
            const scale = 300 / Math.max(1, star.z);
            const x = centerX + star.x * scale;
            const y = centerY + star.y * scale;

            // Previous position for trail
            const prevScale = 300 / Math.max(1, prevZ);
            const prevX = centerX + star.x * prevScale;
            const prevY = centerY + star.y * prevScale;

            // Reset if fully off screen
            if (x < -100 || x > width + 100 || y < -100 || y > height + 100) {
                resetStar(star);
                return;
            }

            const size = Math.max(0.5, star.size * scale * 0.5);
            const depthBrightness = Math.min(1, (1 - star.z / starDepth) * 1.5);
            const edgeFade = getEdgeFade(x, y, 150);
            const brightness = depthBrightness * edgeFade;
            
            if (brightness < 0.05) return;
            
            const c = star.color;

            // Draw trail (streak effect)
            const trailLength = Math.min(50, Math.sqrt((x - prevX) ** 2 + (y - prevY) ** 2));
            if (trailLength > 2 && brightness > 0.2) {
                const gradient = ctx.createLinearGradient(prevX, prevY, x, y);
                gradient.addColorStop(0, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0)`);
                gradient.addColorStop(1, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${brightness * 0.8})`);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = size * 0.8;
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            // Draw star point
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${brightness})`;
            ctx.fill();

            // Glow for close stars
            if (brightness > 0.5 && size > 1.5) {
                ctx.beginPath();
                ctx.arc(x, y, size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${brightness * 0.2})`;
                ctx.fill();
            }
        });
    }

    function drawBrightStars() {
        if (brightStars.length < maxBrightStars && Math.random() < 0.008) {
            brightStars.push(createBrightStar());
        }

        for (let i = brightStars.length - 1; i >= 0; i--) {
            const s = brightStars[i];
            s.z -= flightSpeed * 5;
            s.twinkle += s.twinkleSpeed;

            // 3D projection
            const scale = 300 / Math.max(5, s.z);
            const x = centerX + s.x * scale;
            const y = centerY + s.y * scale;
            const size = s.baseSize * scale;

            // Remove if off screen
            if (x < -100 || x > width + 100 || y < -100 || y > height + 100) {
                brightStars.splice(i, 1);
                continue;
            }

            if (size < 2) continue;

            const depthFade = Math.min(1, (1 - s.z / 1300) * 2);
            const edgeFade = getEdgeFade(x, y, 150);
            const totalFade = depthFade * edgeFade;
            const twinkle = 0.7 + Math.sin(s.twinkle) * 0.3;

            if (totalFade < 0.05) continue;

            // Outer glow - size based on star size
            const glowSize = size * (6 + s.baseSize * 0.5);
            const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
            outerGlow.addColorStop(0, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${0.4 * totalFade * twinkle})`);
            outerGlow.addColorStop(0.2, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${0.2 * totalFade * twinkle})`);
            outerGlow.addColorStop(0.5, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${0.05 * totalFade * twinkle})`);
            outerGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(x, y, glowSize, 0, Math.PI * 2);
            ctx.fill();

            // Inner bright glow
            const innerGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
            innerGlow.addColorStop(0, `rgba(255, 255, 255, ${0.8 * totalFade * twinkle})`);
            innerGlow.addColorStop(0.3, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${0.5 * totalFade * twinkle})`);
            innerGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = innerGlow;
            ctx.beginPath();
            ctx.arc(x, y, size * 3, 0, Math.PI * 2);
            ctx.fill();

            // Diffraction spikes - longer for brighter/larger stars
            const spikeLength = size * (4 + s.baseSize * 0.4) * twinkle;
            const spikeOpacity = 0.5 * totalFade * twinkle;
            
            ctx.strokeStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${spikeOpacity})`;
            ctx.lineWidth = Math.max(1, size * 0.3);
            ctx.lineCap = 'round';
            
            // 4-point spikes
            for (let spike = 0; spike < 4; spike++) {
                const angle = spike * Math.PI / 2 + Math.PI / 4;
                const gradient = ctx.createLinearGradient(
                    x, y,
                    x + Math.cos(angle) * spikeLength,
                    y + Math.sin(angle) * spikeLength
                );
                gradient.addColorStop(0, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${spikeOpacity})`);
                gradient.addColorStop(0.5, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${spikeOpacity * 0.3})`);
                gradient.addColorStop(1, 'transparent');
                
                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.cos(angle) * spikeLength, y + Math.sin(angle) * spikeLength);
                ctx.stroke();
            }

            // Secondary shorter spikes for large stars
            if (s.baseSize > 8) {
                ctx.lineWidth = Math.max(0.5, size * 0.15);
                for (let spike = 0; spike < 4; spike++) {
                    const angle = spike * Math.PI / 2;
                    ctx.strokeStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${spikeOpacity * 0.5})`;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + Math.cos(angle) * spikeLength * 0.5, y + Math.sin(angle) * spikeLength * 0.5);
                    ctx.stroke();
                }
            }

            // Core - white center fading to star color
            const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 1.2);
            coreGrad.addColorStop(0, `rgba(255, 255, 255, ${totalFade})`);
            coreGrad.addColorStop(0.5, `rgba(${Math.min(255, s.color[0] + 30)}, ${Math.min(255, s.color[1] + 30)}, ${Math.min(255, s.color[2] + 30)}, ${totalFade})`);
            coreGrad.addColorStop(1, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${totalFade * 0.8})`);
            ctx.fillStyle = coreGrad;
            ctx.beginPath();
            ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Unified encounter system - handles planets, black holes, debris, stations, ships
    function drawEncounters() {
        // Spawn new encounter if none exists
        if (!currentEncounter && Math.random() < encounterSpawnChance) {
            currentEncounter = createRandomEncounter();
        }
        
        if (!currentEncounter) return;
        
        const enc = currentEncounter;
        enc.z -= flightSpeed * 2;
        if (enc.rotation !== undefined) {
            enc.rotation += enc.rotSpeed || enc.rotationSpeed || 0;
        }
        if (enc.warpPhase !== undefined) enc.warpPhase += 0.012;
        if (enc.pulsePhase !== undefined) enc.pulsePhase += 0.03;
        if (enc.wobble !== undefined) enc.wobble += 0.02;
        if (enc.lightPhase !== undefined) enc.lightPhase += 0.05;
        
        // Update debris piece rotations
        if (enc.pieces) {
            enc.pieces.forEach(p => p.rotation += p.rotSpeed);
        }
        
        // 3D projection
        const scale = 400 / Math.max(20, enc.z);
        const x = centerX + enc.x * scale;
        const y = centerY + enc.y * scale;
        const size = enc.baseSize * scale;
        
        // Remove if passed viewer or off screen
        if (enc.z < 20) {
            currentEncounter = null;
            return;
        }
        
        if (size < 5) return; // Skip drawing if too small
        
        // Only remove if WAY off-screen (objects start from distance)
        const buffer = Math.max(size * 4, 200);
        if (x < -buffer || x > width + buffer || y < -buffer || y > height + buffer) {
            currentEncounter = null;
            return;
        }
        
        // Gradual fade in from distance
        const maxVisibleZ = 1400;
        const fullVisibleZ = 300;
        const depthFade = Math.max(0, Math.min(1, (maxVisibleZ - enc.z) / (maxVisibleZ - fullVisibleZ)));
        const smoothFade = depthFade * depthFade; // Smooth ease-in
        const edgeFade = getEdgeFade(x, y, 250);
        const totalFade = smoothFade * edgeFade;
        
        if (totalFade < 0.02) return;
        
        // Draw based on encounter type
        const encType = enc.encounterType || enc.type;
        switch (encType) {
            case 'planet':
                drawPlanetEncounter(enc, x, y, size, totalFade);
                break;
            case 'blackHole':
                drawBlackHoleEncounter(enc, x, y, size, totalFade);
                break;
            case 'debris':
                drawDebrisEncounter(enc, x, y, size, totalFade);
                break;
            case 'spaceStation':
                drawSpaceStationEncounter(enc, x, y, size, totalFade);
                break;
            case 'alienShip':
                drawAlienShipEncounter(enc, x, y, size, totalFade);
                break;
        }
    }

    function drawPlanetEncounter(p, x, y, size, totalFade) {
        const c = p.colors;
        
        // Safety check - ensure colors are valid
        if (!c || !c[0] || !c[1] || c[0].some(v => isNaN(v)) || c[1].some(v => isNaN(v))) {
            currentEncounter = null;
            return;
        }

        ctx.save();
        ctx.globalAlpha = totalFade;

            // Lava planet outer glow
            if (p.hasLava && p.glowColor) {
                const lavaGlow = ctx.createRadialGradient(x, y, size * 0.8, x, y, size * 1.6);
                lavaGlow.addColorStop(0, `rgba(${Math.round(p.glowColor[0])}, ${Math.round(p.glowColor[1])}, ${Math.round(p.glowColor[2])}, 0.3)`);
                lavaGlow.addColorStop(0.5, `rgba(${Math.round(p.glowColor[0])}, ${Math.round(p.glowColor[1])}, ${Math.round(p.glowColor[2])}, 0.1)`);
                lavaGlow.addColorStop(1, 'transparent');
                ctx.fillStyle = lavaGlow;
                ctx.beginPath();
                ctx.arc(x, y, size * 1.6, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw ring behind planet
            if (p.hasRing) {
                drawPlanetRing(x, y, size, p, false);
            }

            // Create clipping mask for planet
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.clip();

            // Base planet gradient
            const baseGrad = ctx.createRadialGradient(x - size * 0.4, y - size * 0.4, 0, x, y, size * 1.2);
            baseGrad.addColorStop(0, `rgb(${Math.round(Math.min(255, c[0][0] + 30))}, ${Math.round(Math.min(255, c[0][1] + 30))}, ${Math.round(Math.min(255, c[0][2] + 30))})`);
            baseGrad.addColorStop(0.5, `rgb(${Math.round(c[0][0])}, ${Math.round(c[0][1])}, ${Math.round(c[0][2])})`);
            baseGrad.addColorStop(1, `rgb(${Math.round(Math.max(0, c[1][0] - 30))}, ${Math.round(Math.max(0, c[1][1] - 30))}, ${Math.round(Math.max(0, c[1][2] - 30))})`);
            ctx.fillStyle = baseGrad;
            ctx.fillRect(x - size, y - size, size * 2, size * 2);

            // Gas giant bands
            if (p.hasBands) {
                for (let b = 0; b < p.bandCount; b++) {
                    const bandY = y - size + (b / p.bandCount) * size * 2;
                    const bandHeight = size * 2 / p.bandCount;
                    const colorIndex = b % c.length;
                    const bandColor = c[colorIndex];
                    if (!bandColor) continue;
                    const bandOpacity = 0.4 + Math.sin(b * 0.8 + p.bandOffset) * 0.2;
                    
                    ctx.fillStyle = `rgba(${Math.round(bandColor[0])}, ${Math.round(bandColor[1])}, ${Math.round(bandColor[2])}, ${bandOpacity})`;
                    ctx.beginPath();
                    const curveOffset = Math.sin(p.rotation * 2 + b * 0.4) * size * 0.03;
                    ctx.ellipse(x + curveOffset, bandY + bandHeight / 2, size * 1.1, bandHeight * 0.6, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Ice cracks
            if (p.hasCracks && size > 25 && c[3]) {
                ctx.strokeStyle = `rgba(${Math.round(c[3][0])}, ${Math.round(c[3][1])}, ${Math.round(c[3][2])}, 0.5)`;
                ctx.lineWidth = 1.5;
                for (let cr = 0; cr < p.crackCount; cr++) {
                    const startAngle = (cr / p.crackCount) * Math.PI * 2 + p.crackSeed;
                    const sx = x + Math.cos(startAngle) * size * 0.2;
                    const sy = y + Math.sin(startAngle) * size * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    for (let seg = 0; seg < 3; seg++) {
                        const segAngle = startAngle + (Math.sin(p.crackSeed + cr + seg) * 0.5);
                        const dist = size * (0.3 + seg * 0.25);
                        ctx.lineTo(x + Math.cos(segAngle) * dist, y + Math.sin(segAngle) * dist);
                    }
                    ctx.stroke();
                }
            }

            // Lava cracks/veins
            if (p.hasLava && size > 25 && p.glowColor) {
                ctx.strokeStyle = `rgba(${Math.round(p.glowColor[0])}, ${Math.round(p.glowColor[1])}, ${Math.round(p.glowColor[2])}, 0.8)`;
                ctx.lineWidth = 2;
                ctx.shadowColor = `rgb(${Math.round(p.glowColor[0])}, ${Math.round(p.glowColor[1])}, ${Math.round(p.glowColor[2])})`;
                ctx.shadowBlur = 8;
                const lavaCount = p.crackCount + 2;
                for (let lv = 0; lv < lavaCount; lv++) {
                    const startAngle = (lv / lavaCount) * Math.PI * 2 + p.crackSeed;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    for (let seg = 0; seg < 4; seg++) {
                        const segAngle = startAngle + Math.sin(p.crackSeed * 2 + lv + seg) * 0.6;
                        const dist = size * (0.2 + seg * 0.22);
                        ctx.lineTo(x + Math.cos(segAngle) * dist, y + Math.sin(segAngle) * dist);
                    }
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
            }

            // Oceans for lush planets
            if (p.hasOceans && p.oceanColor) {
                for (let oc = 0; oc < p.oceanCount; oc++) {
                    const ocAngle = (oc / p.oceanCount) * Math.PI * 2 + p.bandOffset;
                    const ocX = x + Math.cos(ocAngle) * size * 0.3;
                    const ocY = y + Math.sin(ocAngle) * size * 0.4;
                    const ocSize = size * (0.3 + Math.sin(p.bandOffset + oc) * 0.1);
                    ctx.fillStyle = `rgba(${Math.round(p.oceanColor[0])}, ${Math.round(p.oceanColor[1])}, ${Math.round(p.oceanColor[2])}, 0.6)`;
                    ctx.beginPath();
                    ctx.ellipse(ocX, ocY, ocSize, ocSize * 0.6, ocAngle, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Desert dunes
            if (p.hasDunes && size > 25 && c[2]) {
                for (let d = 0; d < 5; d++) {
                    const duneY = y - size * 0.6 + d * size * 0.3;
                    ctx.fillStyle = `rgba(${Math.round(c[2][0])}, ${Math.round(c[2][1])}, ${Math.round(c[2][2])}, 0.3)`;
                    ctx.beginPath();
                    ctx.ellipse(x + Math.sin(d + p.bandOffset) * size * 0.2, duneY, size * 0.9, size * 0.08, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Clouds
            if (p.hasClouds && size > 20) {
                const cloudCol = p.cloudColor || [255, 255, 255];
                for (let cl = 0; cl < p.cloudCount; cl++) {
                    const clAngle = (cl / p.cloudCount) * Math.PI * 2 + p.rotation * 3;
                    const clX = x + Math.cos(clAngle) * size * 0.5;
                    const clY = y + Math.sin(clAngle) * size * 0.3;
                    const clSize = size * (0.15 + Math.sin(p.bandOffset + cl) * 0.05);
                    ctx.fillStyle = `rgba(${Math.round(cloudCol[0])}, ${Math.round(cloudCol[1])}, ${Math.round(cloudCol[2])}, 0.4)`;
                    ctx.beginPath();
                    ctx.ellipse(clX, clY, clSize * 1.5, clSize, clAngle * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Storm spot for gas giants
            if (p.hasStorm) {
                const stormX = x + p.stormPos.x * size;
                const stormY = y + p.stormPos.y * size;
                const sSize = size * p.stormSize;
                
                const stormGrad = ctx.createRadialGradient(stormX, stormY, 0, stormX, stormY, sSize);
                stormGrad.addColorStop(0, `rgba(200, 100, 80, 0.9)`);
                stormGrad.addColorStop(0.4, `rgba(180, 80, 60, 0.7)`);
                stormGrad.addColorStop(0.7, `rgba(160, 60, 40, 0.4)`);
                stormGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = stormGrad;
                ctx.beginPath();
                ctx.ellipse(stormX, stormY, sSize * 1.3, sSize * 0.8, p.rotation * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore(); // End clipping

            // Terminator shadow
            const shadowGrad = ctx.createLinearGradient(x - size, y, x + size, y);
            shadowGrad.addColorStop(0, 'transparent');
            shadowGrad.addColorStop(0.45, 'transparent');
            shadowGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.2)');
            shadowGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.5)');
            shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.75)');
            ctx.fillStyle = shadowGrad;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();

            // Atmosphere limb based on planet type
            let limbColor = c[0] || [150, 150, 180];
            if (p.planetType === 'ice') limbColor = [180, 220, 255];
            else if (p.planetType === 'lava' && p.glowColor) limbColor = p.glowColor;
            else if (p.planetType === 'lush') limbColor = [100, 180, 220];
            else if (p.planetType === 'toxic') limbColor = [180, 200, 100];

            const limbGrad = ctx.createRadialGradient(x, y, size * 0.88, x, y, size * 1.12);
            limbGrad.addColorStop(0, 'transparent');
            limbGrad.addColorStop(0.4, `rgba(${Math.round(limbColor[0])}, ${Math.round(limbColor[1])}, ${Math.round(limbColor[2])}, 0.08)`);
            limbGrad.addColorStop(0.7, `rgba(${Math.round(limbColor[0])}, ${Math.round(limbColor[1])}, ${Math.round(limbColor[2])}, 0.15)`);
            limbGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = limbGrad;
            ctx.beginPath();
            ctx.arc(x, y, size * 1.12, 0, Math.PI * 2);
            ctx.fill();

            // Specular highlight
            const specGrad = ctx.createRadialGradient(x - size * 0.35, y - size * 0.35, 0, x - size * 0.2, y - size * 0.2, size * 0.45);
            specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            specGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
            specGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = specGrad;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();

            // Draw ring in front of planet
            if (p.hasRing) {
                drawPlanetRing(x, y, size, p, true);
            }

            ctx.restore();
    }

    function drawPlanetRing(x, y, size, p, inFront) {
        if (!p.ringSystems || p.ringSystems.length === 0) return;

        ctx.save();

        // Initialize ring particles if not present
        if (!p.ringParticles) {
            p.ringParticles = [];
            p.ringSystems.forEach((ring, sysIndex) => {
                const particleCount = 80 + Math.floor(Math.random() * 60); // 80-140 particles per ring
                for (let i = 0; i < particleCount; i++) {
                    const t = Math.random(); // Position within ring (0=inner, 1=outer)
                    const angle = Math.random() * Math.PI * 2;
                    
                    // Skip particles in gaps
                    if (ring.hasGap && Math.abs(t - ring.gapPosition) < 0.12) continue;
                    
                    p.ringParticles.push({
                        ringIndex: sysIndex,
                        t: t, // Radial position
                        angle: angle, // Orbital angle
                        size: 0.8 + Math.random() * 2.5, // Rock size
                        brightness: 0.4 + Math.random() * 0.6,
                        orbitSpeed: 0.002 + Math.random() * 0.003, // Faster inner, slower outer adjusted later
                        wobble: Math.random() * 0.15, // Slight vertical wobble
                        wobblePhase: Math.random() * Math.PI * 2,
                        elongation: 0.6 + Math.random() * 0.8, // Rock shape
                        rockAngle: Math.random() * Math.PI * 2, // Rock rotation
                    });
                }
            });
        }

        // Update and draw particles
        p.ringParticles.forEach(particle => {
            const ring = p.ringSystems[particle.ringIndex];
            if (!ring) return;

            const innerRadius = size * ring.innerRadius;
            const outerRadius = size * ring.outerRadius;
            const ringRadius = innerRadius + (outerRadius - innerRadius) * particle.t;
            const tilt = ring.tilt;
            const rc = ring.color;
            
            // Update orbital position (inner particles orbit faster)
            const speedMod = 1 - particle.t * 0.4; // Inner orbits faster
            particle.angle += particle.orbitSpeed * speedMod;
            particle.wobblePhase += 0.02;

            // Calculate 3D position on tilted ellipse
            const orbitAngle = particle.angle + ring.rotationAngle;
            const wobbleOffset = Math.sin(particle.wobblePhase) * particle.wobble * ringRadius * 0.1;
            
            // Ellipse coordinates with tilt
            const px = x + Math.cos(orbitAngle) * ringRadius;
            const py = y + Math.sin(orbitAngle) * ringRadius * tilt + wobbleOffset;
            
            // Determine if particle is in front or behind planet
            const particleInFront = Math.sin(orbitAngle) > 0;
            
            // Only draw if matches current pass (front or back)
            if (particleInFront !== inFront) return;
            
            // Distance-based opacity (particles further from viewer are dimmer)
            const depthFactor = inFront ? 1 : 0.5;
            const edgeFade = 1 - Math.abs(Math.sin(orbitAngle)) * 0.3; // Slight fade at edges
            const radialFade = 1 - particle.t * 0.25; // Outer particles slightly dimmer
            const baseOpacity = ring.opacity * particle.brightness * depthFactor * edgeFade * radialFade;
            
            // Rock size scales with planet size
            const rockSize = particle.size * (size / 60);
            
            // Color variation - some rocks are darker/lighter
            const colorVar = (particle.brightness - 0.5) * 40;
            const r = Math.round(Math.min(255, Math.max(0, rc[0] + colorVar)));
            const g = Math.round(Math.min(255, Math.max(0, rc[1] + colorVar)));
            const b = Math.round(Math.min(255, Math.max(0, rc[2] + colorVar)));
            
            // Draw irregular rock shape
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(particle.rockAngle + particle.angle * 0.5); // Rock slowly tumbles
            
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${baseOpacity})`;
            ctx.beginPath();
            
            // Irregular rock shape (elongated ellipse with some variation)
            const rx = rockSize * particle.elongation;
            const ry = rockSize / particle.elongation;
            ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Highlight on some larger rocks
            if (rockSize > 2 && particle.brightness > 0.6) {
                ctx.fillStyle = `rgba(255, 255, 255, ${baseOpacity * 0.3})`;
                ctx.beginPath();
                ctx.ellipse(-rx * 0.3, -ry * 0.3, rx * 0.4, ry * 0.4, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        });

        // Add some dust/fine particles between rocks for density
        p.ringSystems.forEach((ring, sysIndex) => {
            const innerRadius = size * ring.innerRadius;
            const outerRadius = size * ring.outerRadius;
            const tilt = ring.tilt;
            const rc = ring.color;
            
            // Draw faint dust bands
            const startAngle = inFront ? Math.PI + 0.1 : 0.1;
            const endAngle = inFront ? Math.PI * 2 - 0.1 : Math.PI - 0.1;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(ring.rotationAngle);
            ctx.translate(-x, -y);
            
            // Very faint dust layer
            const dustOpacity = ring.opacity * (inFront ? 0.15 : 0.08);
            ctx.strokeStyle = `rgba(${Math.round(rc[0])}, ${Math.round(rc[1])}, ${Math.round(rc[2])}, ${dustOpacity})`;
            ctx.lineWidth = (outerRadius - innerRadius) * 0.8;
            ctx.beginPath();
            const midRadius = (innerRadius + outerRadius) / 2;
            ctx.ellipse(x, y, midRadius, midRadius * tilt, 0, startAngle, endAngle);
            ctx.stroke();
            
            ctx.restore();
        });

        // Ring shadow on planet (only for back ring)
        if (!inFront && p.ringSystems.length > 0) {
            const mainTilt = p.ringSystems[0].tilt;
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
            ctx.beginPath();
            ctx.ellipse(x, y - size * mainTilt * 0.4, size * 0.7, size * 0.1, p.ringSystems[0].rotationAngle, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
        }

        ctx.restore();
    }

    function drawBlackHoleEncounter(bh, x, y, size, totalFade) {
        ctx.save();
        ctx.globalAlpha = totalFade;
            
            // Disk inclination angle (tilted accretion disk view)
            const diskTilt = 0.25; // 0 = edge-on, 1 = face-on
            const diskRotation = bh.warpPhase * 0.3;

            // ========== GRAVITATIONAL LENSING EFFECT ==========
            // Einstein ring - light bent around the black hole
            const lensRings = 6;
            for (let ring = 0; ring < lensRings; ring++) {
                const ringRadius = size * (2.8 - ring * 0.25);
                const ringIntensity = (ring + 1) / lensRings;
                const distortAmount = size * 0.15 * ringIntensity;
                
                ctx.beginPath();
                const segments = 80;
                for (let s = 0; s <= segments; s++) {
                    const angle = (s / segments) * Math.PI * 2;
                    // Gravitational distortion - light bends more near the hole
                    const gravDistort = Math.sin(angle * 2 + bh.warpPhase) * distortAmount * 0.5;
                    const px = x + Math.cos(angle) * (ringRadius + gravDistort);
                    const py = y + Math.sin(angle) * (ringRadius * diskTilt + gravDistort * 0.3);
                    
                    if (s === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                
                const lensOpacity = 0.04 * ringIntensity;
                ctx.strokeStyle = `rgba(180, 200, 255, ${lensOpacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // ========== ACCRETION DISK - BACK HALF ==========
            // Draw the back half of the disk first (behind the black hole)
            ctx.globalAlpha = totalFade * 0.9;
            
            const diskInnerRadius = size * 1.15;
            const diskOuterRadius = size * 3.2;
            
            // Back half of disk
            for (let layer = 0; layer < 20; layer++) {
                const t = layer / 20;
                const layerRadius = diskInnerRadius + (diskOuterRadius - diskInnerRadius) * t;
                const layerWidth = (diskOuterRadius - diskInnerRadius) / 15;
                
                ctx.beginPath();
                // Only draw back arc (PI to 2*PI relative to disk rotation)
                const arcStart = Math.PI + diskRotation;
                const arcEnd = Math.PI * 2 + diskRotation;
                
                for (let s = 0; s <= 40; s++) {
                    const angle = arcStart + (s / 40) * Math.PI;
                    const wobble = Math.sin(angle * 8 + bh.warpPhase * 2 + layer * 0.3) * size * 0.008;
                    const px = x + Math.cos(angle) * (layerRadius + wobble);
                    const py = y + Math.sin(angle) * (layerRadius * diskTilt + wobble * 0.2);
                    
                    if (s === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                
                // Disk color - hot inner region (white/blue) to cooler outer (orange/red)
                const heat = 1 - t;
                const r = Math.round(255 - heat * 50);
                const g = Math.round(150 + heat * 80 - t * 100);
                const b = Math.round(100 + heat * 155 - t * 80);
                
                // Doppler effect - approaching side brighter
                const dopplerOpacity = 0.15 * (1 - t * 0.6);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${dopplerOpacity})`;
                ctx.lineWidth = layerWidth;
                ctx.stroke();
            }

            // ========== EVENT HORIZON (THE VOID) ==========
            ctx.globalAlpha = totalFade;
            
            // Dark void with subtle edge
            const voidGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 1.12);
            voidGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
            voidGrad.addColorStop(0.75, 'rgba(0, 0, 0, 1)');
            voidGrad.addColorStop(0.88, 'rgba(0, 0, 0, 0.99)');
            voidGrad.addColorStop(0.96, 'rgba(5, 5, 10, 0.95)');
            voidGrad.addColorStop(1, 'rgba(10, 10, 20, 0)');
            ctx.fillStyle = voidGrad;
            ctx.beginPath();
            ctx.arc(x, y, size * 1.12, 0, Math.PI * 2);
            ctx.fill();

            // ========== PHOTON SPHERE ==========
            // The bright ring where light orbits - key feature of realistic black holes
            ctx.globalAlpha = totalFade;
            
            // Multiple thin photon rings for realism
            for (let pr = 0; pr < 3; pr++) {
                const photonRadius = size * (1.04 + pr * 0.025);
                const photonOpacity = 0.6 - pr * 0.15;
                
                ctx.beginPath();
                const photonSegments = 80;
                for (let s = 0; s <= photonSegments; s++) {
                    const angle = (s / photonSegments) * Math.PI * 2;
                    // Slight warping
                    const wobble = Math.sin(angle * 4 + bh.warpPhase * 1.5) * size * 0.008;
                    const px = x + Math.cos(angle) * (photonRadius + wobble);
                    const py = y + Math.sin(angle) * (photonRadius * (0.85 + diskTilt * 0.15) + wobble * 0.3);
                    
                    if (s === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                
                ctx.shadowColor = `rgba(255, 220, 180, ${photonOpacity * 0.8})`;
                ctx.shadowBlur = 8 - pr * 2;
                ctx.strokeStyle = `rgba(255, 240, 220, ${photonOpacity})`;
                ctx.lineWidth = 2 - pr * 0.5;
                ctx.stroke();
            }
            ctx.shadowBlur = 0;

            // ========== ACCRETION DISK - FRONT HALF ==========
            // Draw the front half on top (in front of the black hole)
            ctx.globalAlpha = totalFade;
            
            for (let layer = 0; layer < 25; layer++) {
                const t = layer / 25;
                const layerRadius = diskInnerRadius + (diskOuterRadius - diskInnerRadius) * t;
                const layerWidth = (diskOuterRadius - diskInnerRadius) / 18;
                
                ctx.beginPath();
                // Only draw front arc (0 to PI relative to disk rotation)
                const arcStart = diskRotation;
                const arcEnd = Math.PI + diskRotation;
                
                for (let s = 0; s <= 50; s++) {
                    const angle = arcStart + (s / 50) * Math.PI;
                    const wobble = Math.sin(angle * 8 + bh.warpPhase * 2 + layer * 0.3) * size * 0.012;
                    // Turbulence in the disk
                    const turbulence = Math.sin(angle * 15 + bh.warpPhase * 3) * size * 0.004 * (1 - t);
                    const px = x + Math.cos(angle) * (layerRadius + wobble + turbulence);
                    const py = y + Math.sin(angle) * (layerRadius * diskTilt + wobble * 0.2);
                    
                    if (s === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                
                // Brighter colors for front (Doppler boosted, approaching)
                const heat = 1 - t;
                const dopplerBoost = 1.3; // Relativistic Doppler brightening
                const r = Math.round(Math.min(255, (255 - heat * 30) * dopplerBoost));
                const g = Math.round(Math.min(255, (180 + heat * 60 - t * 80) * dopplerBoost));
                const b = Math.round(Math.min(255, (120 + heat * 135 - t * 60)));
                
                const frontOpacity = 0.25 * (1 - t * 0.5);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${frontOpacity})`;
                ctx.lineWidth = layerWidth;
                ctx.stroke();
            }

            // ========== HOT INNER DISK GLOW ==========
            ctx.globalAlpha = totalFade * 0.7;
            const innerGlow = ctx.createRadialGradient(x, y - size * diskTilt * 0.3, size * 0.8, x, y, size * 1.8);
            innerGlow.addColorStop(0, 'rgba(255, 200, 150, 0.3)');
            innerGlow.addColorStop(0.3, 'rgba(255, 180, 120, 0.15)');
            innerGlow.addColorStop(0.6, 'rgba(255, 150, 100, 0.05)');
            innerGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = innerGlow;
            ctx.beginPath();
            ctx.ellipse(x, y, size * 1.8, size * 1.8 * diskTilt, 0, 0, Math.PI * 2);
            ctx.fill();

            // ========== RELATIVISTIC JETS (subtle) ==========
            ctx.globalAlpha = totalFade * 0.25;
            const jetLength = size * 4;
            
            // Top jet
            const topJetGrad = ctx.createLinearGradient(x, y, x, y - jetLength);
            topJetGrad.addColorStop(0, 'rgba(150, 180, 255, 0.4)');
            topJetGrad.addColorStop(0.3, 'rgba(120, 150, 220, 0.2)');
            topJetGrad.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.moveTo(x - size * 0.15, y);
            ctx.quadraticCurveTo(x - size * 0.08, y - jetLength * 0.5, x, y - jetLength);
            ctx.quadraticCurveTo(x + size * 0.08, y - jetLength * 0.5, x + size * 0.15, y);
            ctx.fillStyle = topJetGrad;
            ctx.fill();
            
            // Bottom jet
            const bottomJetGrad = ctx.createLinearGradient(x, y, x, y + jetLength);
            bottomJetGrad.addColorStop(0, 'rgba(150, 180, 255, 0.4)');
            bottomJetGrad.addColorStop(0.3, 'rgba(120, 150, 220, 0.2)');
            bottomJetGrad.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.moveTo(x - size * 0.15, y);
            ctx.quadraticCurveTo(x - size * 0.08, y + jetLength * 0.5, x, y + jetLength);
            ctx.quadraticCurveTo(x + size * 0.08, y + jetLength * 0.5, x + size * 0.15, y);
            ctx.fillStyle = bottomJetGrad;
            ctx.fill();

            // ========== INFALLING MATTER STREAMS ==========
            ctx.globalAlpha = totalFade * 0.4;
            const streamCount = 8;
            for (let s = 0; s < streamCount; s++) {
                const baseAngle = (s / streamCount) * Math.PI * 2 + diskRotation;
                const streamPhase = bh.warpPhase + s * 0.5;
                
                // Spiral inward path
                ctx.beginPath();
                for (let t = 0; t <= 1; t += 0.03) {
                    const spiralAngle = baseAngle + t * Math.PI * 1.5;
                    const spiralRadius = diskOuterRadius * (1 + (1 - t) * 0.8);
                    const px = x + Math.cos(spiralAngle) * spiralRadius;
                    const py = y + Math.sin(spiralAngle) * spiralRadius * diskTilt;
                    
                    if (t === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                
                const streamGrad = ctx.createLinearGradient(
                    x + Math.cos(baseAngle) * diskOuterRadius * 2,
                    y + Math.sin(baseAngle) * diskOuterRadius * 2 * diskTilt,
                    x, y
                );
                streamGrad.addColorStop(0, 'transparent');
                streamGrad.addColorStop(0.5, 'rgba(255, 200, 150, 0.1)');
                streamGrad.addColorStop(1, 'rgba(255, 180, 120, 0.3)');
                
                ctx.strokeStyle = streamGrad;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            ctx.restore();
    }

    // Draw space debris field
    function drawDebrisEncounter(enc, x, y, size, totalFade) {
        ctx.save();
        ctx.globalAlpha = totalFade;
        ctx.translate(x, y);
        ctx.rotate(enc.rotation);
        
        enc.pieces.forEach(piece => {
            const px = piece.x * size;
            const py = piece.y * size;
            const pieceSize = piece.size * size;
            
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(piece.rotation);
            
            // Draw irregular debris shape
            const c = piece.color;
            ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
            ctx.beginPath();
            
            // Random polygon shape
            const sides = 4 + Math.floor(Math.random() * 3);
            for (let i = 0; i < sides; i++) {
                const angle = (i / sides) * Math.PI * 2;
                const r = pieceSize * (0.6 + Math.random() * 0.4);
                const vx = Math.cos(angle) * r;
                const vy = Math.sin(angle) * r * 0.7;
                if (i === 0) ctx.moveTo(vx, vy);
                else ctx.lineTo(vx, vy);
            }
            ctx.closePath();
            ctx.fill();
            
            // Metallic highlight
            ctx.fillStyle = `rgba(180, 180, 200, 0.3)`;
            ctx.beginPath();
            ctx.ellipse(-pieceSize * 0.2, -pieceSize * 0.2, pieceSize * 0.3, pieceSize * 0.2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
        
        ctx.restore();
    }

    // Draw space station
    function drawSpaceStationEncounter(enc, x, y, size, totalFade) {
        ctx.save();
        ctx.globalAlpha = totalFade;
        ctx.translate(x, y);
        ctx.rotate(enc.rotation);
        
        const pc = enc.primaryColor;
        const ac = enc.accentColor;
        const lightOn = Math.sin(enc.lightPhase) > 0;
        
        if (enc.stationType === 0) {
            // Linear station - modules in a row
            for (let i = 0; i < enc.moduleCount; i++) {
                const mx = (i - enc.moduleCount / 2) * size * 0.4;
                ctx.fillStyle = `rgb(${pc[0]}, ${pc[1]}, ${pc[2]})`;
                ctx.fillRect(mx - size * 0.12, -size * 0.15, size * 0.24, size * 0.3);
                
                // Windows
                ctx.fillStyle = lightOn ? `rgba(255, 255, 200, 0.8)` : `rgba(50, 60, 80, 0.8)`;
                ctx.fillRect(mx - size * 0.06, -size * 0.08, size * 0.04, size * 0.04);
                ctx.fillRect(mx + size * 0.02, -size * 0.08, size * 0.04, size * 0.04);
            }
            // Connecting tubes
            ctx.fillStyle = `rgb(${pc[0] - 20}, ${pc[1] - 20}, ${pc[2] - 20})`;
            ctx.fillRect(-size * 0.5, -size * 0.03, size, size * 0.06);
        } else if (enc.stationType === 1) {
            // Circular station
            ctx.strokeStyle = `rgb(${pc[0]}, ${pc[1]}, ${pc[2]})`;
            ctx.lineWidth = size * 0.08;
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
            ctx.stroke();
            
            // Hub
            ctx.fillStyle = `rgb(${pc[0]}, ${pc[1]}, ${pc[2]})`;
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
            ctx.fill();
            
            // Spokes
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                ctx.strokeStyle = `rgb(${pc[0] - 20}, ${pc[1] - 20}, ${pc[2] - 20})`;
                ctx.lineWidth = size * 0.04;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(angle) * size * 0.4, Math.sin(angle) * size * 0.4);
                ctx.stroke();
            }
        } else {
            // Cross station
            ctx.fillStyle = `rgb(${pc[0]}, ${pc[1]}, ${pc[2]})`;
            ctx.fillRect(-size * 0.5, -size * 0.1, size, size * 0.2);
            ctx.fillRect(-size * 0.1, -size * 0.5, size * 0.2, size);
            
            // Center hub
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Solar panels
        if (enc.hasSolarPanels) {
            ctx.fillStyle = `rgba(40, 60, 120, 0.9)`;
            ctx.fillRect(-size * 0.7, -size * 0.02, size * 0.15, size * 0.35);
            ctx.fillRect(size * 0.55, -size * 0.02, size * 0.15, size * 0.35);
            // Panel lines
            ctx.strokeStyle = `rgba(100, 120, 160, 0.5)`;
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                const ly = i * size * 0.08;
                ctx.beginPath();
                ctx.moveTo(-size * 0.7, ly);
                ctx.lineTo(-size * 0.55, ly);
                ctx.moveTo(size * 0.55, ly);
                ctx.lineTo(size * 0.7, ly);
                ctx.stroke();
            }
        }
        
        // Antenna
        if (enc.hasAntenna) {
            ctx.strokeStyle = `rgb(${pc[0] + 20}, ${pc[1] + 20}, ${pc[2] + 20})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -size * 0.3);
            ctx.lineTo(0, -size * 0.6);
            ctx.stroke();
            // Dish
            ctx.beginPath();
            ctx.arc(0, -size * 0.6, size * 0.08, Math.PI, Math.PI * 2);
            ctx.stroke();
        }
        
        // Blinking lights
        if (lightOn) {
            ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
            ctx.beginPath();
            ctx.arc(size * 0.3, -size * 0.2, size * 0.02, 0, Math.PI * 2);
            ctx.arc(-size * 0.3, -size * 0.2, size * 0.02, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    // Draw alien ship
    function drawAlienShipEncounter(enc, x, y, size, totalFade) {
        ctx.save();
        ctx.globalAlpha = totalFade;
        ctx.translate(x, y);
        ctx.rotate(enc.rotation);
        
        const gc = enc.glowColor;
        const pulseIntensity = 0.5 + Math.sin(enc.pulsePhase) * 0.5;
        const wobbleOffset = Math.sin(enc.wobble) * size * 0.05;
        
        // Glow aura
        const glowGrad = ctx.createRadialGradient(0, wobbleOffset, 0, 0, wobbleOffset, size * 1.5);
        glowGrad.addColorStop(0, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.4 * pulseIntensity})`);
        glowGrad.addColorStop(0.5, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.15 * pulseIntensity})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, wobbleOffset, size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        if (enc.shipType === 0) {
            // Classic saucer
            ctx.fillStyle = `rgb(60, 65, 75)`;
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset, size * 0.6, size * 0.15, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Dome
            ctx.fillStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, 0.4)`;
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset - size * 0.08, size * 0.25, size * 0.15, 0, Math.PI, Math.PI * 2);
            ctx.fill();
            
            // Rim lights
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + enc.pulsePhase * 0.5;
                const lx = Math.cos(angle) * size * 0.55;
                const ly = Math.sin(angle) * size * 0.12 + wobbleOffset;
                ctx.fillStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${pulseIntensity})`;
                ctx.beginPath();
                ctx.arc(lx, ly, size * 0.03, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (enc.shipType === 1) {
            // Angular/stealth ship
            ctx.fillStyle = `rgb(40, 45, 55)`;
            ctx.beginPath();
            ctx.moveTo(0, wobbleOffset - size * 0.4);
            ctx.lineTo(size * 0.5, wobbleOffset + size * 0.3);
            ctx.lineTo(0, wobbleOffset + size * 0.15);
            ctx.lineTo(-size * 0.5, wobbleOffset + size * 0.3);
            ctx.closePath();
            ctx.fill();
            
            // Engine glow
            ctx.fillStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${pulseIntensity})`;
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset + size * 0.25, size * 0.15, size * 0.05, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (enc.shipType === 2) {
            // Organic/bio ship
            ctx.fillStyle = `rgb(70, 60, 80)`;
            ctx.beginPath();
            ctx.moveTo(0, wobbleOffset - size * 0.5);
            ctx.quadraticCurveTo(size * 0.4, wobbleOffset - size * 0.2, size * 0.3, wobbleOffset + size * 0.3);
            ctx.quadraticCurveTo(0, wobbleOffset + size * 0.5, -size * 0.3, wobbleOffset + size * 0.3);
            ctx.quadraticCurveTo(-size * 0.4, wobbleOffset - size * 0.2, 0, wobbleOffset - size * 0.5);
            ctx.fill();
            
            // Bioluminescent spots
            for (let i = 0; i < 5; i++) {
                const spotX = (Math.random() - 0.5) * size * 0.4;
                const spotY = wobbleOffset + (Math.random() - 0.3) * size * 0.5;
                ctx.fillStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.3 + pulseIntensity * 0.4})`;
                ctx.beginPath();
                ctx.arc(spotX, spotY, size * 0.04, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Crystalline ship
            ctx.fillStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, 0.3)`;
            ctx.strokeStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, 0.8)`;
            ctx.lineWidth = 2;
            
            // Main crystal
            ctx.beginPath();
            ctx.moveTo(0, wobbleOffset - size * 0.5);
            ctx.lineTo(size * 0.25, wobbleOffset);
            ctx.lineTo(0, wobbleOffset + size * 0.4);
            ctx.lineTo(-size * 0.25, wobbleOffset);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Side crystals
            ctx.beginPath();
            ctx.moveTo(size * 0.2, wobbleOffset - size * 0.1);
            ctx.lineTo(size * 0.45, wobbleOffset + size * 0.1);
            ctx.lineTo(size * 0.15, wobbleOffset + size * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(-size * 0.2, wobbleOffset - size * 0.1);
            ctx.lineTo(-size * 0.45, wobbleOffset + size * 0.1);
            ctx.lineTo(-size * 0.15, wobbleOffset + size * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        ctx.restore();
    }

    function drawComets() {
        if (comets.length < maxComets && Math.random() < 0.006) {
            comets.push(createComet());
        }

        for (let i = comets.length - 1; i >= 0; i--) {
            const c = comets[i];
            
            // Move comet
            c.x += c.vx;
            c.y += c.vy;
            c.z -= flightSpeed * 4;

            // 3D projection
            const scale = 300 / Math.max(10, c.z);
            const x = centerX + c.x * scale;
            const y = centerY + c.y * scale;
            const size = c.baseSize * scale;
            const tailLength = c.tailLength * scale;

            // Remove if off screen
            const buffer = tailLength + 100;
            if (x < -buffer || x > width + buffer || y < -buffer || y > height + buffer) {
                comets.splice(i, 1);
                continue;
            }

            if (size < 1) continue;

            const depthFade = Math.min(1, (1 - c.z / 1200) * 1.5);
            const edgeFade = getEdgeFade(x, y, 150);
            const totalFade = depthFade * edgeFade;
            
            if (totalFade < 0.05) continue;

            const angle = Math.atan2(c.vy, c.vx);

            ctx.save();
            ctx.globalAlpha = totalFade;
            ctx.translate(x, y);
            ctx.rotate(angle + Math.PI);

            const tailGrad = ctx.createLinearGradient(0, 0, tailLength, 0);
            tailGrad.addColorStop(0, `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, 0.9)`);
            tailGrad.addColorStop(0.3, `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, 0.4)`);
            tailGrad.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(tailLength, 0);
            ctx.lineTo(0, size);
            ctx.closePath();
            ctx.fillStyle = tailGrad;
            ctx.fill();

            const comaGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 4);
            comaGrad.addColorStop(0, `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, 0.7)`);
            comaGrad.addColorStop(0.4, `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, 0.2)`);
            comaGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = comaGrad;
            ctx.beginPath();
            ctx.arc(0, 0, size * 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 255, 255, 0.95)`;
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    function animate() {
        time += 0.016;
        spectrumHue = (spectrumHue + spectrumSpeed) % 360;

        drawBackground();
        drawGasClouds();
        drawStars();
        drawEncounters();
        drawBrightStars();
        drawComets();

        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(animationId);
        else animate();
    });
}
