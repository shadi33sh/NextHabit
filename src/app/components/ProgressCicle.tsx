import React from 'react'
import { motion } from 'framer-motion'

export default function ProgressCicle({ Percent }: { Percent: number }) {
  return (
    <div className="flex items-center justify-between dark:text-white text-gray-600">
      <div className="relative">
        <div className="relative w-24 h-24">
          {/* Background ring */}
          <svg
            className="w-24 h-24 transform -rotate-90 absolute"
            viewBox="0 0 64 64"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              className="stroke-gray-300 dark:stroke-white/10"
              strokeWidth="4"
            />
          </svg>

          {/* Progress ring */}
          <svg
            className="w-24 h-24 transform -rotate-90 absolute"
            viewBox="0 0 64 64"
          >
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              className="stroke-black dark:stroke-white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={176}
              initial={{ strokeDashoffset: 176 }}
              animate={{ strokeDashoffset: 176 - (176 * Percent) / 100 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>

          {/* Pulsing glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-black/30 dark:border-white/30"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="text-xl font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
                key={Percent}
              >
                {Math.round(Percent)}%
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
