
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center hero-section overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="text-center hero-content"
      >
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          Pro. Beyond.
        </motion.h1>
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          Experience the most advanced electronic ecosystem. Crafted for perfection.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            whileHover="hover"
            className="hero-button"
            style={{ display: 'inline-flex', gap: '0.75rem' }}
          >
            <span>Explore Collection</span>
            <motion.div
              variants={{
                hover: { x: 8 }
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight size={24} />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
