document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initSpaceScene();
    initChromeEffects();
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

function initChromeEffects() {
    initButtonRipples();
    initCardTiltEffects();
    initButtonShineEffects();
    initScrollIndicator();
    initAboutImageEffect();
}

function initButtonRipples() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'chrome-ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
            
            this.appendChild(ripple);
            
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}

function initCardTiltEffects() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        card.appendChild(shine);
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / centerY * 8;
            const tiltY = (centerX - x) / centerX * 8;
            
            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px) scale(1.02)`;
            
            shine.style.left = x + 'px';
            shine.style.top = y + 'px';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
}

function initButtonShineEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        // Create shine element
        const shine = document.createElement('div');
        shine.className = 'btn-shine';
        btn.appendChild(shine);
        
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Move the shine element
            shine.style.left = x + 'px';
            shine.style.top = y + 'px';
        });
    });
    
    // Also add shine to contact links
    const contactLinks = document.querySelectorAll('.contact__link');
    contactLinks.forEach(link => {
        const shine = document.createElement('div');
        shine.className = 'btn-shine';
        link.appendChild(shine);
        
        link.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            shine.style.left = x + 'px';
            shine.style.top = y + 'px';
        });
    });
    
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / centerY * 10;
            const tiltY = (centerX - x) / centerX * 10;
            
            this.style.transform = `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px) scale(1.08)`;
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        category.appendChild(shine);
        
        category.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / centerY * 8;
            const tiltY = (centerX - x) / centerX * 8;
            
            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px) scale(1.02)`;
            
            shine.style.left = x + 'px';
            shine.style.top = y + 'px';
        });
        
        category.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
}

function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero__scroll');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const navHeight = document.getElementById('nav')?.offsetHeight || 0;
                const targetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    }
}

