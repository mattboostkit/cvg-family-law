"use client";

import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    content: "CVG Family Law provided exceptional support during my divorce. Cora was compassionate, professional, and fought hard for my children's best interests. I couldn't have asked for better representation.",
    author: "Sarah M.",
    rating: 5,
    service: "Divorce & Children Law",
  },
  {
    content: "When I needed protection from domestic abuse, Bridget acted swiftly and sensitively. She secured an emergency order and made me feel safe and supported throughout the entire process.",
    author: "Anonymous",
    rating: 5,
    service: "Domestic Abuse Support",
  },
  {
    content: "The team's expertise in financial matters was invaluable. They ensured a fair settlement that protected my future. Their knowledge and negotiation skills made all the difference.",
    author: "James T.",
    rating: 5,
    service: "Financial Settlements",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re proud to have helped hundreds of families through difficult times
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-6 relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary-200" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">&quot;{testimonial.content}&quot;</p>
              <div className="pt-4 border-t">
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.service}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}