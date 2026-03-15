import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const IngredientParallax = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for 3D depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Normalize mouse position from -0.5 to 0.5
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  // Define spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax layers (different depths)
  const layer1X = useTransform(smoothX, [ -0.5, 0.5 ], [ -20, 20 ]);
  const layer1Y = useTransform(smoothY, [ -0.5, 0.5 ], [ -20, 20 ]);
  
  const layer2X = useTransform(smoothX, [ -0.5, 0.5 ], [ -50, 50 ]);
  const layer2Y = useTransform(smoothY, [ -0.5, 0.5 ], [ -50, 50 ]);
  
  const layer3X = useTransform(smoothX, [ -0.5, 0.5 ], [ -100, 100 ]);
  const layer3Y = useTransform(smoothY, [ -0.5, 0.5 ], [ -100, 100 ]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#faf9f6]"
    >
      {/* Dynamic Gradient Background (Liquid Feel) */}
      <motion.div 
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, #fdfbf7 0%, #faf9f6 100%)",
            "radial-gradient(circle at 45% 55%, #fdfbf7 0%, #faf9f6 100%)",
            "radial-gradient(circle at 55% 45%, #fdfbf7 0%, #faf9f6 100%)"
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-50"
      />

      {/* Layer 1: Background Elements (Saffron) */}
      <motion.img
        src="/images/cinematic/saffron.png"
        style={{ x: layer1X, y: layer1Y }}
        className="absolute top-[15%] left-[10%] w-32 h-auto opacity-30 filter blur-[2px]"
        alt=""
      />
      <motion.img
        src="/images/cinematic/saffron.png"
        style={{ x: layer1X, y: layer1Y, rotate: 180 }}
        className="absolute bottom-[20%] right-[15%] w-24 h-auto opacity-20 filter blur-[4px]"
        alt=""
      />

      {/* Layer 2: Midground Elements (Rose Petals & Turmeric) */}
      <motion.img
        src="/images/cinematic/rose.png"
        style={{ x: layer2X, y: layer2Y, rotate: 45 }}
        className="absolute top-[20%] right-[10%] w-48 h-auto opacity-60 filter blur-[1px]"
        alt=""
      />
      <motion.img
        src="/images/cinematic/turmeric.png"
        style={{ x: layer2X, y: layer2Y }}
        className="absolute bottom-[10%] left-[20%] w-40 h-auto opacity-50 filter blur-[2px]"
        alt=""
      />

      {/* Layer 3: Foreground Elements (Jasmine & Rose) */}
      <motion.img
        src="/images/cinematic/jasmine.png"
        style={{ x: layer3X, y: layer3Y }}
        className="absolute top-[50%] left-[-5%] w-64 h-auto opacity-80"
        alt=""
      />
      <motion.img
        src="/images/cinematic/rose.png"
        style={{ x: layer3X, y: layer3Y, rotate: -20 }}
        className="absolute bottom-[-5%] right-[5%] w-72 h-auto opacity-90"
        alt=""
      />

      {/* Subtle Dust/Particle Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-10" />
    </div>
  );
};

export default IngredientParallax;
