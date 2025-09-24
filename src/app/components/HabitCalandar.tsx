import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import { IHabit } from '@/models/Habit'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const HabitCalendar = ({
  habit,
  getProgressPercentage,
}: {
  habit: IHabit
  getProgressPercentage: (date: string, habit: any) => number
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs | null>(null)
  const [calendarKey, setCalendarKey] = useState(currentDate.format('YYYY-MM'))

  const startOfMonth = currentDate.startOf('month')
  const endOfMonth = currentDate.endOf('month')
  const startOfCalendar = startOfMonth.startOf('week')
  const endOfCalendar = endOfMonth.endOf('week')

  const calendarDays: dayjs.Dayjs[] = []
  let day = startOfCalendar

  while (day.isBefore(endOfCalendar.add(1, 'day'))) {
    calendarDays.push(day)
    day = day.add(1, 'day')
  }

  const goToPreviousMonth = () => {
    const newDate = currentDate.subtract(1, 'month')
    setCurrentDate(newDate)
    setCalendarKey(newDate.format('YYYY-MM'))
    setSelectedDay(null)
  }

  const goToNextMonth = () => {
    const newDate = currentDate.add(1, 'month')
    setCurrentDate(newDate)
    setCalendarKey(newDate.format('YYYY-MM'))
    setSelectedDay(null)
  }
  function hexWithOpacity(hex: string, percent: number): string {
    // Clamp percent between 1 and 100
    const opacity = Math.max(1, Math.min(percent, 100)) / 100;
  
    // Remove '#' if present
    hex = hex.replace(/^#/, '');
  
    // Convert shorthand hex to full form
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
  
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  
  const getDayOpacity = ( isInMonth: boolean) => {
    if (!isInMonth) return 0
    return 100
  }

  const isToday = (date: dayjs.Dayjs) => date.isSame(dayjs(), 'day')
  const isCurrentMonth = (date: dayjs.Dayjs) => date.isSame(currentDate, 'month')
  const isScheduledDay = (date: dayjs.Dayjs) => habit.days?.includes(date.day())

  const getProgressLevel = (progress: number) => {
    if (progress === 0) return 'none'
    if (progress < 30) return 'low'
    if (progress < 70) return 'medium'
    if (progress < 100) return 'high'
    return 'complete'
  }

  return (
    <motion.div
      key="calendar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
      <motion.button
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPreviousMonth}
      >
        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </motion.button>

        <h2 className="p-2 text-center text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl">{currentDate.format('MMMM YYYY')}</h2>

  
        <motion.button
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNextMonth}
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
      </div>

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
            style={{backgroundColor : habit.days.includes(idx+1) ? habit.color.hex : '' , color : habit.days.includes(idx+1)  ? "white" : ""}}
            className="p-2 text-center text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            {day}
          </div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={calendarKey}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-7 gap-2"
        >
       {calendarDays.map((date, index) => {
          const progress = getProgressPercentage(date.format('YYYY-MM-DD'), habit);
          const today = isToday(date);
          const isSelected = selectedDay?.isSame(date, 'day');

          const dayKey = date.format('YYYY-MM-DD');

          return (
            <motion.div
              key={dayKey}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isCurrentMonth(date) ? 1 : 0, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.02 * index }}
              whileHover={{ y: -2 }}
              className="relative"
            >
              {/* Outer border wrapper for today */}
              <div
                className={`rounded-3xl p-[2px] transition-all duration-300 ${
          today ? '' : ''
            }`}
            style={{
            border: today ? `2px solid ${habit.color.hex}` : 'none',
        }}>
        <motion.div
          onClick={() => setSelectedDay(date)}
          className={`relative p-2 text-center text-sm rounded-2xl text-gray-700 dark:text-gray-300 max-sm:rounded-xl cursor-pointer group transition-all duration-300
            ${!today ? 'hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:scale-105' : ''}
            ${isSelected ? 'ring-2 ring-primary' : ''}
          `}>
            <div
              style={{ backgroundColor: hexWithOpacity(habit.color.hex, progress)}}
              className="absolute inset-0 rounded-full z-10"
            />
          <span className="font-bold text-xs relative z-10" style={{color : progress>50 ? 'white' : ''}}>{date.date()}</span>
            </motion.div>
          </div>
      </motion.div>
      );
    })}

        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default HabitCalendar
