import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from "../context/ThemeContext";

export default function AnimatedBackground() {
  const { isDarkMode } = useTheme();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${
        isDarkMode 
          ? 'from-emerald-500/10 via-transparent to-emerald-500/10' 
          : 'from-emerald-400/20 via-transparent to-emerald-400/20'
      } animate-gradient-x`}></div>
      
      {/* Animated gradient overlay */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${
          isDarkMode
            ? 'from-emerald-600/5 via-transparent to-emerald-400/5'
            : 'from-emerald-500/10 via-transparent to-emerald-300/10'
        }`}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Radial gradient */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${
        isDarkMode
          ? 'from-emerald-500/5 via-transparent to-transparent'
          : 'from-emerald-400/10 via-transparent to-transparent'
      } animate-pulse-slow`}></div>

      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${
            isDarkMode 
              ? 'bg-emerald-500/20' 
              : 'bg-emerald-400/30'
          }`}
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            x: [
              null,
              Math.random() * window.innerWidth * 0.5,
              Math.random() * window.innerWidth
            ],
            y: [
              null,
              Math.random() * window.innerHeight * 0.5,
              Math.random() * window.innerHeight
            ],
            scale: [0, 1, 0],
            opacity: isDarkMode ? [0, 0.5, 0] : [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Glowing orbs */}
      {[...Array(isDarkMode ? 4 : 3)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className={`absolute rounded-full blur-3xl ${
            isDarkMode
              ? 'bg-emerald-500/10'
              : 'bg-emerald-300/20'
          }`}
          style={{
            width: Math.random() * 200 + 100,
            height: Math.random() * 200 + 100,
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0.8,
          }}
          animate={{
            x: [
              null,
              Math.random() * window.innerWidth * 0.3,
              Math.random() * window.innerWidth
            ],
            y: [
              null,
              Math.random() * window.innerHeight * 0.3,
              Math.random() * window.innerHeight
            ],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: Math.random() * 30 + 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Light mode specific effects */}
      {!isDarkMode && (
        <>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
          
          {/* Animated sparkles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}

      {/* Dark mode specific effects */}
      {isDarkMode && (
        <>
          {/* Star-like particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
} 