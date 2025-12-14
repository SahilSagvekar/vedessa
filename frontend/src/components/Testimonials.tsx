import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    rating: 5,
    title: "Amazing Results With Face Cream",
    text: "I've struggled with dull skin for years, but after using this product, my complexion has transformed. It's like a glow in a bottle! Highly recommend for anyone seeking radiance.",
    author: "Sophia M.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    rating: 5,
    title: "Natural Ingredients, Great Results",
    text: "Knowing that product is made with natural ingredients makes me trust it even more. The results speak for themselves—smoother skin and fewer blemishes in just a few weeks!",
    author: "Emily R.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    rating: 5,
    title: "Perfect For All Seasons, I Love It",
    text: "I've been using this product for six months, and it's perfect for all seasons. It keeps my skin moisturized in winter and oil-free in summer. Truly versatile!",
    author: "Perry Wilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    rating: 5,
    title: "Best Ayurvedic Product I've Tried",
    text: "As someone who values natural beauty products, Vedessa exceeded my expectations. The authentic ayurvedic formulation shows real results without harsh chemicals.",
    author: "Priya K.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Split testimonials: 2 on left, 1 on right with image
  const leftTestimonials = testimonials.slice(currentIndex, currentIndex + 2);
  const rightTestimonial = testimonials[(currentIndex + 2) % testimonials.length];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-12">
          Testimonials
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Testimonial cards */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {leftTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-gray-800 text-gray-800"
                      />
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-serif text-gray-800 mb-3">
                    "{testimonial.title}"
                  </h3>

                  {/* Review text */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-800">
                      {testimonial.author}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={prevSlide}
                className="p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Right side - Featured testimonial with product image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={rightTestimonial.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Product image */}
              <div className="relative rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-green-50 to-amber-50">
                <img
                  src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=600&fit=crop"
                  alt="Vedessa products"
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* Testimonial overlay card */}
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg -mt-20 mx-6 relative z-10">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(rightTestimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-gray-800 text-gray-800"
                    />
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-xl font-serif text-gray-800 mb-3">
                  "{rightTestimonial.title}"
                </h3>

                {/* Review text */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{rightTestimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={rightTestimonial.avatar}
                    alt={rightTestimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-800">
                    {rightTestimonial.author}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}