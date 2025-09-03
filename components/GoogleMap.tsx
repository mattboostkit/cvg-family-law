"use client";

import { motion } from "framer-motion";

interface GoogleMapProps {
  width?: string;
  height?: string;
  className?: string;
}

export default function GoogleMap({ 
  width = "100%", 
  height = "450",
  className = ""
}: GoogleMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative ${className}`}
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2503.9821544474926!2d0.2600787!3d51.127237199999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47df454ca836cc93%3A0x2429e600b2e9dc13!2sCVG%20Family%20Law!5e0!3m2!1sen!2suk!4v1756898266092!5m2!1sen!2suk"
        width={width}
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="CVG Family Law Office Location"
        className="w-full rounded-lg shadow-lg"
      />
    </motion.div>
  );
}