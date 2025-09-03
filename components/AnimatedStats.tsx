"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Trophy, Clock, Heart } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 1000,
    suffix: "+",
    label: "Families Helped",
    color: "primary",
  },
  {
    icon: Trophy,
    value: 96,
    suffix: "%",
    label: "Success Rate",
    color: "secondary",
  },
  {
    icon: Clock,
    value: 25,
    suffix: "+",
    label: "Years Experience",
    color: "primary",
  },
  {
    icon: Heart,
    value: 30,
    suffix: " min",
    label: "Free Consultation",
    color: "secondary",
  },
];

function AnimatedCounter({ 
  value, 
  suffix = "", 
  duration = 2 
}: { 
  value: number; 
  suffix?: string; 
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(value * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, isInView]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function AnimatedStats() {
  return (
    <section className="py-20 bg-gradient-to-br from-warmgray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container-main relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-medium text-sm uppercase tracking-wide">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-warmgray-900 mt-2">
            Trusted by Families Across Kent
          </h2>
          <p className="text-xl text-warmgray-600 mt-4 max-w-3xl mx-auto">
            With decades of experience and a proven track record, we&apos;ve helped 
            thousands of families navigate their most challenging times.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClass = stat.color === "primary" 
              ? "from-primary-500 to-primary-600" 
              : "from-secondary-500 to-secondary-600";
            const bgClass = stat.color === "primary"
              ? "bg-primary-50"
              : "bg-secondary-50";
            const iconColor = stat.color === "primary"
              ? "text-primary-600"
              : "text-secondary-600";

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-20 h-20 ${bgClass} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow`}
                  >
                    <Icon className={`h-10 w-10 ${iconColor}`} />
                  </motion.div>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      delay: index * 0.1 + 0.3 
                    }}
                    className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${colorClass} bg-clip-text text-transparent mb-2`}
                  >
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix}
                      duration={2}
                    />
                  </motion.div>
                  
                  <p className="text-warmgray-700 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-warmgray-600">
            Every number represents a family we&apos;ve helped find their way forward.
          </p>
        </motion.div>
      </div>
    </section>
  );
}