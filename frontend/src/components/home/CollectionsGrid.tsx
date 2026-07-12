import React from "react";
import { Link } from "react-router-dom";
// import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Skincare",
    image: "https://res.cloudinary.com/dmigevbpo/image/upload/v1782666110/vedessa/products/product-1782666102552-salicylic-acid-face-wash-7dn.png",
    link: "/products?category=skincare"
  },
  {
    name: "HairCare",
    image: "https://res.cloudinary.com/dmigevbpo/image/upload/v1783836778/vedessa/products/media-1783836777490-633743091.png",
    link: "/products?category=haircare"
  },
  {
    name: "Bringaras Collection",
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&q=80",
    link: "/products?collection=bringaras"
  },
  {
    name: "Eladhi Collection",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    link: "/products?collection=eladhi"
  },
  {
    name: "Ashwaras Collection",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80",
    link: "/products?collection=ashwaras"
  },
  {
    name: "Kumkumadi Collection",
    image: "https://res.cloudinary.com/dmigevbpo/image/upload/v1783835716/vedessa/products/media-1783835715750-973968203.png",
    link: "/products?collection=kumkumadi"
  },
  {
    name: "Gifting",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&q=80",
    link: "/products?category=gifting"
  },
  {
    name: "Bath and Body",
    image: "https://images.unsplash.com/photo-1556228578-dd94e498de1f?w=600&q=80",
    link: "/products?category=bath_body"
  },
  {
    name: "Bestsellers",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80",
    link: "/products?filter=bestseller"
  },
  {
    name: "Shop All",
    image: "https://res.cloudinary.com/dmigevbpo/image/upload/v1782665528/vedessa/products/product-1782665524841-aloevera-face-wash-ht.png",
    link: "/products"
  }
];

export default function CollectionsGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={category.link}
              className="group block relative overflow-hidden aspect-square"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium text-center text-sm md:text-base">
                  {category.name}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}



// import { Link } from 'react-router-dom';
// import { collections } from '@/data/products';

// const CollectionsGrid = () => {
//   return (
//     <section className="py-12">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {collections.map((collection) => (
//             <Link
//               key={collection.id}
//               to={`/products?collection=${collection.id}`}
//               className="relative aspect-square rounded-lg overflow-hidden group"
//             >
//               <img
//                 src={collection.image}
//                 alt={collection.name}
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
//               <div className="absolute bottom-4 left-4 right-4">
//                 <span className="text-sm font-medium text-card">{collection.name}</span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CollectionsGrid;