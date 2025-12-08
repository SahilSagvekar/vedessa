import React from "react";
import { motion } from "framer-motion";

export default function ArtOfAyurveda() {
  return (
    <section className="py-20 bg-[#F5EDE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[#2D5016] mb-6">
              The Art of Ayurvedic Beauty
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Discover the ancient science of Ayurveda through our carefully crafted products. 
              Each formulation is a blend of traditional wisdom and modern science, created to 
              nourish your skin and hair naturally.
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#C17855] rounded-full mt-2 mr-3" />
                <p className="text-gray-700">Pure, natural ingredients sourced ethically</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#C17855] rounded-full mt-2 mr-3" />
                <p className="text-gray-700">Time-tested Ayurvedic formulations</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#C17855] rounded-full mt-2 mr-3" />
                <p className="text-gray-700">Suitable for all skin and hair types</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden shadow-2xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="https://cdn.coverr.co/videos/coverr-a-woman-applying-moisturizer-on-her-face-8899/1080p.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


// const ArtOfAyurveda = () => {
//   return (
//     <section className="py-16 bg-kama-olive">
//       <div className="container mx-auto px-4">
//         <div className="grid md:grid-cols-2 gap-12 items-center">
//           <div>
//             <h2 className="text-4xl md:text-5xl font-display text-kama-cream mb-6">
//               The Art of Ayurvedic Beauty
//             </h2>
//             <p className="text-kama-cream/80 mb-6 leading-relaxed">
//               Discover the ancient science of Ayurveda through our carefully crafted products. 
//               Each formulation is a blend of traditional wisdom and modern science, created to 
//               nourish your skin and hair naturally.
//             </p>
//             <ul className="space-y-3">
//               <li className="flex items-center gap-3 text-kama-cream/80">
//                 <span className="w-1.5 h-1.5 bg-kama-orange rounded-full" />
//                 Pure, natural ingredients sourced ethically
//               </li>
//               <li className="flex items-center gap-3 text-kama-cream/80">
//                 <span className="w-1.5 h-1.5 bg-kama-orange rounded-full" />
//                 Time-tested Ayurvedic formulations
//               </li>
//               <li className="flex items-center gap-3 text-kama-cream/80">
//                 <span className="w-1.5 h-1.5 bg-kama-orange rounded-full" />
//                 Suitable for all skin and hair types
//               </li>
//             </ul>
//           </div>
//           <div className="relative">
//             <div className="aspect-[4/3] rounded-lg overflow-hidden">
//               <img
//                 src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=600&fit=crop"
//                 alt="Ayurvedic beauty"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ArtOfAyurveda;