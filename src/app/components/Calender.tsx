'use client'
import { IHabit } from '@/models/Habit'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { getDayPercentage, HabitsGrid } from '../page'
import HabitDayModal from './DayModal'


export default function Calender({habits} : {habits : IHabit[]}) {
    const today = new Date()
    const currentDate = today.getDate()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const ISOToday = `${currentYear}-${currentMonth}-${currentDate}`
    const [date, setDate] = useState<string|null>()

    const onSelectDay= (date : string)=>{ 
      const dateObj = new Date(date)
      const dayOfWeek = (dateObj.getDay() % 7)+1 || 7
      const habitOfDay = habits.filter(habit => habit.days.includes(dayOfWeek))
      return habitOfDay
    }


    const [displayedMonth, setDisplayedMonth] = useState(today.getMonth())
    const [displayedYear, setDisplayedYear] = useState(today.getFullYear())
  

  
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]


    const formatDateOnly = (date: Date) => dayjs(date).format('YYYY-MM-DD')  
    // Get days in current month
  
    // Get days in the displayed month
    const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1).getDay()
        
    const handlePrevMonth = () => {
      if (displayedMonth === 0) {
        setDisplayedMonth(11)
        setDisplayedYear(prev => prev - 1)
      } else {
        setDisplayedMonth(prev => prev - 1)
      }
    }
  
    const handleNextMonth = () => {
      if (displayedMonth === 11) {
        setDisplayedMonth(0)
        setDisplayedYear(prev => prev + 1)
      } else {
        setDisplayedMonth(prev => prev + 1)
      }
    }


    
    const isHabitCompleted = (habit: IHabit, targetDate: string): boolean => {
        const entry = habit.history.find(h =>
          h.date === targetDate
        );
    
        if (!entry) return false;
    
        const { type, value } = habit.habitType;
        const { progress } = entry;
    
        switch (type) {
          case 'check':
            return progress === 1;
          case 'number':
            return progress >= value;
          case 'time':
            return progress >= value;
          default:
            return false;
        }
      };

  return (
    <motion.div 
      className="lg:col-span-1 basis-[49%]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-4  border-white/20 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
        {/* Background Pattern */}

        {/* <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
        </div> */}
        
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {monthNames[displayedMonth]}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {displayedYear}
              </p>
            </div>
          </div>
 <div className="flex items-center gap-2">
            <motion.button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <motion.button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </motion.div>

        {/* Day Headers */}
        <motion.div 
          className="grid grid-cols-7 gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
            <div 
              key={`${idx}${day}`}
              className="p-2 text-center text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              {day}
            </div>
          ))}
        </motion.div>

        {/* Calendar Grid */}
     {/* Calendar Grid */}
<AnimatePresence mode="wait">
  <motion.div
    key={`${displayedYear}-${displayedMonth}`}
    className="grid grid-cols-7 gap-2"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.1 }}
  >
    {/* Empty cells for days before month starts */}
    {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
      <div key={`empty-${idx}`} className="p-4" />
    ))}

    {/* Calendar days */}
    {Array.from({ length: daysInMonth }).map((_, idx) => {
      const day = idx + 1
      const dateObj = new Date(displayedYear, displayedMonth, day)
      const dateISO = formatDateOnly(dateObj)
      const isToday =
        today.getFullYear() === displayedYear &&
        today.getMonth() === displayedMonth &&
        today.getDate() === day

      return (
        <motion.div
          key={day}
          className={`relative p-2 text-center text-sm rounded-2xl text-gray-700 dark:text-gray-300 max-sm:rounded-xl transition-all duration-300 cursor-pointer group ${
            isToday
              ? 'border border-primary shadow-lg scale-105'
              : 'bg-gray-50/50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:scale-105'
          }`}
          onClick={() => setDate(dateISO)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.02 * idx }}
          whileHover={{ y: -2 }}
        >
          {isToday && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-10 -z-10"></div>
          )}

          <span className="font-bold text-xs relative z-10">{day}</span>

          {/* Habit indicators */}
          <div className="grid grid-cols-4 max-md:grid-cols-3 place-items-center w-fit mx-auto mt-2 gap-1">
            {habits.map((habit: any, idx: number) => {
              const dayOfWeek = (dateObj.getDay() % 7) + 1 || 7
              if (!habit.days.includes(dayOfWeek)) return null
              const isComplete = isHabitCompleted(habit, dateISO)

              return (
                <motion.div
                  key={`${idx}${habit.title}`}
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.05 * idx }}
                >
                  {isComplete && (
                    <div
                      className="absolute inset-0 rounded-full blur-sm opacity-50"
                      style={{ backgroundColor: habit.color.hex }}
                    />
                  )}

                  <div
                    className={`relative w-[5px] h-[5px] max-sm:w-[6px] max-sm:h-[6px] rounded-full transition-all duration-300 ${
                      isComplete && 'shadow-xl'
                    }`}
                    style={{
                      backgroundColor: isComplete
                        ? habit.color.hex
                        : `${habit.color.hex}30`,
                    }}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )
    })}
  </motion.div>
</AnimatePresence>
    
      </div>

      <AnimatePresence>
        {
          date&&
          <HabitDayModal
          isOpen={!!date}
          onClose={() => setDate(null)}
          selectedDate={date || ''}
          habits={habits}
        />
      } 
    </AnimatePresence>

    </motion.div>
  )
}