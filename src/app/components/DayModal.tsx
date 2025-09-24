import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Star, Target, TrendingUp } from 'lucide-react'
import { IHabit } from '@/models/Habit'
import { HabitsGrid, getDayPercentage } from '../page'
import dayjs from 'dayjs'
import SpacialText from './SpacialText'
import ProgressCicle from './ProgressCicle'

interface HabitDayModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string
  habits: IHabit[]
}

export default function HabitDayModal({ 
  isOpen, 
  onClose, 
  selectedDate, 
  habits 
}: HabitDayModalProps) {
  
  const getHabitsForDay = (date: string): IHabit[] => {
    const dateObj = new Date(date)
    const dayOfWeek = (dateObj.getDay() % 7) + 1 || 7
    return habits.filter(habit => habit.days.includes(dayOfWeek))
  }

  const dayHabits = getHabitsForDay(selectedDate)
  const dayPercentage = getDayPercentage(dayHabits, selectedDate)
  const formattedDate = dayjs(selectedDate).format('MMMM D, YYYY')
  const dayName = dayjs(selectedDate).format('dddd')
  
  // Calculate stats for the day
  const completedHabits = dayHabits.filter(habit => 
    habit.completedDates?.includes(selectedDate)
  ).length
  const totalHabits = dayHabits.length

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'from-emerald-400 to-green-500'
    if (percentage >= 70) return 'from-blue-400 to-cyan-500'
    if (percentage >= 50) return 'from-yellow-400 to-orange-500'
    return 'from-pink-400 to-red-500'
  }

  const progressColorClass = getProgressColor(dayPercentage)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: -15 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.16, 1, 0.3, 1],
              type: "spring",
              damping: 25,
              stiffness: 200
            }}
            className="
            bg-white/95 dark:bg-gray-900/95 
            rounded-3xl w-full 
            max-w-5xl sm:max-h-[95vh] 
            h-auto sm:h-auto
            overflow-hidden shadow-2xl relative 
            border border-white/20 dark:border-gray-700/30
            flex flex-col
          "
            onClick={(e) => e.stopPropagation()}
           
          >
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <motion.div 
                className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  rotate: [0, -90, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/30 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Enhanced Header */}
        {/* Enhanced Header */}
<div className="relative px-6 py-6 border-b border-white/10 dark:border-gray-700/30">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
    
    {/* Date Section */}
    <div className="flex items-center gap-5">
  {/* Animated Gradient Icon */}
  <motion.div 
    className="relative"
    animate={{ rotate: [0, 5, -5, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
  >
    <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 via-pink-500 to-red-400 rounded-2xl blur-md opacity-40" />
    <div className="relative bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500 p-4 rounded-2xl shadow-lg">
      <Calendar className="w-8 h-8 text-white drop-shadow-md" />
    </div>
  </motion.div>

  {/* Date Info */}
  <div className="space-y-1">
    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-700 
                  dark:from-white dark:via-purple-200 dark:to-pink-300 bg-clip-text text-transparent">
      {dayName}
    </h2>
    <SpacialText>{formattedDate}</SpacialText>
    <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full 
                     bg-gradient-to-r from-purple-100 to-pink-100 
                     dark:from-purple-900/40 dark:to-pink-900/40 text-purple-600 dark:text-pink-300 shadow-sm">
      ✨ Your daily progress
    </span>
  </div>
</div>


    {/* Progress Section */}
    <div className="flex items-center gap-4 flex-wrap justify-center">
      {/* <ProgressCicle Percent={dayPercentage} /> */}

      <div className="flex gap-2 flex-wrap">
        <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> {dayPercentage}% Done
        </div>
        <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Star className="w-4 h-4" /> {completedHabits} Completed
        </div>
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Target className="w-4 h-4" /> {totalHabits} Habits
        </div>
      </div>
    </div>
  </div>
</div>


            {/* Content Section */}
            <motion.div 
              className="p-8 overflow-y-auto max-h-[calc(95vh-280px)] custom-scrollbar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {dayHabits.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <HabitsGrid habits={dayHabits} ISOToday={selectedDate} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center py-16"
                >
                  <motion.div
                    className="relative w-24 h-24 mx-auto mb-6"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full"></div>
                    <div className="relative w-full h-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 dark:border-gray-600/30">
                      <Calendar className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
  Recharge Day ✨
</h3>
<p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
  You have no habits scheduled for <span className="font-semibold">{dayName}</span>. 
  Use this day to rest, recharge, and get ready for tomorrow 💪
</p>

                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}