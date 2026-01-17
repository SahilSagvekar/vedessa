import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
// import { createPageUrl } from "@/utils";

const slides = [
  {
    type: "video",
    video: "video/1.mp4",
    title: "Discover Authentic Ayurveda",
    subtitle: "Pure botanicals, ancient wisdom",
    cta: "SHOP NOW",
    link: "/products"
  },
  {
    type: "image",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1600&q=80",
    title: "Eladhi Collection",
    subtitle: "Hydrating formulas for radiant skin",
    cta: "EXPLORE",
    link: "/products?collection=eladhi"
  },
  {
    type: "image",
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=1600&q=80",
    title: "Bringaras Hair Care",
    subtitle: "For healthy, lustrous hair",
    cta: "DISCOVER",
    link: "/products?collection=bringaras"
  },
  {
    type: "image",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1600&q=80",
    title: "Weekend Offer",
    subtitle: "Complimentary minis worth up to ₹5640",
    cta: "SHOP THE OFFER",
    link: "/products"
  }
];

export default function HeroSection() {
  // const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Ensure we start on first slide
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {slides[currentSlide].type === 'video' ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={slides[currentSlide].video} type="video/mp4" />
            </video>
          ) : (
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl"
              >
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 leading-tight">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-xl text-white/90 mb-8 font-light">
                  {slides[currentSlide].subtitle}
                </p>
                <Link to={slides[currentSlide].link}>
                  <button className="bg-[#C17855] hover:bg-[#A66545] text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-colors">
                    {slides[currentSlide].cta}
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? "bg-white w-8" : "bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
}




// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { Button } from '@/components/ui/button';

// const HeroSection = () => {
//   return (
//     <section className="relative h-[500px] md:h-[600px] overflow-hidden">
//       {/* Background Image */}
//       <div className="absolute inset-0">
//         <img
//           src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1920&h=1080&fit=crop"
//           alt="Ayurvedic products"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-kama-olive/60 to-transparent" />
//       </div>

//       {/* Navigation Arrows */}
//       <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-card/80 rounded-full hover:bg-card transition-colors z-10">
//         <ChevronLeft className="w-5 h-5 text-foreground" />
//       </button>
//       <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-card/80 rounded-full hover:bg-card transition-colors z-10">
//         <ChevronRight className="w-5 h-5 text-foreground" />
//       </button>

//       {/* Content */}
//       <div className="relative z-10 h-full flex items-center">
//         <div className="container mx-auto px-4">
//           <div className="max-w-xl">
//             <h1 className="text-4xl md:text-6xl font-display text-kama-cream mb-4">
//               Weekend Offer
//             </h1>
//             <p className="text-lg text-kama-cream/90 mb-6">
//               Complimentary minis worth up to ₹5640
//             </p>
//             <Link to="/products">
//               <Button className="bg-kama-orange hover:bg-kama-orange/90 text-accent-foreground px-8 py-6 text-sm tracking-wide">
//                 SHOP THE OFFER
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Dots */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
//         <span className="w-8 h-1 bg-card rounded-full" />
//         <span className="w-8 h-1 bg-card/40 rounded-full" />
//         <span className="w-8 h-1 bg-card/40 rounded-full" />
//       </div>
//     </section>
//   );
// };

// export default HeroSection;