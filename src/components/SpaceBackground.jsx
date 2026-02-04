import React, { useEffect, useRef } from 'react';
import shipInfoData from '../assets/tiny-spaceships/Info.json';

// Dynamically import all spaceship images from the assets folder using Vite's import.meta.glob
const shipModules = import.meta.glob('../assets/tiny-spaceships/*.png', { eager: true });

// Process the data to link images with metadata
const availableShips = [];

Object.keys(shipModules).forEach((path) => {
    // Extract ID from filename (e.g., tinyShip12.png -> 12)
    const match = path.match(/tinyShip(\d+)\.png/);
    if (match) {
        const id = parseInt(match[1], 10);
        
        // Skip ships with problematic layouts
        if (id === 2) return; // tinyShip2 has irregular sprite sheet layout
        
        const info = shipInfoData.ships.find(s => s.id === id);
        if (info) {
            availableShips.push({
                imgSrc: shipModules[path].default,
                info: info
            });
        }
    }
});

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
        let loadedShipAssets = []; // Array of { img, info }
        let width = 0;
        let height = 0;

        // Preload images
        const preloadImages = () => {
            let loadedCount = 0;
            availableShips.forEach((item) => {
                const img = new Image();
                img.src = item.imgSrc;
                img.onload = () => {
                    loadedShipAssets.push({
                        img: img,
                        info: item.info
                    });
                    loadedCount++;
                    
                    // Start when at least some are loaded or all are done
                    if (loadedCount === availableShips.length) {
                        initShips();
                    }
                };
            });
            // Fallback if no images found
            if (availableShips.length === 0) initShips();
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
            
            const totalFrames = Math.floor(asset.img.width / (frameW + paddingX));;
            
            if (frameOverrides[asset.info.id]) {
                totalFrames = frameOverrides[asset.info.id];
            }

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
                frameDelay: 8, // Speed of animation
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
            ctx.fillStyle = '#4C1A57'; // Use your deep purple palette color as base
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
        preloadImages();
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