function initAboutImageEffect() {
    const aboutImage = document.querySelector('.about__image-placeholder');
    if (aboutImage) {
        aboutImage.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / centerY * 6;
            const tiltY = (centerX - x) / centerX * 6;
            
            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        });
        
        aboutImage.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
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
    const spectrumSpeed = 0.08; // Faster color cycling

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
            wobbleSpeed: 0.001 + Math.random() * 0.002, // Slower wobble to prevent flicker
            stretch: 0.5 + Math.random() * 0.7,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.004, // Gentler rotation
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

    // Archetypal planet types - expanded variety
    const planetTypes = [
        // Dwarf planets and small rocky bodies
        { 
            type: 'dwarf-gray',
            colors: [[120, 115, 110], [100, 95, 90], [140, 135, 130], [80, 75, 70]],
            hasBands: false, hasStorm: false, hasCraters: true, hasRingChance: 0,
            isDwarf: true, maxMoons: 1
        },
        { 
            type: 'dwarf-dark',
            colors: [[60, 55, 50], [50, 45, 40], [70, 65, 60], [40, 35, 30]],
            hasBands: false, hasStorm: false, hasCraters: true, hasRingChance: 0,
            isDwarf: true, maxMoons: 0
        },
        { 
            type: 'dwarf-brown',
            colors: [[100, 80, 60], [80, 60, 45], [120, 100, 80], [70, 55, 40]],
            hasBands: false, hasStorm: false, hasCraters: true, hasRingChance: 0,
            isDwarf: true, maxMoons: 1
        },
        { 
            type: 'dwarf-ice',
            colors: [[180, 190, 200], [160, 170, 180], [200, 210, 220], [140, 150, 160]],
            hasBands: false, hasStorm: false, hasCraters: true, hasRingChance: 0,
            isDwarf: true, maxMoons: 1
        },
        { 
            type: 'asteroid-rock',
            colors: [[90, 85, 80], [70, 65, 60], [110, 105, 100], [55, 50, 45]],
            hasBands: false, hasStorm: false, hasCraters: true, hasRingChance: 0,
            isDwarf: true, maxMoons: 0
        },
        { 
            type: 'dwarf-reddish',
            colors: [[130, 90, 70], [110, 75, 55], [150, 105, 85], [95, 60, 45]],
            hasBands: false, hasStorm: false, hasCraters: true, hasRingChance: 0,
            isDwarf: true, maxMoons: 1
        },
        // Regular planets
        { 
            type: 'gas-giant',
            colors: [[210, 180, 140], [230, 200, 160], [180, 140, 100], [160, 120, 80]],
            hasBands: true, hasStorm: true, hasSwirls: true, hasRingChance: 0.7,
            ringColor: [220, 200, 170]
        },
        { 
            type: 'gas-giant-blue',
            colors: [[100, 130, 180], [120, 150, 200], [80, 110, 160], [140, 170, 220]],
            hasBands: true, hasStorm: true, hasSwirls: true, hasRingChance: 0.5,
            ringColor: [150, 180, 220]
        },
        { 
            type: 'gas-giant-orange',
            colors: [[220, 160, 100], [240, 180, 120], [200, 140, 80], [180, 120, 60]],
            hasBands: true, hasStorm: true, hasSwirls: true, hasRingChance: 0.6,
            ringColor: [230, 200, 160]
        },
        { 
            type: 'gas-giant-red',
            colors: [[180, 100, 80], [200, 120, 100], [160, 80, 60], [220, 140, 120]],
            hasBands: true, hasStorm: true, hasSwirls: true, hasRingChance: 0.4,
            ringColor: [200, 150, 130]
        },
        { 
            type: 'earth-like',
            colors: [[60, 130, 80], [80, 150, 100], [50, 110, 60], [70, 140, 90]],
            hasBands: false, hasStorm: false, hasContinents: true, hasClouds: true, hasRingChance: 0.02,
            oceanColor: [30, 80, 160], continentColor: [60, 130, 80]
        },
        { 
            type: 'earth-like-arid',
            colors: [[160, 140, 100], [180, 160, 120], [140, 120, 80], [170, 150, 110]],
            hasBands: false, hasStorm: false, hasContinents: true, hasClouds: true, hasRingChance: 0.02,
            oceanColor: [40, 90, 150], continentColor: [160, 140, 100]
        },
        { 
            type: 'super-earth',
            colors: [[50, 120, 70], [70, 140, 90], [40, 100, 50], [60, 130, 80]],
            hasBands: false, hasStorm: false, hasContinents: true, hasClouds: true, hasAtmosphere: true, hasRingChance: 0.05,
            oceanColor: [25, 70, 140], continentColor: [50, 120, 70], atmosphereColor: [100, 160, 220]
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
            hasBands: true, hasStorm: false, hasSwirls: true, hasRingChance: 0.5,
            ringColor: [180, 210, 240]
        },
        { 
            type: 'toxic',
            colors: [[180, 190, 100], [160, 170, 80], [200, 210, 120], [140, 150, 60]],
            hasBands: false, hasStorm: false, hasClouds: true, hasRingChance: 0.1,
            cloudColor: [200, 200, 100]
        },
        { 
            type: 'rocky',
            colors: [[140, 130, 120], [120, 110, 100], [160, 150, 140], [100, 90, 80]],
            hasBands: false, hasStorm: false, hasCraters: true, hasRingChance: 0.05,
        },
        { 
            type: 'mars-like',
            colors: [[180, 100, 70], [160, 80, 50], [200, 120, 90], [140, 70, 40]],
            hasBands: false, hasStorm: false, hasCraters: true, hasPolarCaps: true, hasRingChance: 0.02,
        },
        { 
            type: 'purple-exotic',
            colors: [[140, 80, 160], [120, 60, 140], [160, 100, 180], [100, 50, 120]],
            hasBands: true, hasStorm: false, hasRingChance: 0.4, hasAtmosphere: true,
            ringColor: [180, 140, 200], atmosphereColor: [180, 120, 200]
        },
        { 
            type: 'striped',
            colors: [[220, 200, 180], [180, 160, 140], [200, 180, 160], [240, 220, 200]],
            hasBands: true, hasStorm: false, hasSwirls: true, hasRingChance: 0.6, boldBands: true,
            ringColor: [210, 190, 170]
        },
        { 
            type: 'volcanic',
            colors: [[50, 45, 40], [70, 60, 50], [40, 35, 30], [60, 50, 40]],
            hasBands: false, hasStorm: false, hasLava: true, hasAtmosphere: true, hasRingChance: 0.02,
            glowColor: [255, 80, 0], atmosphereColor: [255, 100, 50]
        },
        { 
            type: 'crystalline',
            colors: [[180, 220, 240], [160, 200, 220], [200, 240, 255], [140, 180, 200]],
            hasBands: false, hasStorm: false, hasCracks: true, hasShimmer: true, hasRingChance: 0.3,
            ringColor: [200, 230, 250]
        },
        { 
            type: 'cotton-candy',
            colors: [[255, 180, 220], [200, 160, 255], [255, 200, 240], [180, 140, 230]],
            hasBands: true, hasStorm: false, hasSwirls: true, hasRingChance: 0.5, hasClouds: true,
            ringColor: [255, 200, 230], cloudColor: [255, 255, 255]
        },
        { 
            type: 'neon-toxic',
            colors: [[0, 255, 180], [80, 255, 120], [0, 200, 150], [60, 230, 100]],
            hasBands: true, hasStorm: true, hasSwirls: true, hasRingChance: 0.3, hasAtmosphere: true,
            ringColor: [100, 255, 200], atmosphereColor: [0, 255, 150]
        },
        { 
            type: 'midnight',
            colors: [[30, 20, 60], [50, 30, 80], [20, 15, 50], [40, 25, 70]],
            hasBands: true, hasStorm: false, hasSwirls: true, hasRingChance: 0.6, hasAtmosphere: true,
            ringColor: [80, 60, 120], atmosphereColor: [100, 80, 180]
        },
        { 
            type: 'bubblegum',
            colors: [[255, 100, 150], [255, 130, 180], [230, 80, 130], [255, 160, 200]],
            hasBands: false, hasStorm: false, hasClouds: true, hasRingChance: 0.4,
            cloudColor: [255, 220, 240], ringColor: [255, 180, 210]
        },
        { 
            type: 'rust',
            colors: [[180, 80, 50], [150, 60, 30], [200, 100, 70], [130, 50, 25]],
            hasBands: false, hasStorm: false, hasCraters: true, hasDunes: true, hasRingChance: 0.1,
        },
        { 
            type: 'aurora',
            colors: [[50, 200, 150], [100, 180, 220], [80, 220, 180], [60, 160, 200]],
            hasBands: true, hasStorm: false, hasSwirls: true, hasRingChance: 0.5, hasAtmosphere: true,
            ringColor: [100, 220, 200], atmosphereColor: [80, 255, 200]
        },
        { 
            type: 'copper',
            colors: [[200, 140, 100], [180, 120, 80], [220, 160, 120], [160, 100, 60]],
            hasBands: false, hasStorm: false, hasCraters: true, hasShimmer: true, hasRingChance: 0.2,
            ringColor: [210, 170, 130]
        },
        { 
            type: 'void',
            colors: [[20, 20, 30], [30, 30, 45], [15, 15, 25], [25, 25, 40]],
            hasBands: false, hasStorm: false, hasCracks: true, hasRingChance: 0.7, hasAtmosphere: true,
            ringColor: [60, 60, 80], atmosphereColor: [80, 80, 120], glowColor: [100, 100, 150]
        },
        { 
            type: 'candy-corn',
            colors: [[255, 180, 50], [255, 140, 30], [255, 220, 100], [255, 100, 20]],
            hasBands: true, hasStorm: true, hasSwirls: true, hasRingChance: 0.4, boldBands: true,
            ringColor: [255, 200, 120]
        },
        { 
            type: 'mint',
            colors: [[150, 230, 200], [130, 210, 180], [170, 245, 220], [110, 190, 160]],
            hasBands: false, hasStorm: false, hasClouds: true, hasOceans: true, hasRingChance: 0.3,
            oceanColor: [100, 180, 160], cloudColor: [220, 255, 240], ringColor: [180, 240, 220]
        },
        { 
            type: 'lavender',
            colors: [[180, 160, 220], [200, 180, 240], [160, 140, 200], [220, 200, 255]],
            hasBands: true, hasStorm: false, hasSwirls: true, hasClouds: true, hasRingChance: 0.5,
            cloudColor: [240, 230, 255], ringColor: [200, 190, 230]
        },
        { 
            type: 'blood-orange',
            colors: [[200, 60, 40], [180, 40, 20], [220, 80, 60], [160, 30, 15]],
            hasBands: true, hasStorm: true, hasSwirls: true, hasRingChance: 0.3, hasAtmosphere: true,
            ringColor: [220, 100, 80], atmosphereColor: [255, 100, 60]
        },
        { 
            type: 'seafoam',
            colors: [[100, 200, 180], [80, 180, 160], [120, 220, 200], [60, 160, 140]],
            hasBands: false, hasStorm: false, hasContinents: true, hasClouds: true, hasRingChance: 0.2,
            oceanColor: [60, 140, 150], continentColor: [140, 200, 160], cloudColor: [230, 255, 250]
        },
        { 
            type: 'obsidian',
            colors: [[40, 35, 50], [55, 50, 65], [30, 25, 40], [50, 45, 60]],
            hasBands: false, hasStorm: false, hasCracks: true, hasShimmer: true, hasRingChance: 0.4,
            ringColor: [80, 75, 100], glowColor: [120, 100, 180]
        },
        { 
            type: 'peach',
            colors: [[255, 200, 170], [255, 180, 150], [255, 220, 190], [240, 160, 130]],
            hasBands: false, hasStorm: false, hasClouds: true, hasAtmosphere: true, hasRingChance: 0.3,
            cloudColor: [255, 240, 230], atmosphereColor: [255, 180, 150], ringColor: [255, 210, 180]
        },
        { 
            type: 'electric-blue',
            colors: [[30, 100, 255], [50, 120, 255], [20, 80, 230], [70, 140, 255]],
            hasBands: true, hasStorm: true, hasSwirls: true, hasRingChance: 0.5, hasAtmosphere: true,
            ringColor: [100, 160, 255], atmosphereColor: [80, 140, 255]
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
        
        // Spawn planets on left OR right side to avoid covering hero text
        const spawnOnLeft = Math.random() > 0.5;
        
        if (initialSpawn) {
            // Initial spawn - visible immediately, on left or right side
            z = 300 + Math.random() * 400;
            const xOffset = 150 + Math.random() * 200; // Far enough from center
            x = spawnOnLeft ? -xOffset : xOffset;
            y = (Math.random() - 0.5) * 300; // Vertical variance
        } else {
            // Spawn far away - on left or right side
            z = 1000 + Math.random() * 400;
            const xOffset = 120 + Math.random() * 200; // Offset ensures it stays on one side
            x = spawnOnLeft ? -xOffset : xOffset;
            y = (Math.random() - 0.5) * 350; // Vertical variance
        }
        
        // Generate random craters for rocky planets
        let craters = [];
        if (typeData.hasCraters) {
            const craterCount = 5 + Math.floor(Math.random() * 8);
            for (let i = 0; i < craterCount; i++) {
                craters.push({
                    angle: Math.random() * Math.PI * 2,
                    lat: (Math.random() - 0.5) * 0.8,
                    size: 0.05 + Math.random() * 0.12,
                });
            }
        }
        
        // Generate continents for Earth-like planets
        let continents = [];
        if (typeData.hasContinents) {
            const continentCount = 3 + Math.floor(Math.random() * 4);
            for (let i = 0; i < continentCount; i++) {
                // Generate irregular continent shape with multiple lobes
                const lobes = [];
                const lobeCount = 2 + Math.floor(Math.random() * 3);
                for (let l = 0; l < lobeCount; l++) {
                    lobes.push({
                        offsetAngle: (Math.random() - 0.5) * 0.4,
                        offsetLat: (Math.random() - 0.5) * 0.3,
                        size: 0.3 + Math.random() * 0.4,
                    });
                }
                continents.push({
                    angle: (i / continentCount) * Math.PI * 2 + Math.random() * 0.5,
                    lat: (Math.random() - 0.5) * 0.7,
                    size: 0.15 + Math.random() * 0.2,
                    lobes: lobes,
                });
            }
        }
        
        // Generate swirl patterns for gas giants
        let swirls = [];
        if (typeData.hasSwirls) {
            const swirlCount = 4 + Math.floor(Math.random() * 5);
            for (let i = 0; i < swirlCount; i++) {
                swirls.push({
                    x: (Math.random() - 0.5) * 0.7,
                    y: (Math.random() - 0.5) * 0.6,
                    size: 0.08 + Math.random() * 0.15,
                    rotation: Math.random() * Math.PI * 2,
                    direction: Math.random() > 0.5 ? 1 : -1,
                });
            }
        }
        
        // Determine size based on planet type
        let baseSize;
        if (typeData.isDwarf) {
            baseSize = 8 + Math.random() * 18; // Small: 8-26
        } else {
            baseSize = 30 + Math.random() * 130; // Regular: 30-160
        }
        
        // Generate moons with weighted distribution
        // 0 moons: ~40%, 1 moon: ~35%, 2 moons: ~15%, 3+ moons: ~10%
        let moonCount = 0;
        const maxMoons = typeData.maxMoons !== undefined ? typeData.maxMoons : 5;
        if (maxMoons > 0) {
            const moonRoll = Math.random();
            if (moonRoll < 0.40) {
                moonCount = 0;
            } else if (moonRoll < 0.75) {
                moonCount = 1;
            } else if (moonRoll < 0.90) {
                moonCount = 2;
            } else if (moonRoll < 0.97) {
                moonCount = 3;
            } else {
                moonCount = 4;
            }
            moonCount = Math.min(moonCount, maxMoons);
        }
        
        // Create moon data
        const moons = [];
        for (let m = 0; m < moonCount; m++) {
            const moonOrbitRadius = baseSize * (0.8 + m * 0.4 + Math.random() * 0.3);
            const moonSize = 2 + Math.random() * 4 + (typeData.isDwarf ? 0 : Math.random() * 3);
            moons.push({
                orbitRadius: moonOrbitRadius,
                orbitSpeed: 0.0008 + Math.random() * 0.0012,
                orbitPhase: Math.random() * Math.PI * 2,
                size: moonSize,
                color: [
                    140 + Math.floor(Math.random() * 60),
                    135 + Math.floor(Math.random() * 60),
                    130 + Math.floor(Math.random() * 60),
                ],
            });
        }
        
        return {
            encounterType: 'planet',
            x, y, z,
            baseSize: baseSize,
            planetType: typeData.type,
            isDwarf: typeData.isDwarf || false,
            moons: moons,
            colors: variedColors,
            hasBands: typeData.hasBands,
            boldBands: typeData.boldBands || false,
            hasStorm: typeData.hasStorm && Math.random() > 0.3,
            hasSwirls: typeData.hasSwirls || false,
            hasCracks: typeData.hasCracks || false,
            hasLava: typeData.hasLava || false,
            hasOceans: typeData.hasOceans || false,
            hasClouds: typeData.hasClouds || false,
            hasDunes: typeData.hasDunes || false,
            hasCraters: typeData.hasCraters || false,
            hasPolarCaps: typeData.hasPolarCaps || false,
            hasAtmosphere: typeData.hasAtmosphere || false,
            hasShimmer: typeData.hasShimmer || false,
            hasContinents: typeData.hasContinents || false,
            craters: craters,
            continents: continents,
            swirls: swirls,
            continentColor: typeData.continentColor ? [
                Math.round(Math.min(255, Math.max(0, typeData.continentColor[0] + (Math.random() - 0.5) * 25))),
                Math.round(Math.min(255, Math.max(0, typeData.continentColor[1] + (Math.random() - 0.5) * 25))),
                Math.round(Math.min(255, Math.max(0, typeData.continentColor[2] + (Math.random() - 0.5) * 25))),
            ] : null,
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
            atmosphereColor: typeData.atmosphereColor ? [
                Math.round(Math.min(255, Math.max(0, typeData.atmosphereColor[0] + (Math.random() - 0.5) * 20))),
                Math.round(Math.min(255, Math.max(0, typeData.atmosphereColor[1] + (Math.random() - 0.5) * 20))),
                Math.round(Math.min(255, Math.max(0, typeData.atmosphereColor[2] + (Math.random() - 0.5) * 20))),
            ] : null,
            stormPos: { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.3 },
            stormSize: 0.12 + Math.random() * 0.18, // Larger storms
            hasRing: hasRing,
            ringSystems: ringSystems,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: 0.0003 + Math.random() * 0.0015, // Slower, smoother rotation
            axialTilt: (Math.random() - 0.5) * 0.3, // Slight axial tilt
            bandOffset: Math.random() * 1000,
            bandCount: 5 + Math.floor(Math.random() * 8), // More band variation
            crackSeed: Math.random() * 10000,
            crackCount: 3 + Math.floor(Math.random() * 6), // Vary crack count
            cloudCount: 2 + Math.floor(Math.random() * 5), // Vary cloud count
            oceanCount: 1 + Math.floor(Math.random() * 4), // Vary ocean patches
            shimmerPhase: Math.random() * Math.PI * 2,
        };
    }

    function createBlackHole() {
        const spawnZ = 1000 + Math.random() * 400;
        
        // Spawn black holes on left OR right side to avoid covering hero text
        const spawnOnLeft = Math.random() > 0.5;
        const xOffset = 140 + Math.random() * 180; // Far enough from center
        const x = spawnOnLeft ? -xOffset : xOffset;
        const y = (Math.random() - 0.5) * 300; // Vertical variance
        
        return {
            type: 'blackHole',
            x: x,
            y: y,
            z: spawnZ,
            baseSize: 30 + Math.random() * 40,
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
            
            // Pre-generate the shape vertices so they don't flicker every frame
            const sides = 4 + Math.floor(Math.random() * 3);
            const vertices = [];
            for (let v = 0; v < sides; v++) {
                vertices.push({
                    angle: (v / sides) * Math.PI * 2,
                    radius: 0.6 + Math.random() * 0.4
                });
            }
            
            pieces.push({
                x: Math.cos(pieceAngle) * pieceDist,
                y: Math.sin(pieceAngle) * pieceDist,
                size: 0.1 + Math.random() * 0.3,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.05,
                color: Math.random() > 0.3 ? [80, 80, 90] : [60, 50, 40],
                vertices: vertices,
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
        const dist = 100 + Math.random() * 150; // Avoid center
        
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

    function createProminentStar() {
        const spawnZ = 1000 + Math.random() * 400;
        const angle = Math.random() * Math.PI * 2;
        const dist = 90 + Math.random() * 140; // Avoid center
        
        // Star types - small, just slightly larger than background stars
        const prominentStarTypes = [
            { name: 'blue', color: [140, 170, 255], coronaColor: [100, 140, 255], size: 3 + Math.random() * 2.5 },
            { name: 'red', color: [255, 140, 100], coronaColor: [255, 100, 60], size: 4 + Math.random() * 3 },
            { name: 'white', color: [255, 255, 255], coronaColor: [200, 220, 255], size: 3 + Math.random() * 2 },
            { name: 'yellow', color: [255, 240, 180], coronaColor: [255, 200, 100], size: 3.5 + Math.random() * 2.5 },
            { name: 'orange', color: [255, 180, 100], coronaColor: [255, 140, 60], size: 3.5 + Math.random() * 3 },
        ];
        
        const starType = prominentStarTypes[Math.floor(Math.random() * prominentStarTypes.length)];
        
        return {
            type: 'prominentStar',
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            z: spawnZ,
            baseSize: starType.size,
            starType: starType.name,
            color: starType.color,
            coronaColor: starType.coronaColor,
            pulsePhase: Math.random() * Math.PI * 2,
        };
    }

    function createAlienShip() {
        const spawnZ = 1000 + Math.random() * 400;
        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 150; // Avoid center
        
        // Ship types with weighted rarity:
        // 0: classic UFO saucer (common)
        // 1: space shuttle (common)
        // 3: triangular UFO (common)
        // 4: Interstellar Endurance (rare)
        // 5: Death Star (very rare)
        const shipRoll = Math.random();
        let shipType;
        if (shipRoll < 0.30) {
            shipType = 0; // UFO saucer - 30%
        } else if (shipRoll < 0.60) {
            shipType = 1; // Space shuttle - 30%
        } else if (shipRoll < 0.88) {
            shipType = 3; // Triangle - 28%
        } else if (shipRoll < 0.96) {
            shipType = 4; // Endurance - 8% (rare)
        } else {
            shipType = 5; // Death Star - 4% (very rare)
        }
        
        // Glow colors for UFOs, engine colors for shuttles
        const glowColors = [
            [100, 255, 200], // Cyan-green
            [255, 100, 255], // Magenta
            [100, 200, 255], // Light blue
            [255, 150, 50],  // Orange
            [255, 80, 80],   // Red
            [255, 220, 100], // Yellow
            [180, 100, 255], // Purple
            [100, 255, 150], // Green
        ];
        let glowColor;
        if (shipType === 1) {
            glowColor = [255, 150, 50]; // Shuttle engine orange
        } else if (shipType === 4) {
            glowColor = [200, 220, 255]; // Endurance white-blue
        } else if (shipType === 5) {
            glowColor = [100, 255, 100]; // Death Star green
        } else {
            glowColor = glowColors[Math.floor(Math.random() * glowColors.length)];
        }
        
        // Size varies by ship type
        let baseSize;
        if (shipType === 4) {
            baseSize = 60 + Math.random() * 40; // Endurance - medium-large
        } else if (shipType === 5) {
            baseSize = 80 + Math.random() * 60; // Death Star - large
        } else {
            baseSize = 40 + Math.random() * 50; // Others - normal
        }
        
        // UFO-specific variance
        let ufoStyle = null;
        if (shipType === 0) {
            // Different UFO hull colors
            const hullStyles = [
                { hull: [75, 80, 90], hullLight: [100, 105, 115], hullDark: [55, 60, 70] }, // Classic silver
                { hull: [60, 70, 85], hullLight: [85, 95, 115], hullDark: [40, 50, 65] },   // Blue-steel
                { hull: [85, 75, 70], hullLight: [115, 100, 95], hullDark: [60, 55, 50] },  // Bronze
                { hull: [50, 55, 50], hullLight: [80, 90, 80], hullDark: [35, 40, 35] },    // Dark green
                { hull: [90, 85, 80], hullLight: [120, 115, 110], hullDark: [65, 60, 55] }, // Warm grey
                { hull: [70, 70, 80], hullLight: [100, 100, 115], hullDark: [50, 50, 60] }, // Purple-grey
                { hull: [40, 45, 55], hullLight: [70, 75, 90], hullDark: [25, 30, 40] },    // Dark navy
                { hull: [80, 60, 50], hullLight: [110, 85, 75], hullDark: [55, 40, 35] },   // Copper
            ];
            const hullStyle = hullStyles[Math.floor(Math.random() * hullStyles.length)];
            
            // Dome styles
            const domeStyles = ['bubble', 'flat', 'tall', 'segmented'];
            const domeStyle = domeStyles[Math.floor(Math.random() * domeStyles.length)];
            
            // Rim light count and style
            const rimLightCount = 6 + Math.floor(Math.random() * 10);
            const rimLightStyle = Math.random() > 0.5 ? 'chase' : 'pulse';
            
            // Saucer shape variants
            const saucerShapes = ['classic', 'slim', 'thick', 'ringed'];
            const saucerShape = saucerShapes[Math.floor(Math.random() * saucerShapes.length)];
            
            ufoStyle = {
                hull: hullStyle.hull,
                hullLight: hullStyle.hullLight,
                hullDark: hullStyle.hullDark,
                domeStyle,
                rimLightCount,
                rimLightStyle,
                saucerShape,
                hasAntenna: Math.random() > 0.7,
                hasUnderGlow: Math.random() > 0.3,
                secondaryGlow: Math.random() > 0.6 ? glowColors[Math.floor(Math.random() * glowColors.length)] : null,
            };
        }
        
        return {
            type: 'alienShip',
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            z: spawnZ,
            baseSize,
            shipType,
            glowColor,
            ufoStyle,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: shipType === 4 ? 0.015 : (Math.random() - 0.5) * 0.008, // Endurance rotates steadily
            pulsePhase: Math.random() * Math.PI * 2,
            wobble: Math.random() * Math.PI * 2,
            ringAngle: Math.random() * Math.PI * 2, // For Endurance ring rotation
        };
    }

    function createRandomEncounter() {
        // Weighted random selection
        const roll = Math.random();
        let type;
        
        if (roll < 0.38) {
            type = 'planet';
        } else if (roll < 0.58) {
            type = 'prominentStar';
        } else if (roll < 0.76) {
            type = 'spaceStation';
        } else if (roll < 0.95) {
            type = 'alienShip';
        } else {
            type = 'blackHole'; // Very rare - only 5%
        }
        
        // Avoid same type twice in a row
        if (type === lastEncounterType && Math.random() > 0.3) {
            const types = ['planet', 'prominentStar', 'spaceStation', 'alienShip'];
            type = types[Math.floor(Math.random() * types.length)];
        }
        lastEncounterType = type;
        
        switch (type) {
            case 'planet': return createPlanet();
            case 'prominentStar': return createProminentStar();
            case 'blackHole': return createBlackHole();
            case 'spaceStation': return createSpaceStation();
            case 'alienShip': return createAlienShip();
            default: return createPlanet();
        }
    }

    function createComet() {
        // Comets fly across the field of view at various depths
        // Saturated, vivid colors
        const colors = [
            [255, 220, 80],   // Bright gold/yellow
            [255, 180, 50],   // Orange-yellow
            [100, 180, 255],  // Bright blue
            [80, 220, 255],   // Cyan
            [255, 255, 200],  // Warm white
            [200, 255, 180],  // Pale green
            [255, 160, 100],  // Warm orange
            [180, 200, 255],  // Ice blue
        ];
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

    function updateGasClouds() {
        // Update all cloud positions and animations in one pass
        for (let i = 0; i < gasClouds.length; i++) {
            const cloud = gasClouds[i];
            
            cloud.z -= flightSpeed * 3;
            cloud.wobble += cloud.wobbleSpeed;
            cloud.rotation += cloud.rotationSpeed;
            
            // Update puff animations
            if (cloud.puffs) {
                for (let p = 0; p < cloud.puffs.length; p++) {
                    const puff = cloud.puffs[p];
                    puff.driftAngle += puff.driftSpeed * 0.5;
                    puff.pulsePhase += puff.pulseSpeed * 0.5;
                }
            }
            
            // Reset if cloud passed through viewer
            if (cloud.z < 20) {
                resetGasCloud(cloud);
            }
        }
        
        // Sort once per frame (not per render pass)
        gasClouds.sort((a, b) => b.z - a.z);
    }

    function drawGasClouds(minZ = 0, maxZ = Infinity) {
        const maxVisibleZ = 1800;
        const fullVisibleZ = 300;
        const fadeRange = maxVisibleZ - fullVisibleZ;

        for (let i = 0; i < gasClouds.length; i++) {
            const cloud = gasClouds[i];
            
            // Skip clouds outside our z-range for this pass
            // Use <= for minZ to avoid gaps at boundary
            if (cloud.z <= minZ || cloud.z > maxZ) {
                continue;
            }
            
            // Early exit for invisible clouds
            if (cloud.z > maxVisibleZ) {
                continue;
            }

            // Skip clouds that were reset
            if (cloud.z < 20) {
                continue;
            }

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
            // Smoother ease-in-out curve for gentler transitions
            const smoothFade = depthFade < 0.5 
                ? 2 * depthFade * depthFade 
                : 1 - Math.pow(-2 * depthFade + 2, 2) / 2;
            const edgeFade = getEdgeFade(x, y, 200);
            // Removed wobble modifier on opacity to prevent flickering
            const baseOpacity = cloud.opacity * smoothFade * edgeFade * 0.28;

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

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(cloud.rotation);
            ctx.scale(1, cloud.stretch);
            
            // Draw all puffs with uniform opacity
            const puffs = cloud.puffs;
            const puffCount = puffs.length;
            
            // Render all puffs - use uniform opacity based on cloud opacity (no per-puff LOD fade)
            for (let p = 0; p < puffCount; p++) {
                const puff = puffs[p];
                
                // Use pre-calculated drift positions (animations updated in updateGasClouds)
                const driftX = Math.cos(puff.driftAngle) * puff.driftRadius * 0.5;
                const driftY = Math.sin(puff.driftAngle) * puff.driftRadius * 0.3;
                const animatedX = puff.baseX + driftX;
                const animatedY = puff.baseY + driftY;
                
                const puffX = animatedX * radius;
                const puffY = animatedY * radius;
                const pulseAmount = puff.pulseAmount * 0.5;
                const pulse = 1 + Math.sin(puff.pulsePhase) * pulseAmount;
                const puffRadius = radius * puff.size * pulse;
                
                // Skip if too small
                if (puffRadius < 4) continue;
                
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

    // Update encounter position and state (separate from drawing for z-ordering)
    function updateEncounter() {
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
        if (enc.warpPhase !== undefined) enc.warpPhase += 0.008;
        if (enc.pulsePhase !== undefined) enc.pulsePhase += 0.015;
        if (enc.wobble !== undefined) enc.wobble += 0.01;
        if (enc.lightPhase !== undefined) enc.lightPhase += 0.025;
        if (enc.flarePhase !== undefined) enc.flarePhase += 0.008;
        if (enc.shimmerPhase !== undefined) enc.shimmerPhase += 0.015;
        if (enc.ringAngle !== undefined) enc.ringAngle += 0.012; // Endurance ring rotation
        
        // Update moon orbits
        if (enc.moons && enc.moons.length > 0) {
            enc.moons.forEach(moon => {
                moon.orbitPhase += moon.orbitSpeed;
            });
        }
        
        // Update debris piece rotations
        if (enc.pieces) {
            enc.pieces.forEach(p => p.rotation += p.rotSpeed);
        }
        
        // Center avoidance - push encounters away from center as they get closer
        // This ensures we never fly "through" a planet or station
        const encType = enc.encounterType || enc.type;
        
        // Planets and black holes need stronger center avoidance to not cover hero text
        if (encType === 'planet' || encType === 'blackHole') {
            const minXDist = 100; // Minimum horizontal distance from center
            const proximityFactor = Math.max(0, 1 - enc.z / 800);
            
            // Keep planets/black holes on their original side (left or right)
            if (Math.abs(enc.x) < minXDist + proximityFactor * 60) {
                // Push horizontally away from center
                const pushDir = enc.x >= 0 ? 1 : -1;
                const pushStrength = (1 - Math.abs(enc.x) / (minXDist + 60)) * proximityFactor * 3;
                enc.x += pushDir * pushStrength;
            }
        } else if (encType !== 'blackHole') {
            // Other encounters (stations, ships, stars) use the original center avoidance
            const distFromCenter = Math.sqrt(enc.x * enc.x + enc.y * enc.y);
            const minDist = 60; // Minimum world-space distance from center
            
            // The closer the encounter (lower z), the stronger the push
            const proximityFactor = Math.max(0, 1 - enc.z / 800);
            
            if (distFromCenter < minDist + proximityFactor * 80) {
                // Calculate push direction (away from center)
                const pushAngle = Math.atan2(enc.y, enc.x);
                const pushStrength = (1 - distFromCenter / (minDist + 80)) * proximityFactor * 2;
                
                enc.x += Math.cos(pushAngle) * pushStrength;
                enc.y += Math.sin(pushAngle) * pushStrength;
            }
        }
    }
    
    // Get current encounter z for z-ordering with clouds
    function getEncounterZ() {
        return currentEncounter ? currentEncounter.z : -1;
    }

    // Unified encounter system - handles planets, black holes, debris, stations, ships
    function drawEncounters() {
        if (!currentEncounter) return;
        
        const enc = currentEncounter;
        
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
            case 'prominentStar':
                drawProminentStarEncounter(enc, x, y, size, totalFade);
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
                    // Bold bands have higher contrast
                    const baseBandOpacity = p.boldBands ? 0.55 : 0.4;
                    const bandOpacityVariance = p.boldBands ? 0.25 : 0.2;
                    const bandOpacity = baseBandOpacity + Math.sin(b * 0.8 + p.bandOffset) * bandOpacityVariance;
                    
                    ctx.fillStyle = `rgba(${Math.round(bandColor[0])}, ${Math.round(bandColor[1])}, ${Math.round(bandColor[2])}, ${bandOpacity})`;
                    ctx.beginPath();
                    const curveOffset = Math.sin(p.rotation + b * 0.4) * size * 0.02;
                    const bandHeightMult = p.boldBands ? 0.75 : 0.6;
                    ctx.ellipse(x + curveOffset, bandY + bandHeight / 2, size * 1.1, bandHeight * bandHeightMult, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Swirling cloud patterns for gas giants
            if (p.hasSwirls && p.swirls && size > 25) {
                p.swirls.forEach((swirl, idx) => {
                    const swirlX = x + swirl.x * size;
                    const swirlY = y + swirl.y * size;
                    const swirlSize = swirl.size * size;
                    const swirlRot = swirl.rotation + p.rotation * 0.5 * swirl.direction;
                    
                    // Draw spiral arms
                    ctx.save();
                    ctx.translate(swirlX, swirlY);
                    ctx.rotate(swirlRot);
                    
                    const colorIdx = idx % c.length;
                    const swirlColor = c[colorIdx];
                    if (swirlColor) {
                        // Outer swirl glow
                        const swirlGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, swirlSize * 1.2);
                        swirlGrad.addColorStop(0, `rgba(${Math.round(swirlColor[0])}, ${Math.round(swirlColor[1])}, ${Math.round(swirlColor[2])}, 0.4)`);
                        swirlGrad.addColorStop(0.5, `rgba(${Math.round(swirlColor[0])}, ${Math.round(swirlColor[1])}, ${Math.round(swirlColor[2])}, 0.2)`);
                        swirlGrad.addColorStop(1, 'transparent');
                        ctx.fillStyle = swirlGrad;
                        ctx.beginPath();
                        ctx.arc(0, 0, swirlSize * 1.2, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Spiral arms - more subtle
                        ctx.strokeStyle = `rgba(${Math.round(Math.min(255, swirlColor[0] + 20))}, ${Math.round(Math.min(255, swirlColor[1] + 20))}, ${Math.round(Math.min(255, swirlColor[2] + 20))}, 0.25)`;
                        ctx.lineWidth = swirlSize * 0.1;
                        for (let arm = 0; arm < 2; arm++) {
                            ctx.beginPath();
                            for (let t = 0; t <= 1; t += 0.1) {
                                const spiralAngle = arm * Math.PI + t * Math.PI * 1.2 * swirl.direction;
                                const spiralRadius = swirlSize * t * 0.9;
                                const sx = Math.cos(spiralAngle) * spiralRadius;
                                const sy = Math.sin(spiralAngle) * spiralRadius * 0.6;
                                if (t === 0) ctx.moveTo(sx, sy);
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();
                        }
                    }
                    ctx.restore();
                });
            }

            // Earth-like continents
            if (p.hasContinents && p.continents && p.oceanColor && size > 20) {
                // First draw ocean base
                const oc = p.oceanColor;
                ctx.fillStyle = `rgba(${Math.round(oc[0])}, ${Math.round(oc[1])}, ${Math.round(oc[2])}, 0.85)`;
                ctx.beginPath();
                ctx.arc(x, y, size * 0.98, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw continents
                const contColor = p.continentColor || [80, 140, 80];
                p.continents.forEach(cont => {
                    const contAngle = cont.angle + p.rotation * 0.8;
                    const contX = x + Math.cos(contAngle) * size * 0.35 * (1 - Math.abs(cont.lat));
                    const contY = y + cont.lat * size * 0.6;
                    const contSize = cont.size * size;
                    
                    // Main continent body
                    ctx.fillStyle = `rgba(${Math.round(contColor[0])}, ${Math.round(contColor[1])}, ${Math.round(contColor[2])}, 0.9)`;
                    ctx.beginPath();
                    ctx.ellipse(contX, contY, contSize * 1.1, contSize * 0.7, cont.angle * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Add lobes for irregular shape
                    cont.lobes.forEach(lobe => {
                        const lobeX = contX + Math.cos(cont.angle + lobe.offsetAngle) * contSize * 0.4;
                        const lobeY = contY + lobe.offsetLat * contSize * 0.8;
                        const lobeSize = contSize * lobe.size * 0.8;
                        ctx.fillStyle = `rgba(${Math.round(contColor[0] - 10)}, ${Math.round(contColor[1] - 10)}, ${Math.round(contColor[2] - 10)}, 0.85)`;
                        ctx.beginPath();
                        ctx.ellipse(lobeX, lobeY, lobeSize, lobeSize * 0.5, cont.angle * 0.3, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    
                    // Mountain/terrain highlights
                    ctx.fillStyle = `rgba(${Math.round(Math.min(255, contColor[0] + 40))}, ${Math.round(Math.min(255, contColor[1] + 30))}, ${Math.round(Math.min(255, contColor[2] + 20))}, 0.3)`;
                    ctx.beginPath();
                    ctx.ellipse(contX - contSize * 0.15, contY - contSize * 0.08, contSize * 0.25, contSize * 0.12, cont.angle * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                });
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
                    const clAngle = (cl / p.cloudCount) * Math.PI * 2 + p.rotation * 0.8;
                    const clX = x + Math.cos(clAngle) * size * 0.45;
                    const clY = y + Math.sin(clAngle) * size * 0.25;
                    const clSize = size * (0.12 + Math.sin(p.bandOffset + cl) * 0.04);
                    ctx.fillStyle = `rgba(${Math.round(cloudCol[0])}, ${Math.round(cloudCol[1])}, ${Math.round(cloudCol[2])}, 0.35)`;
                    ctx.beginPath();
                    ctx.ellipse(clX, clY, clSize * 1.3, clSize * 0.8, cl * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Storm spot for gas giants (Great Red Spot style)
            if (p.hasStorm && size > 25) {
                const stormX = x + p.stormPos.x * size;
                const stormY = y + p.stormPos.y * size;
                const sSize = size * p.stormSize;
                const stormRot = p.rotation * 0.5;
                
                ctx.save();
                ctx.translate(stormX, stormY);
                
                // Outer storm glow
                const outerGrad = ctx.createRadialGradient(0, 0, sSize * 0.2, 0, 0, sSize * 1.3);
                outerGrad.addColorStop(0, `rgba(220, 120, 90, 0.7)`);
                outerGrad.addColorStop(0.4, `rgba(200, 100, 70, 0.4)`);
                outerGrad.addColorStop(0.7, `rgba(180, 80, 50, 0.2)`);
                outerGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = outerGrad;
                ctx.beginPath();
                ctx.ellipse(0, 0, sSize * 1.3, sSize * 0.8, stormRot * 0.1, 0, Math.PI * 2);
                ctx.fill();
                
                // Storm swirl - simplified, subtle
                ctx.strokeStyle = `rgba(180, 70, 50, 0.3)`;
                ctx.lineWidth = sSize * 0.06;
                ctx.beginPath();
                ctx.ellipse(0, 0, sSize * 0.7, sSize * 0.45, stormRot * 0.15, 0, Math.PI * 2);
                ctx.stroke();
                
                // Storm eye (darker center)
                const eyeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, sSize * 0.35);
                eyeGrad.addColorStop(0, `rgba(150, 60, 40, 0.8)`);
                eyeGrad.addColorStop(0.6, `rgba(180, 80, 60, 0.5)`);
                eyeGrad.addColorStop(1, `rgba(200, 100, 80, 0.2)`);
                ctx.fillStyle = eyeGrad;
                ctx.beginPath();
                ctx.ellipse(0, 0, sSize * 0.45, sSize * 0.28, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }

            // Craters for rocky planets
            if (p.hasCraters && p.craters && size > 20) {
                p.craters.forEach(crater => {
                    const crX = x + Math.cos(crater.angle + p.rotation * 0.6) * size * (0.25 + crater.lat * 0.4);
                    const crY = y + crater.lat * size * 0.6;
                    const crSize = size * crater.size * 0.9;
                    
                    // Crater shadow
                    ctx.fillStyle = `rgba(0, 0, 0, 0.25)`;
                    ctx.beginPath();
                    ctx.ellipse(crX + crSize * 0.08, crY + crSize * 0.08, crSize, crSize * 0.65, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Crater rim highlight
                    ctx.strokeStyle = `rgba(255, 255, 255, 0.12)`;
                    ctx.lineWidth = crSize * 0.12;
                    ctx.beginPath();
                    ctx.arc(crX, crY, crSize * 0.75, Math.PI * 0.8, Math.PI * 1.8);
                    ctx.stroke();
                });
            }

            // Polar ice caps
            if (p.hasPolarCaps && size > 25) {
                // North cap
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.ellipse(x, y - size * 0.85, size * 0.4, size * 0.15, 0, 0, Math.PI * 2);
                ctx.fill();
                // South cap
                ctx.fillStyle = 'rgba(240, 245, 255, 0.5)';
                ctx.beginPath();
                ctx.ellipse(x, y + size * 0.88, size * 0.35, size * 0.12, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // Shimmer effect for crystalline planets
            if (p.hasShimmer && size > 25) {
                const shimmerCount = 6;
                for (let sh = 0; sh < shimmerCount; sh++) {
                    const shAngle = (sh / shimmerCount) * Math.PI * 2 + p.shimmerPhase * 0.5;
                    const shDist = size * (0.25 + Math.sin(p.shimmerPhase + sh) * 0.2);
                    const shX = x + Math.cos(shAngle) * shDist;
                    const shY = y + Math.sin(shAngle) * shDist * 0.6;
                    const shIntensity = Math.max(0, Math.sin(p.shimmerPhase + sh * 1.2));
                    
                    if (shIntensity > 0.6) {
                        ctx.fillStyle = `rgba(255, 255, 255, ${(shIntensity - 0.6) * 0.6})`;
                        ctx.beginPath();
                        ctx.arc(shX, shY, size * 0.025, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
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

            // Visible atmosphere glow for planets with hasAtmosphere
            if (p.hasAtmosphere && p.atmosphereColor) {
                const atmGrad = ctx.createRadialGradient(x, y, size * 0.9, x, y, size * 1.4);
                atmGrad.addColorStop(0, 'transparent');
                atmGrad.addColorStop(0.3, `rgba(${Math.round(p.atmosphereColor[0])}, ${Math.round(p.atmosphereColor[1])}, ${Math.round(p.atmosphereColor[2])}, 0.15)`);
                atmGrad.addColorStop(0.6, `rgba(${Math.round(p.atmosphereColor[0])}, ${Math.round(p.atmosphereColor[1])}, ${Math.round(p.atmosphereColor[2])}, 0.08)`);
                atmGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = atmGrad;
                ctx.beginPath();
                ctx.arc(x, y, size * 1.4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Atmosphere limb based on planet type
            let limbColor = c[0] || [150, 150, 180];
            if (p.planetType === 'ice' || p.planetType === 'crystalline') limbColor = [180, 220, 255];
            else if (p.planetType === 'lava' && p.glowColor) limbColor = p.glowColor;
            else if (p.planetType === 'volcanic' && p.glowColor) limbColor = p.glowColor;
            else if (p.planetType === 'lush') limbColor = [100, 180, 220];
            else if (p.planetType === 'toxic') limbColor = [180, 200, 100];
            else if (p.planetType === 'purple-exotic') limbColor = [180, 120, 200];
            else if (p.planetType === 'mars-like') limbColor = [200, 150, 130];
            else if (p.atmosphereColor) limbColor = p.atmosphereColor;

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
            
            // Draw moons
            if (p.moons && p.moons.length > 0) {
                p.moons.forEach(moon => {
                    const moonAngle = moon.orbitPhase;
                    const moonX = x + Math.cos(moonAngle) * moon.orbitRadius;
                    const moonY = y + Math.sin(moonAngle) * moon.orbitRadius * 0.3; // Flatten orbit
                    const moonSize = moon.size * (size / 80); // Scale with planet
                    
                    // Only draw moon if in front (positive y offset in orbit)
                    const inFrontOfPlanet = Math.sin(moonAngle) > -0.3;
                    
                    if (inFrontOfPlanet || Math.abs(moonX - x) > size * 0.8) {
                        // Moon body
                        const mc = moon.color;
                        const moonGrad = ctx.createRadialGradient(
                            moonX - moonSize * 0.3, moonY - moonSize * 0.3, 0,
                            moonX, moonY, moonSize
                        );
                        moonGrad.addColorStop(0, `rgba(${mc[0] + 40}, ${mc[1] + 40}, ${mc[2] + 40}, 1)`);
                        moonGrad.addColorStop(0.6, `rgba(${mc[0]}, ${mc[1]}, ${mc[2]}, 1)`);
                        moonGrad.addColorStop(1, `rgba(${mc[0] - 30}, ${mc[1] - 30}, ${mc[2] - 30}, 1)`);
                        ctx.fillStyle = moonGrad;
                        ctx.beginPath();
                        ctx.arc(moonX, moonY, moonSize, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Subtle crater hints on larger moons
                        if (moonSize > 3) {
                            ctx.fillStyle = `rgba(${mc[0] - 20}, ${mc[1] - 20}, ${mc[2] - 20}, 0.3)`;
                            ctx.beginPath();
                            ctx.arc(moonX + moonSize * 0.2, moonY + moonSize * 0.1, moonSize * 0.25, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                });
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

    function drawProminentStarEncounter(star, x, y, size, totalFade) {
        ctx.save();
        ctx.globalAlpha = totalFade;
        
        const c = star.color;
        const pulseIntensity = 0.97 + Math.sin(star.pulsePhase) * 0.03;
        
        // Soft glow (subtle)
        const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 1.2);
        glowGrad.addColorStop(0, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.2 * pulseIntensity})`);
        glowGrad.addColorStop(0.6, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.06 * pulseIntensity})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Star body - simple bright point
        const bodyGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 0.4);
        bodyGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        bodyGrad.addColorStop(0.5, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.7)`);
        bodyGrad.addColorStop(1, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.3)`);
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.4 * pulseIntensity, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    function drawBlackHoleEncounter(bh, x, y, size, totalFade) {
        ctx.save();
        
        const eventHorizonRadius = size * 0.6;
        const lensRadius = size * 2.2;
        
        // ========== WATERY DISTORTION FIELD ==========
        // Smooth, fluid gradient layers instead of lined rings
        ctx.globalAlpha = totalFade;
        
        // Outer ripple waves - soft, watery effect
        const rippleCount = 5;
        for (let r = rippleCount; r >= 0; r--) {
            const t = r / rippleCount;
            const rippleRadius = eventHorizonRadius * 1.3 + (lensRadius - eventHorizonRadius) * t;
            
            // Animated, flowing distortion
            const flowSpeed = bh.warpPhase * 0.8;
            const waveAmp = size * 0.08 * (1 - t * 0.5);
            
            // Create watery gradient for each ripple
            const rippleGrad = ctx.createRadialGradient(
                x + Math.sin(flowSpeed + t * 2) * waveAmp,
                y + Math.cos(flowSpeed * 1.3 + t * 2) * waveAmp,
                rippleRadius * 0.85,
                x, y, rippleRadius * 1.1
            );
            
            const opacity = 0.08 * (1 - t * 0.6);
            const blueShift = (1 - t) * 30;
            rippleGrad.addColorStop(0, 'transparent');
            rippleGrad.addColorStop(0.3, `rgba(${80 + blueShift}, ${100 + blueShift}, ${140 + blueShift}, ${opacity})`);
            rippleGrad.addColorStop(0.6, `rgba(${60 + blueShift}, ${80 + blueShift}, ${120 + blueShift}, ${opacity * 0.7})`);
            rippleGrad.addColorStop(1, 'transparent');
            
            ctx.fillStyle = rippleGrad;
            ctx.beginPath();
            
            // Organic, wobbly circle
            const segments = 48;
            for (let s = 0; s <= segments; s++) {
                const angle = (s / segments) * Math.PI * 2;
                
                // Smooth, flowing wave distortion
                const wave1 = Math.sin(angle * 2 + flowSpeed) * waveAmp;
                const wave2 = Math.sin(angle * 3 - flowSpeed * 0.7) * waveAmp * 0.6;
                const wave3 = Math.cos(angle * 1.5 + flowSpeed * 1.2) * waveAmp * 0.4;
                const totalWave = wave1 + wave2 + wave3;
                
                const px = x + Math.cos(angle) * (rippleRadius + totalWave);
                const py = y + Math.sin(angle) * (rippleRadius + totalWave);
                
                if (s === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
        }
        
        // ========== INNER DISTORTION GLOW ==========
        // Smooth gradient pull effect toward center
        ctx.globalAlpha = totalFade * 0.6;
        
        const innerGlow = ctx.createRadialGradient(x, y, eventHorizonRadius * 0.8, x, y, lensRadius * 0.7);
        innerGlow.addColorStop(0, 'rgba(20, 30, 50, 0.5)');
        innerGlow.addColorStop(0.3, 'rgba(40, 60, 100, 0.25)');
        innerGlow.addColorStop(0.6, 'rgba(60, 80, 120, 0.1)');
        innerGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(x, y, lensRadius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        // ========== SUBTLE SWIRL EFFECT ==========
        // Gentle curved gradients suggesting matter being pulled in
        ctx.globalAlpha = totalFade * 0.2;
        
        for (let swirl = 0; swirl < 3; swirl++) {
            const swirlAngle = (swirl / 3) * Math.PI * 2 + bh.warpPhase * 0.3;
            const swirlGrad = ctx.createRadialGradient(
                x + Math.cos(swirlAngle) * size * 0.3,
                y + Math.sin(swirlAngle) * size * 0.3,
                0,
                x + Math.cos(swirlAngle) * size * 0.3,
                y + Math.sin(swirlAngle) * size * 0.3,
                size * 0.8
            );
            swirlGrad.addColorStop(0, 'rgba(100, 130, 180, 0.3)');
            swirlGrad.addColorStop(0.4, 'rgba(80, 110, 160, 0.15)');
            swirlGrad.addColorStop(1, 'transparent');
            
            ctx.fillStyle = swirlGrad;
            ctx.beginPath();
            ctx.arc(x + Math.cos(swirlAngle) * size * 0.3, y + Math.sin(swirlAngle) * size * 0.3, size * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // ========== PHOTON SPHERE - soft glow ring ==========
        ctx.globalAlpha = totalFade * 0.4;
        const photonRadius = eventHorizonRadius * 1.2;
        
        const photonGrad = ctx.createRadialGradient(x, y, photonRadius * 0.9, x, y, photonRadius * 1.15);
        photonGrad.addColorStop(0, 'transparent');
        photonGrad.addColorStop(0.3, 'rgba(150, 180, 220, 0.2)');
        photonGrad.addColorStop(0.5, 'rgba(180, 200, 240, 0.35)');
        photonGrad.addColorStop(0.7, 'rgba(150, 180, 220, 0.2)');
        photonGrad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = photonGrad;
        ctx.beginPath();
        
        // Gently wobbling photon sphere
        const photonSegments = 48;
        for (let s = 0; s <= photonSegments; s++) {
            const angle = (s / photonSegments) * Math.PI * 2;
            const warp = Math.sin(angle * 2 + bh.warpPhase * 1.5) * size * 0.015 +
                        Math.cos(angle * 3 - bh.warpPhase) * size * 0.01;
            const px = x + Math.cos(angle) * (photonRadius + warp);
            const py = y + Math.sin(angle) * (photonRadius + warp);
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        
        // ========== THE VOID - absolute black center ==========
        ctx.globalAlpha = totalFade;
        ctx.globalCompositeOperation = 'destination-out';
        
        // Smooth gradient edge
        const voidGrad = ctx.createRadialGradient(x, y, eventHorizonRadius * 0.4, x, y, eventHorizonRadius * 1.1);
        voidGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        voidGrad.addColorStop(0.6, 'rgba(0, 0, 0, 1)');
        voidGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.7)');
        voidGrad.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        
        ctx.fillStyle = voidGrad;
        ctx.beginPath();
        
        // Softly warped void edge
        const voidSegments = 48;
        for (let s = 0; s <= voidSegments; s++) {
            const angle = (s / voidSegments) * Math.PI * 2;
            const warp = Math.sin(angle * 2 + bh.warpPhase * 0.6) * size * 0.015 +
                        Math.cos(angle * 3 - bh.warpPhase * 0.8) * size * 0.01;
            
            const px = x + Math.cos(angle) * (eventHorizonRadius + warp);
            const py = y + Math.sin(angle) * (eventHorizonRadius + warp);
            
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.globalCompositeOperation = 'source-over';
        
        // Solid black core
        ctx.globalAlpha = totalFade;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x, y, eventHorizonRadius * 0.65, 0, Math.PI * 2);
        ctx.fill();
        
        // ========== ACCRETION GLOW - subtle warm edge ==========
        ctx.globalAlpha = totalFade * 0.2;
        const accretionGrad = ctx.createRadialGradient(x, y, eventHorizonRadius * 0.85, x, y, eventHorizonRadius * 1.4);
        accretionGrad.addColorStop(0, 'rgba(255, 200, 150, 0.3)');
        accretionGrad.addColorStop(0.4, 'rgba(255, 180, 130, 0.12)');
        accretionGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = accretionGrad;
        ctx.beginPath();
        ctx.arc(x, y, eventHorizonRadius * 1.4, 0, Math.PI * 2);
        ctx.fill();

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
            
            // Draw irregular debris shape using pre-generated vertices
            const c = piece.color;
            ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
            ctx.beginPath();
            
            // Use pre-generated polygon shape
            piece.vertices.forEach((v, i) => {
                const r = pieceSize * v.radius;
                const vx = Math.cos(v.angle) * r;
                const vy = Math.sin(v.angle) * r * 0.7;
                if (i === 0) ctx.moveTo(vx, vy);
                else ctx.lineTo(vx, vy);
            });
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
        
        if (enc.shipType === 0) {
            // UFO saucer with variance
            const ufo = enc.ufoStyle || {
                hull: [75, 80, 90], hullLight: [100, 105, 115], hullDark: [55, 60, 70],
                domeStyle: 'bubble', rimLightCount: 10, rimLightStyle: 'pulse',
                saucerShape: 'classic', hasAntenna: false, hasUnderGlow: true, secondaryGlow: null
            };
            
            // Shape dimensions based on saucer style
            let saucerWidth = 0.6, saucerHeight = 0.15, bottomHeight = 0.12;
            if (ufo.saucerShape === 'slim') {
                saucerWidth = 0.7; saucerHeight = 0.1; bottomHeight = 0.08;
            } else if (ufo.saucerShape === 'thick') {
                saucerWidth = 0.55; saucerHeight = 0.22; bottomHeight = 0.18;
            } else if (ufo.saucerShape === 'ringed') {
                saucerWidth = 0.65; saucerHeight = 0.12; bottomHeight = 0.1;
            }
            
            // Glow aura underneath
            if (ufo.hasUnderGlow) {
                const glowGrad = ctx.createRadialGradient(0, wobbleOffset + size * 0.1, 0, 0, wobbleOffset + size * 0.1, size * 1.2);
                glowGrad.addColorStop(0, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.5 * pulseIntensity})`);
                glowGrad.addColorStop(0.4, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.2 * pulseIntensity})`);
                glowGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = glowGrad;
                ctx.beginPath();
                ctx.arc(0, wobbleOffset + size * 0.1, size * 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Secondary glow ring (if present)
            if (ufo.secondaryGlow) {
                const sg = ufo.secondaryGlow;
                ctx.strokeStyle = `rgba(${sg[0]}, ${sg[1]}, ${sg[2]}, ${0.3 * pulseIntensity})`;
                ctx.lineWidth = size * 0.04;
                ctx.beginPath();
                ctx.ellipse(0, wobbleOffset, size * (saucerWidth + 0.1), size * (saucerHeight + 0.03), 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Outer ring for ringed saucers
            if (ufo.saucerShape === 'ringed') {
                ctx.fillStyle = `rgba(${ufo.hull[0]}, ${ufo.hull[1]}, ${ufo.hull[2]}, 0.6)`;
                ctx.beginPath();
                ctx.ellipse(0, wobbleOffset, size * 0.75, size * 0.08, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = `rgba(${ufo.hullLight[0]}, ${ufo.hullLight[1]}, ${ufo.hullLight[2]}, 0.4)`;
                ctx.lineWidth = size * 0.01;
                ctx.stroke();
            }
            
            // Bottom hull (darker, shows depth)
            ctx.fillStyle = `rgb(${ufo.hullDark[0] - 10}, ${ufo.hullDark[1] - 10}, ${ufo.hullDark[2] - 10})`;
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset + size * 0.05, size * (saucerWidth - 0.05), size * bottomHeight, 0, 0, Math.PI);
            ctx.fill();
            
            // Main saucer body with metallic gradient
            const bodyGrad = ctx.createLinearGradient(0, wobbleOffset - size * 0.2, 0, wobbleOffset + size * 0.1);
            bodyGrad.addColorStop(0, `rgb(${ufo.hullLight[0]}, ${ufo.hullLight[1]}, ${ufo.hullLight[2]})`);
            bodyGrad.addColorStop(0.4, `rgb(${ufo.hull[0]}, ${ufo.hull[1]}, ${ufo.hull[2]})`);
            bodyGrad.addColorStop(1, `rgb(${ufo.hullDark[0]}, ${ufo.hullDark[1]}, ${ufo.hullDark[2]})`);
            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset, size * saucerWidth, size * saucerHeight, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Highlight rim
            ctx.strokeStyle = `rgba(${ufo.hullLight[0] + 50}, ${ufo.hullLight[1] + 50}, ${ufo.hullLight[2] + 50}, 0.5)`;
            ctx.lineWidth = size * 0.02;
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset - size * 0.02, size * (saucerWidth - 0.02), size * (saucerHeight - 0.03), 0, Math.PI * 1.1, Math.PI * 1.9);
            ctx.stroke();
            
            // Dome based on style
            if (ufo.domeStyle === 'bubble') {
                const domeGrad = ctx.createRadialGradient(
                    -size * 0.08, wobbleOffset - size * 0.15, 0,
                    0, wobbleOffset - size * 0.08, size * 0.25
                );
                domeGrad.addColorStop(0, `rgba(${Math.min(255, gc[0] + 100)}, ${Math.min(255, gc[1] + 100)}, ${Math.min(255, gc[2] + 100)}, 0.6)`);
                domeGrad.addColorStop(0.5, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, 0.35)`);
                domeGrad.addColorStop(1, `rgba(${gc[0] * 0.5}, ${gc[1] * 0.5}, ${gc[2] * 0.5}, 0.3)`);
                ctx.fillStyle = domeGrad;
                ctx.beginPath();
                ctx.ellipse(0, wobbleOffset - size * 0.06, size * 0.22, size * 0.16, 0, Math.PI, Math.PI * 2);
                ctx.fill();
            } else if (ufo.domeStyle === 'flat') {
                ctx.fillStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, 0.4)`;
                ctx.beginPath();
                ctx.ellipse(0, wobbleOffset - size * 0.04, size * 0.25, size * 0.06, 0, Math.PI, Math.PI * 2);
                ctx.fill();
                // Flat dome rim
                ctx.strokeStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, 0.6)`;
                ctx.lineWidth = size * 0.015;
                ctx.beginPath();
                ctx.ellipse(0, wobbleOffset - size * 0.04, size * 0.25, size * 0.02, 0, 0, Math.PI * 2);
                ctx.stroke();
            } else if (ufo.domeStyle === 'tall') {
                const domeGrad = ctx.createRadialGradient(
                    -size * 0.05, wobbleOffset - size * 0.2, 0,
                    0, wobbleOffset - size * 0.1, size * 0.2
                );
                domeGrad.addColorStop(0, `rgba(${Math.min(255, gc[0] + 100)}, ${Math.min(255, gc[1] + 100)}, ${Math.min(255, gc[2] + 100)}, 0.7)`);
                domeGrad.addColorStop(0.6, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, 0.4)`);
                domeGrad.addColorStop(1, `rgba(${gc[0] * 0.5}, ${gc[1] * 0.5}, ${gc[2] * 0.5}, 0.25)`);
                ctx.fillStyle = domeGrad;
                ctx.beginPath();
                ctx.ellipse(0, wobbleOffset - size * 0.08, size * 0.18, size * 0.22, 0, Math.PI, Math.PI * 2);
                ctx.fill();
            } else if (ufo.domeStyle === 'segmented') {
                // Multi-panel dome
                ctx.fillStyle = `rgba(${ufo.hull[0] + 20}, ${ufo.hull[1] + 20}, ${ufo.hull[2] + 20}, 0.8)`;
                ctx.beginPath();
                ctx.ellipse(0, wobbleOffset - size * 0.05, size * 0.2, size * 0.12, 0, Math.PI, Math.PI * 2);
                ctx.fill();
                // Dome segments
                ctx.strokeStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, 0.5)`;
                ctx.lineWidth = size * 0.01;
                for (let seg = 0; seg < 4; seg++) {
                    const segAngle = Math.PI + (seg / 4) * Math.PI;
                    ctx.beginPath();
                    ctx.moveTo(0, wobbleOffset - size * 0.05);
                    ctx.lineTo(Math.cos(segAngle) * size * 0.2, wobbleOffset - size * 0.05 + Math.sin(segAngle) * size * 0.12);
                    ctx.stroke();
                }
                // Top light
                ctx.fillStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.8 * pulseIntensity})`;
                ctx.beginPath();
                ctx.arc(0, wobbleOffset - size * 0.16, size * 0.03, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Antenna (if present)
            if (ufo.hasAntenna) {
                ctx.strokeStyle = `rgb(${ufo.hullLight[0]}, ${ufo.hullLight[1]}, ${ufo.hullLight[2]})`;
                ctx.lineWidth = size * 0.015;
                ctx.beginPath();
                ctx.moveTo(0, wobbleOffset - size * (ufo.domeStyle === 'tall' ? 0.28 : 0.18));
                ctx.lineTo(0, wobbleOffset - size * 0.35);
                ctx.stroke();
                // Antenna tip glow
                ctx.fillStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${pulseIntensity})`;
                ctx.beginPath();
                ctx.arc(0, wobbleOffset - size * 0.35, size * 0.025, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Rim lights
            const lightCount = ufo.rimLightCount;
            for (let i = 0; i < lightCount; i++) {
                const lightAngle = (i / lightCount) * Math.PI * 2 + enc.pulsePhase * 0.5;
                const lx = Math.cos(lightAngle) * size * (saucerWidth - 0.08);
                const ly = Math.sin(lightAngle) * size * (saucerHeight - 0.03) + wobbleOffset;
                
                let lightBrightness;
                if (ufo.rimLightStyle === 'chase') {
                    // Chasing lights effect
                    const chasePos = (enc.pulsePhase * 2) % (Math.PI * 2);
                    const dist = Math.abs(((lightAngle - chasePos + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
                    lightBrightness = Math.max(0.1, 1 - dist / 1.5);
                } else {
                    // Pulsing all together or wave
                    lightBrightness = (Math.sin(lightAngle + enc.pulsePhase) * 0.5 + 0.5) * pulseIntensity;
                }
                
                ctx.fillStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${lightBrightness})`;
                ctx.beginPath();
                ctx.arc(lx, ly, size * 0.025, 0, Math.PI * 2);
                ctx.fill();
            }
            
        } else if (enc.shipType === 1) {
            // Space Shuttle with 3D depth
            
            // Engine glow (behind shuttle)
            const engineGlow = ctx.createRadialGradient(0, wobbleOffset + size * 0.55, 0, 0, wobbleOffset + size * 0.55, size * 0.4);
            engineGlow.addColorStop(0, `rgba(255, 200, 100, ${0.8 * pulseIntensity})`);
            engineGlow.addColorStop(0.3, `rgba(255, 100, 50, ${0.5 * pulseIntensity})`);
            engineGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = engineGlow;
            ctx.beginPath();
            ctx.arc(0, wobbleOffset + size * 0.55, size * 0.4, 0, Math.PI * 2);
            ctx.fill();
            
            // Main fuselage (cylindrical look with gradient)
            const fuselageGrad = ctx.createLinearGradient(-size * 0.12, 0, size * 0.12, 0);
            fuselageGrad.addColorStop(0, 'rgb(180, 185, 190)');
            fuselageGrad.addColorStop(0.3, 'rgb(240, 242, 245)');
            fuselageGrad.addColorStop(0.5, 'rgb(250, 252, 255)');
            fuselageGrad.addColorStop(0.7, 'rgb(220, 225, 230)');
            fuselageGrad.addColorStop(1, 'rgb(160, 165, 170)');
            
            ctx.fillStyle = fuselageGrad;
            ctx.beginPath();
            ctx.moveTo(0, wobbleOffset - size * 0.5);
            ctx.quadraticCurveTo(size * 0.12, wobbleOffset - size * 0.35, size * 0.1, wobbleOffset + size * 0.3);
            ctx.lineTo(size * 0.1, wobbleOffset + size * 0.45);
            ctx.lineTo(-size * 0.1, wobbleOffset + size * 0.45);
            ctx.lineTo(-size * 0.1, wobbleOffset + size * 0.3);
            ctx.quadraticCurveTo(-size * 0.12, wobbleOffset - size * 0.35, 0, wobbleOffset - size * 0.5);
            ctx.fill();
            
            // Cockpit windows
            ctx.fillStyle = 'rgb(20, 30, 50)';
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset - size * 0.35, size * 0.06, size * 0.08, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(100, 150, 200, 0.3)';
            ctx.beginPath();
            ctx.ellipse(-size * 0.015, wobbleOffset - size * 0.37, size * 0.025, size * 0.03, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Left wing (delta shape with 3D shading)
            const leftWingGrad = ctx.createLinearGradient(-size * 0.5, 0, -size * 0.1, 0);
            leftWingGrad.addColorStop(0, 'rgb(140, 145, 150)');
            leftWingGrad.addColorStop(1, 'rgb(200, 205, 210)');
            ctx.fillStyle = leftWingGrad;
            ctx.beginPath();
            ctx.moveTo(-size * 0.1, wobbleOffset + size * 0.1);
            ctx.lineTo(-size * 0.5, wobbleOffset + size * 0.35);
            ctx.lineTo(-size * 0.45, wobbleOffset + size * 0.4);
            ctx.lineTo(-size * 0.1, wobbleOffset + size * 0.35);
            ctx.closePath();
            ctx.fill();
            
            // Right wing
            const rightWingGrad = ctx.createLinearGradient(size * 0.1, 0, size * 0.5, 0);
            rightWingGrad.addColorStop(0, 'rgb(200, 205, 210)');
            rightWingGrad.addColorStop(1, 'rgb(160, 165, 170)');
            ctx.fillStyle = rightWingGrad;
            ctx.beginPath();
            ctx.moveTo(size * 0.1, wobbleOffset + size * 0.1);
            ctx.lineTo(size * 0.5, wobbleOffset + size * 0.35);
            ctx.lineTo(size * 0.45, wobbleOffset + size * 0.4);
            ctx.lineTo(size * 0.1, wobbleOffset + size * 0.35);
            ctx.closePath();
            ctx.fill();
            
            // Vertical tail
            ctx.fillStyle = 'rgb(180, 185, 195)';
            ctx.beginPath();
            ctx.moveTo(0, wobbleOffset - size * 0.1);
            ctx.lineTo(size * 0.03, wobbleOffset + size * 0.35);
            ctx.lineTo(-size * 0.03, wobbleOffset + size * 0.35);
            ctx.closePath();
            ctx.fill();
            
            // Engine nozzles
            ctx.fillStyle = 'rgb(60, 65, 70)';
            ctx.beginPath();
            ctx.ellipse(-size * 0.04, wobbleOffset + size * 0.46, size * 0.035, size * 0.025, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(size * 0.04, wobbleOffset + size * 0.46, size * 0.035, size * 0.025, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Engine flames
            const flameIntensity = 0.6 + pulseIntensity * 0.4;
            ctx.fillStyle = `rgba(255, 150, 50, ${flameIntensity})`;
            ctx.beginPath();
            ctx.ellipse(-size * 0.04, wobbleOffset + size * 0.52, size * 0.025, size * 0.06 * pulseIntensity, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(size * 0.04, wobbleOffset + size * 0.52, size * 0.025, size * 0.06 * pulseIntensity, 0, 0, Math.PI * 2);
            ctx.fill();
            
        } else if (enc.shipType === 2) {
            // Tic-tac UFO (smooth capsule shape)
            
            // Subtle glow aura
            const glowGrad = ctx.createRadialGradient(0, wobbleOffset, 0, 0, wobbleOffset, size * 1.0);
            glowGrad.addColorStop(0, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.2 * pulseIntensity})`);
            glowGrad.addColorStop(0.6, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.08 * pulseIntensity})`);
            glowGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(0, wobbleOffset, size * 1.0, 0, Math.PI * 2);
            ctx.fill();
            
            // Main body - smooth metallic capsule
            const bodyGrad = ctx.createLinearGradient(0, wobbleOffset - size * 0.2, 0, wobbleOffset + size * 0.2);
            bodyGrad.addColorStop(0, 'rgb(220, 225, 235)');
            bodyGrad.addColorStop(0.3, 'rgb(250, 252, 255)');
            bodyGrad.addColorStop(0.5, 'rgb(240, 242, 248)');
            bodyGrad.addColorStop(0.7, 'rgb(200, 205, 215)');
            bodyGrad.addColorStop(1, 'rgb(170, 175, 185)');
            
            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            // Capsule/pill shape
            const capRadius = size * 0.18;
            const bodyLength = size * 0.55;
            ctx.moveTo(-bodyLength + capRadius, wobbleOffset - capRadius);
            ctx.arc(-bodyLength + capRadius, wobbleOffset, capRadius, -Math.PI * 0.5, Math.PI * 0.5, true);
            ctx.lineTo(bodyLength - capRadius, wobbleOffset + capRadius);
            ctx.arc(bodyLength - capRadius, wobbleOffset, capRadius, Math.PI * 0.5, -Math.PI * 0.5, true);
            ctx.closePath();
            ctx.fill();
            
            // Subtle highlight streak
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = size * 0.02;
            ctx.beginPath();
            ctx.moveTo(-bodyLength + capRadius * 1.5, wobbleOffset - capRadius * 0.6);
            ctx.lineTo(bodyLength - capRadius * 1.5, wobbleOffset - capRadius * 0.6);
            ctx.stroke();
            
            // Occasional pulse flash
            if (pulseIntensity > 0.8) {
                ctx.fillStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${(pulseIntensity - 0.8) * 2})`;
                ctx.beginPath();
                ctx.ellipse(0, wobbleOffset, bodyLength * 0.9, capRadius * 0.8, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
        } else if (enc.shipType === 3) {
            // Triangular UFO (like Phoenix lights / TR-3B style)
            
            // Bottom glow
            const glowGrad = ctx.createRadialGradient(0, wobbleOffset, 0, 0, wobbleOffset, size * 0.8);
            glowGrad.addColorStop(0, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.3 * pulseIntensity})`);
            glowGrad.addColorStop(0.5, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.1 * pulseIntensity})`);
            glowGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(0, wobbleOffset, size * 0.8, 0, Math.PI * 2);
            ctx.fill();
            
            // Main triangular body with 3D shading
            const bodyGrad = ctx.createLinearGradient(-size * 0.5, wobbleOffset, size * 0.5, wobbleOffset);
            bodyGrad.addColorStop(0, 'rgb(30, 35, 45)');
            bodyGrad.addColorStop(0.5, 'rgb(50, 55, 65)');
            bodyGrad.addColorStop(1, 'rgb(35, 40, 50)');
            
            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.moveTo(0, wobbleOffset - size * 0.45);
            ctx.lineTo(size * 0.5, wobbleOffset + size * 0.35);
            ctx.lineTo(-size * 0.5, wobbleOffset + size * 0.35);
            ctx.closePath();
            ctx.fill();
            
            // Edge highlights (gives 3D beveled look)
            ctx.strokeStyle = 'rgba(80, 85, 95, 0.8)';
            ctx.lineWidth = size * 0.015;
            ctx.beginPath();
            ctx.moveTo(0, wobbleOffset - size * 0.45);
            ctx.lineTo(size * 0.5, wobbleOffset + size * 0.35);
            ctx.moveTo(0, wobbleOffset - size * 0.45);
            ctx.lineTo(-size * 0.5, wobbleOffset + size * 0.35);
            ctx.stroke();
            
            // Center dome/cockpit
            const domeGrad = ctx.createRadialGradient(0, wobbleOffset, 0, 0, wobbleOffset, size * 0.15);
            domeGrad.addColorStop(0, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, 0.4)`);
            domeGrad.addColorStop(1, 'rgba(40, 45, 55, 0.8)');
            ctx.fillStyle = domeGrad;
            ctx.beginPath();
            ctx.arc(0, wobbleOffset, size * 0.12, 0, Math.PI * 2);
            ctx.fill();
            
            // Corner lights (3 bright lights at each point)
            const corners = [
                [0, wobbleOffset - size * 0.35],
                [size * 0.4, wobbleOffset + size * 0.28],
                [-size * 0.4, wobbleOffset + size * 0.28]
            ];
            corners.forEach((corner, i) => {
                const lightPulse = (Math.sin(enc.pulsePhase + i * Math.PI * 0.66) * 0.5 + 0.5);
                // Glow
                const lightGlow = ctx.createRadialGradient(corner[0], corner[1], 0, corner[0], corner[1], size * 0.12);
                lightGlow.addColorStop(0, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.8 * lightPulse})`);
                lightGlow.addColorStop(0.5, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.3 * lightPulse})`);
                lightGlow.addColorStop(1, 'transparent');
                ctx.fillStyle = lightGlow;
                ctx.beginPath();
                ctx.arc(corner[0], corner[1], size * 0.12, 0, Math.PI * 2);
                ctx.fill();
                // Core
                ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * lightPulse})`;
                ctx.beginPath();
                ctx.arc(corner[0], corner[1], size * 0.025, 0, Math.PI * 2);
                ctx.fill();
            });
            
        } else if (enc.shipType === 4) {
            // Interstellar Endurance - rotating ring station
            const ringAngle = enc.ringAngle || enc.rotation;
            
            // Central hub
            const hubGrad = ctx.createRadialGradient(0, wobbleOffset, 0, 0, wobbleOffset, size * 0.15);
            hubGrad.addColorStop(0, 'rgb(180, 185, 195)');
            hubGrad.addColorStop(0.5, 'rgb(140, 145, 155)');
            hubGrad.addColorStop(1, 'rgb(100, 105, 115)');
            ctx.fillStyle = hubGrad;
            ctx.beginPath();
            ctx.arc(0, wobbleOffset, size * 0.12, 0, Math.PI * 2);
            ctx.fill();
            
            // Main rotating ring
            ctx.strokeStyle = 'rgb(160, 165, 175)';
            ctx.lineWidth = size * 0.06;
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset, size * 0.45, size * 0.45 * 0.3, ringAngle, 0, Math.PI * 2);
            ctx.stroke();
            
            // Ring highlight
            ctx.strokeStyle = 'rgba(200, 205, 215, 0.6)';
            ctx.lineWidth = size * 0.02;
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset, size * 0.45, size * 0.45 * 0.3, ringAngle, Math.PI * 0.8, Math.PI * 1.2);
            ctx.stroke();
            
            // Ring shadow
            ctx.strokeStyle = 'rgba(60, 65, 75, 0.5)';
            ctx.lineWidth = size * 0.03;
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset, size * 0.45, size * 0.45 * 0.3, ringAngle, Math.PI * 1.8, Math.PI * 2.2);
            ctx.stroke();
            
            // Modules on the ring (12 modules)
            const moduleCount = 12;
            for (let m = 0; m < moduleCount; m++) {
                const modAngle = (m / moduleCount) * Math.PI * 2 + ringAngle;
                const modX = Math.cos(modAngle) * size * 0.45;
                const modY = Math.sin(modAngle) * size * 0.45 * 0.3 + wobbleOffset;
                
                // Module body
                ctx.fillStyle = 'rgb(140, 145, 155)';
                ctx.beginPath();
                ctx.arc(modX, modY, size * 0.04, 0, Math.PI * 2);
                ctx.fill();
                
                // Module window light
                const windowBrightness = Math.sin(enc.pulsePhase + m * 0.5) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${windowBrightness * 0.6})`;
                ctx.beginPath();
                ctx.arc(modX, modY, size * 0.015, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Connecting spokes
            ctx.strokeStyle = 'rgb(120, 125, 135)';
            ctx.lineWidth = size * 0.012;
            for (let s = 0; s < 4; s++) {
                const spokeAngle = (s / 4) * Math.PI * 2 + ringAngle;
                const endX = Math.cos(spokeAngle) * size * 0.42;
                const endY = Math.sin(spokeAngle) * size * 0.42 * 0.3 + wobbleOffset;
                ctx.beginPath();
                ctx.moveTo(0, wobbleOffset);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
            
            // Hub detail - docking port
            ctx.fillStyle = 'rgb(80, 85, 95)';
            ctx.beginPath();
            ctx.arc(0, wobbleOffset, size * 0.04, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${pulseIntensity * 0.5})`;
            ctx.beginPath();
            ctx.arc(0, wobbleOffset, size * 0.02, 0, Math.PI * 2);
            ctx.fill();
            
        } else if (enc.shipType === 5) {
            // Death Star - large spherical battle station
            
            // Main sphere body with gradient
            const bodyGrad = ctx.createRadialGradient(
                -size * 0.2, wobbleOffset - size * 0.2, 0,
                0, wobbleOffset, size * 0.5
            );
            bodyGrad.addColorStop(0, 'rgb(140, 145, 150)');
            bodyGrad.addColorStop(0.4, 'rgb(100, 105, 110)');
            bodyGrad.addColorStop(0.8, 'rgb(70, 75, 80)');
            bodyGrad.addColorStop(1, 'rgb(50, 55, 60)');
            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.arc(0, wobbleOffset, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Equatorial trench
            ctx.strokeStyle = 'rgb(40, 45, 50)';
            ctx.lineWidth = size * 0.025;
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset, size * 0.5, size * 0.08, 0, 0, Math.PI * 2);
            ctx.stroke();
            
            // Trench detail lines
            ctx.strokeStyle = 'rgb(60, 65, 70)';
            ctx.lineWidth = size * 0.008;
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset - size * 0.02, size * 0.48, size * 0.06, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0, wobbleOffset + size * 0.02, size * 0.48, size * 0.06, 0, 0, Math.PI * 2);
            ctx.stroke();
            
            // Superlaser dish (concave circle in upper hemisphere)
            const dishX = -size * 0.15;
            const dishY = wobbleOffset - size * 0.2;
            
            // Dish depression
            ctx.fillStyle = 'rgb(50, 55, 60)';
            ctx.beginPath();
            ctx.arc(dishX, dishY, size * 0.15, 0, Math.PI * 2);
            ctx.fill();
            
            // Dish inner ring
            ctx.strokeStyle = 'rgb(70, 75, 80)';
            ctx.lineWidth = size * 0.015;
            ctx.beginPath();
            ctx.arc(dishX, dishY, size * 0.12, 0, Math.PI * 2);
            ctx.stroke();
            
            // Dish focusing array
            ctx.fillStyle = 'rgb(40, 45, 50)';
            ctx.beginPath();
            ctx.arc(dishX, dishY, size * 0.06, 0, Math.PI * 2);
            ctx.fill();
            
            // Superlaser glow (pulsing)
            const laserGlow = ctx.createRadialGradient(dishX, dishY, 0, dishX, dishY, size * 0.12);
            laserGlow.addColorStop(0, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.6 * pulseIntensity})`);
            laserGlow.addColorStop(0.5, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${0.2 * pulseIntensity})`);
            laserGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = laserGlow;
            ctx.beginPath();
            ctx.arc(dishX, dishY, size * 0.12, 0, Math.PI * 2);
            ctx.fill();
            
            // Surface detail - panel lines
            ctx.strokeStyle = 'rgba(60, 65, 70, 0.5)';
            ctx.lineWidth = size * 0.005;
            for (let lat = 1; lat < 5; lat++) {
                const latRadius = size * 0.5 * Math.sin(lat * Math.PI / 5);
                const latY = wobbleOffset + size * 0.5 * Math.cos(lat * Math.PI / 5);
                ctx.beginPath();
                ctx.ellipse(0, latY, latRadius, latRadius * 0.15, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Surface highlight
            const highlightGrad = ctx.createRadialGradient(
                -size * 0.25, wobbleOffset - size * 0.25, 0,
                -size * 0.15, wobbleOffset - size * 0.15, size * 0.3
            );
            highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
            highlightGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = highlightGrad;
            ctx.beginPath();
            ctx.arc(0, wobbleOffset, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
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

        // Update all gas cloud positions and animations once per frame
        updateGasClouds();

        // Update encounter position first
        updateEncounter();
        const encZ = getEncounterZ();

        // Draw clouds behind the encounter (further away, higher z)
        drawGasClouds(encZ > 0 ? encZ : 0, Infinity);
        
        drawStars();
        
        // Draw the encounter
        drawEncounters();
        
        // Draw clouds in front of the encounter (closer, lower z)
        if (encZ > 0) {
            drawGasClouds(0, encZ);
        }
        
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
