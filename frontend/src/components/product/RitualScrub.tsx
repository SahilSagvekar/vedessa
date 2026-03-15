import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface RitualScrubProps {
  productImage?: string;
  productName?: string;
}

const RitualScrub: React.FC<RitualScrubProps> = ({ productImage, productName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Cinematic Transformations
  const mainImageScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.2, 1.5]);
  const mainImageY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  const mainImageOpacity = useTransform(smoothProgress, [0, 0.8, 1], [1, 1, 0.3]);
  
  const textY = useTransform(smoothProgress, [0, 0.5, 1], ["50%", "0%", "-50%"]);
  const textOpacity = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [0, 1, 1, 1, 0]);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-black overflow-hidden">
      {/* Fixed Sticky Background */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10" />
        
        {/* Main "Living" Image */}
        <motion.div
           style={{ scale: mainImageScale, y: mainImageY, opacity: mainImageOpacity }}
           className="relative w-full h-full"
        >
          <img 
            src={productImage || "/images/placeholder.png"} 
            alt={productName}
            className="w-full h-full object-cover"
          />
          
          {/* Subtle "Aura" effect */}
          <motion.div 
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-radial-gradient from-green-900/10 to-transparent pointer-events-none"
          />
        </motion.div>

        {/* Narrative Text Layers */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="max-w-2xl"
          >
            <span className="text-green-400 font-serif italic text-xl mb-4 block tracking-widest">The Ritual of {productName}</span>
            <h2 className="text-white text-5xl md:text-7xl font-serif mb-6 leading-tight">
              Ancient Wisdom <br /> Modern Elegance
            </h2>
            <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed">
              Every drop is a testament to India's rich Ayurvedic heritage. 
              Pure botanical extracts distilled for your radiance.
            </p>
          </motion.div>
        </div>

        {/* Scroll Progress Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
           <span className="text-white/50 text-[10px] uppercase tracking-[0.3em]">Scroll to Discover</span>
           <div className="w-[1px] h-20 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default RitualScrub;
