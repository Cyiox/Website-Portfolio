import React, { useEffect, useRef } from 'react';

// Load ship info from public folder for production compatibility
const shipInfoUrl = '/tiny-spaceships/Info.json';

// Generate ship image paths - in production, assets in public/ are served from root
const shipIds = [1, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // Skip ship 2 & 11, as they have complicated sprite sheets

const SpaceBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Configuration
        const STAR_COUNT = 150;
        const SHIP_COUNT = 8;
        
        // State
        let stars = [];
        let ships = [];
        let shipInfo = null;
        let loadedShipAssets = []; // Array of { img, info }
        let moonFrames = []; // Moon animation frames
        let moonFrameIndex = 0;
        let moonFrameTimer = 0;
        let terranImg = null; // Static planet
        let width = 0;
        let height = 0;

        // Load moon animation frames
        const loadMoonFrames = () => {
            const totalMoonFrames = 60;
            let loadedCount = 0;
            
            for (let i = 1; i <= totalMoonFrames; i++) {
                const img = new Image();
                img.src = `/Moon/${i}.png`;
                img.onload = () => {
                    moonFrames[i - 1] = img;
                    loadedCount++;
                };
                img.onerror = () => {
                    console.error(`Failed to load moon frame ${i}`);
                    loadedCount++;
                };
            }
        };

        // Load Terran planet
        const loadTerran = () => {
            const img = new Image();
            img.src = '/Planets/Terran.png';
            img.onload = () => {
                terranImg = img;
            };
            img.onerror = () => {
                console.error('Failed to load Terran planet');
            };
        };

        // Load ship metadata
        const loadShipInfo = async () => {
            try {
                const response = await fetch(shipInfoUrl);
                shipInfo = await response.json();
                preloadImages();
            } catch (error) {
                console.error('Failed to load ship info:', error);
            }
        };

        // Preload images
        const preloadImages = () => {
            if (!shipInfo) return;
            
            let loadedCount = 0;
            const totalToLoad = shipIds.length;
            
            shipIds.forEach((id) => {
                const info = shipInfo.ships.find(s => s.id === id);
                if (!info) return;
                
                const img = new Image();
                img.src = `/tiny-spaceships/tinyShip${id}.png`;
                
                img.onload = () => {
                    loadedShipAssets.push({
                        img: img,
                        info: info
                    });
                    loadedCount++;
                    
                    if (loadedCount === totalToLoad) {
                        initShips();
                    }
                };
                
                img.onerror = () => {
                    console.error(`Failed to load ship ${id}`);
                    loadedCount++;
                    if (loadedCount === totalToLoad) {
                        initShips();
                    }
                };
            });
        };

        const initShips = () => {
             // Only init if we have assets
            if (loadedShipAssets.length === 0) return;

            ships = [];
            for (let i = 0; i < SHIP_COUNT; i++) {
                ships.push(createShip());
            }
        };

        const initStars = () => {
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() > 0.9 ? 2 : 1, // Occasional bigger pixel star
                    blinkSpeed: 0.02 + Math.random() * 0.03,
                    opacity: Math.random(),
                    fading: Math.random() > 0.5
                });
            }
        };

        const createShip = () => {
            const asset = loadedShipAssets[Math.floor(Math.random() * loadedShipAssets.length)];
            const scale = 2 + Math.random() * 2; // Scale 2x to 4x
            
            // Determine animation state
            // Prioritize "move", then "idle", then default to first state
            let stateIndex = asset.info.states.indexOf("move");
            if (stateIndex === -1) stateIndex = asset.info.states.indexOf("idle");
            if (stateIndex === -1) stateIndex = 0;

            // Frame dimensions
            const frameW = asset.info.frameSize.w;
            const frameH = asset.info.frameSize.h;
            // Padding X is 1. Padding Y is 0 based on file analysis, but we focus on X info provided.
            const paddingX = 1;
            
            const totalFrames = Math.floor(asset.img.width / (frameW + paddingX));

            // Random movement
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 1.5;

            return {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                rotation: angle + Math.PI / 2, // Rotated 90deg because ships face UP
                
                asset: asset,
                
                // Animation properties
                stateIndex: stateIndex,
                frameIndex: Math.floor(Math.random() * totalFrames),
                frameTimer: 0,
                frameDelay: 12, // Speed of animation (slowed down)
                totalFrames: totalFrames,
                frameW: frameW,
                frameH: frameH,
                paddingX: paddingX,
                scale: scale
            };
        };

        const updateDimensions = () => {
            if (canvas) {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
                initStars();
                if (ships.length === 0 && loadedShipAssets.length > 0) {
                    initShips();
                }
            }
        };

        const render = () => {
            if (!ctx) return;

            // Clear canvas
            ctx.fillStyle = '#181718'; // Base background color
            ctx.fillRect(0, 0, width, height);

            // Draw Stars
            stars.forEach(star => {
                // Twinkle effect
                if (star.fading) {
                    star.opacity -= star.blinkSpeed;
                    if (star.opacity <= 0.2) {
                        star.opacity = 0.2;
                        star.fading = false;
                    }
                } else {
                    star.opacity += star.blinkSpeed;
                    if (star.opacity >= 1) {
                        star.opacity = 1;
                        star.fading = true;
                    }
                }

                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
            });

            // Draw Terran planet (bottom left, moved diagonally toward top right)
            if (terranImg) {
                ctx.save();
                ctx.imageSmoothingEnabled = false;
                const planetScale = 3; // Scale up for visibility
                const planetSize = terranImg.width * planetScale;
                const planetX = planetSize * 0.8; // Position more from left
                const planetY = height - planetSize * 0.8; // Position more from bottom
                
                ctx.drawImage(
                    terranImg,
                    planetX - planetSize / 2,
                    planetY - planetSize / 2,
                    planetSize,
                    planetSize
                );
                ctx.restore();
            }

            // Draw animated moon (top right)
            if (moonFrames.length > 0 && moonFrames[moonFrameIndex]) {
                ctx.save();
                ctx.imageSmoothingEnabled = false;
                
                // Animate moon frames
                moonFrameTimer++;
                if (moonFrameTimer >= 15) { // Change frame every 15 ticks (slowed down)
                    moonFrameIndex = (moonFrameIndex + 1) % moonFrames.length;
                    moonFrameTimer = 0;
                }
                
                const moonScale = 3; // Scale up for visibility
                const moonSize = moonFrames[moonFrameIndex].width * moonScale;
                const moonX = width - moonSize * 1; // Position more from right
                const moonY = moonSize * 1; // Position more from top
                
                ctx.drawImage(
                    moonFrames[moonFrameIndex],
                    moonX - moonSize / 2,
                    moonY - moonSize / 2,
                    moonSize,
                    moonSize
                );
                ctx.restore();
            }

            // Draw Ships
            ships.forEach(ship => {
                // Move logic
                ship.x += ship.vx;
                ship.y += ship.vy;

                // Wrap around screen
                const buffer = 50;
                if (ship.x > width + buffer) ship.x = -buffer;
                else if (ship.x < -buffer) ship.x = width + buffer;
                
                if (ship.y > height + buffer) ship.y = -buffer;
                else if (ship.y < -buffer) ship.y = height + buffer;

                // Animation logic
                if (ship.totalFrames > 1) {
                    ship.frameTimer++;
                    if (ship.frameTimer >= ship.frameDelay) {
                        ship.frameIndex = (ship.frameIndex + 1) % ship.totalFrames;
                        ship.frameTimer = 0;
                    }
                }

                if (ship.asset) {
                    ctx.save();
                    ctx.imageSmoothingEnabled = false;
                    
                    ctx.translate(ship.x, ship.y);
                    ctx.rotate(ship.rotation); 
                    
                    const destW = ship.frameW * ship.scale;
                    const destH = ship.frameH * ship.scale;

                    // Calculate source position
                    // X = frameIndex * (frameWidth + paddingX)
                    // Y = stateIndex * (frameHeight + paddingY)
                    const srcX = ship.frameIndex * (ship.frameW + ship.paddingX);
                    const srcY = ship.stateIndex * (ship.frameH + 1); // paddingY is 1

                    ctx.drawImage(
                        ship.asset.img,
                        srcX, srcY,
                        ship.frameW, ship.frameH,
                        -destW / 2, -destH / 2,
                        destW, destH
                    );
                    ctx.restore();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        // Initialize
        updateDimensions();
        loadShipInfo(); // Load ship data and then preload images
        loadMoonFrames();
        loadTerran();
        render();

        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1, // Keep it behind everything
                pointerEvents: 'none' // Click through to content
            }}
        />
    );
};

export default SpaceBackground;
