// EnhancedHabitTracker.tsx
'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import { Target, Flame, TrendingUp, Star, Zap, Plus, CheckCircle2, Circle, Calendar as CalendarIcon, Hash, Clock, Award, Activity } from 'lucide-react'
import Calender from './components/Calender'
import { IHabit } from '@/models/Habit'
import SideBar from './sideBar'
import InfinityLoading from './components/InfinityLoading'
import { HabitModal } from './components/HabitModal2'

export const isHabitCompleted = (habit: any, targetDate: string) => {
  const entry = habit.history?.find((h: any) => h.date === targetDate)
  if (!entry) return false
  const { type, value } = habit.habitType
  const { progress } = entry
  switch (type) {
    case 'check': return progress === 1
    case 'number': return progress >= value
    case 'time': return progress >= value
    default: return false
  }
}

export const calculateStreak = (history: any[]) => {
  if (!history || history.length === 0) return 0
  let streak = 0
  const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  for (const entry of sorted) {
    if ((entry.progress || 0) > 0) streak++
    else break
  }
  return streak
}

export const getCompletionPercentage = (habit: any, ISOToday: string) => {
  const progress = habit.history?.find(h => h.date === ISOToday)?.progress || 0
  const { type, value } = habit.habitType
  if (type === 'check') return progress * 100
  return Math.min((progress / value) * 100, 100)
}

export const getDayPercentage = (habits: IHabit[], ISOToday: string) => {
  var allPercents = 0
  habits.map(habit => {
    const progress = habit.history?.find(h => h.date === ISOToday)?.progress || 0
    const { type, value } = habit.habitType
    if (type === 'check'){ allPercents += progress * 100}
    else{
      allPercents += Math.min((progress / value) * 100, 100)
    }
    })
    return Math.round(allPercents/habits.length)
}

const getHabitIcon = (type: string) => {
  switch (type) {
    case 'check': return <Target className="w-3 h-3" />
    case 'number': return <Hash className="w-3 h-3" />
    case 'time': return <Clock className="w-3 h-3" />
    default: return <Circle className="w-3 h-3" />
  }
}
const days = ['S' , 'M' , 'T' , 'W' , 'T', 'F' , 'S']

// Component: Loader


// Component: Header
const Header = () => (
  <motion.div 
    className="mb-10"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-30"></div>
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-2xl">
          <Activity className="w-8 h-8 text-white" />
        </div>
      </div>
      <div>
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
          Habit Tracker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          Build better habits, one day at a time
        </p>
      </div>
    </div>
  </motion.div>
)

// Component: StatsCards
const StatsCards = ({ totalHabits, completedHabits, totalStreak }: any) => {
  const stats = [
    {
      icon: <Target className="w-6 h-6" />,
      label: "Today's Progress",
      value: `${completedHabits}/${totalHabits}`,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
    },
    {
      icon: <Flame className="w-6 h-6" />,
      label: "Total Streak",
      value: `${totalStreak} days`,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: "Completion Rate",
      value: `${Math.round((completedHabits / totalHabits) * 100) || 0}%`,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
    }
  ]

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {stats.map((item, idx) => (
        <motion.div
          key={idx}
          className={`relative  bg-gradient-to-br ${item.bgGradient} backdrop-blur border border-white/20 dark:border-gray-700/50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group`}
          whileHover={{ scale: 1.02, y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 * idx }}
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <div className={`w-full h-full bg-gradient-to-br ${item.gradient} rounded-full blur-3xl`}></div>
          </div>
          
          <div className="relative flex items-center gap-4">
            <div className={`p-4 bg-gradient-to-br ${item.gradient} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {item.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// Component: NoHabitsMessage
const NoHabitsMessage = ({ onCreate }: { onCreate: () => void }) => (
  <motion.div 
    className="text-center py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur border border-white/20 dark:border-gray-700/50 rounded-3xl shadow-xl"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div
      className="relative mx-auto w-24 h-24 mb-6"
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-30"></div>
      <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4">
        <Star className="w-16 h-16 text-white" />
      </div>
    </motion.div>
    
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Ready to Start Your Journey?
    </h3>
    <p className="text-lg mb-8 text-gray-600 dark:text-gray-300 max-w-md mx-auto">
      No habits scheduled for today. Create your first habit and start building a better you!
    </p>
    
    <motion.button
      onClick={onCreate}
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Plus className="w-5 h-5" />
      Create Your First Habit
    </motion.button>
  </motion.div>
)

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
  const a = Math.round(opacity * 255);

  // Convert each component to 2-digit hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
}

export const HabitsGrid = ({habits , onHabitClick = ()=>{}, ISOToday , updateHabitProgress = ()=>{} } : any) => (
  <motion.section
    className="space-y-8 overflow-y-auto scroll-hidden max-h-full pb-6"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
  >
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30"></div>
          <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Today's Habits
        </h2>
      </div>
      
    </header>

    <div className="grid sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 ">
      {habits.map((habit: IHabit, index: number) => {
        const isComplete = isHabitCompleted(habit, ISOToday);
        const streak = calculateStreak(habit.history);
        const percentage = getCompletionPercentage(habit, ISOToday);
        const todayProgress = habit.history?.find((h: any) => h.date === ISOToday)?.progress || 0;
        const color = habit.color?.hex || '#f43f5e';

        return (
          <motion.div
            key={index}
            onClick={() => onHabitClick(habit)}
            className={`group relative overflow-hidden backdrop-blur  transition-all duration-500 cursor-pointer ${
              isComplete
                ? 'border-white/20 '
                : 'bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl'
            } rounded-3xl p-4 hover:scale-[1.02]`}
            style={isComplete ? { 
              background: `linear-gradient(135deg, ${color}dd, ${color})`,
              color: 'white' 
            } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            whileHover={{ y: -2 }}
          >
            {/* Glow effect for completed habits */}
            {isComplete && (
              <div 
                className="absolute inset-0 rounded-3xl blur-xl opacity-20"
                style={{ backgroundColor: color }}
              />
            )}

            {/* Progress bar for incomplete habits */}
            {!isComplete && (
              <div
                className="absolute bottom-0 left-0 h-1 rounded-b-3xl transition-all duration-1000 ease-out"
                style={{ backgroundColor: color, width: `${percentage}%` }}
              />
            )}

            <div className="relative flex justify-between items-start gap-2">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-3 rounded-2xl backdrop-blur"
                    style={{ backgroundColor: isComplete ? 'rgba(255,255,255,0.2)' : `${color}22` }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {getHabitIcon(habit.habitType.type)}
                  </motion.div>
                  <h3 className={`text-sm font-bold truncate ${
                    isComplete ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {habit.title}
                  </h3>
                </div>

                <div className={`flex gap-2 text-xs flex-nowrap ${
                  isComplete ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  <div className="flex flex-nowrap items-center gap-2 bg-black/10 dark:bg-white/10 px-2 py-1 rounded-full">
                    <Flame className={`w-3 h-3 ${isComplete ? 'text-white' : 'text-orange-400'}`} />
                    <span className="font-medium text-nowrap text-[9px]">{streak} day streak</span>
                  </div>
                  {habit.habitType.type === 'check' &&
                  <div className="flex items-center gap-2  px-3 py-1 rounded-full">
                      <CalendarIcon className={`w-3 h-3 ${isComplete ? 'text-white' : 'text-blue-500'}`} />
                      <span className="font-medium dark:text-white">{habit.days.map((d , idx)=>{return  <p key={idx} className='inline mx-[2px] text-[9px]' >{days[d-1]}</p> })}</span>
                  </div>}
                </div>


              </div>

              <div className="text-right ">
                {habit.habitType.type === 'check' ? (
                  <motion.div
                   onClick={() => {console.log("test") ; setTimeout(()=>{ onHabitClick(null) ;   updateHabitProgress(habit._id , isComplete ? 0 : 1)}  ,50) } }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}>
                    {isComplete ? (
                      <CheckCircle2 className="w-8 h-8 text-white drop-shadow-lg justify-self-end" />
                    ) : (
                      <Circle className="w-8 h-8 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors justify-self-end" />
                    )}
                  </motion.div>
                ) : (
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="flex items-center  gap-1 justify-end">
                      {habit.habitType.type === 'time' ? (
                        <>
                          <span className={`text-xl font-bold ${isComplete ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            {Math.round(todayProgress/60)}
                          </span>
                          <span className={`text-sm ${isComplete ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                            /{Math.round(habit.habitType.value/60)}
                          </span>
                            <div className={`text-[4px] font-medium ${
                               isComplete ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                             } text-right`}>
                               {habit.habitType.type === 'time' ? 'minutes' : 'times'}
                             </div> 
                        </>
                      ) : (
                        <>
                          <span className={`text-3xl font-bold ${isComplete ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            {todayProgress}
                          </span>
                          <span className={`text-lg ${isComplete ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                            /{habit.habitType.value}
                          </span>
                          <div className={`text-xs font-medium ${
                      isComplete ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                    } text-right`}>
                      {habit.habitType.type === 'time' ? 'minutes' : 'times'}
                    </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2  px-3 py-1 rounded-full">
                    <CalendarIcon className={`w-3 h-3 ${isComplete ? 'text-white' : 'text-blue-500'}`} />
                    <span className="font-medium dark:text-white">{habit.days.map((d , idx)=>{return  <p key={idx} className='inline mx-[2px] text-[9px]' >{days[d-1]}</p> })}</span>
                  </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.section>
);


// Main Page Component
export default function EnhancedHabitTracker() {
  const today = dayjs()
  const ISOToday = today.format('YYYY-MM-DD')
  const currentDayOfWeek = today.day() + 1

  const [habits, setHabits] = useState<IHabit[]>([])
  const [todayHabits, setTodayHabits] = useState<IHabit[]>([])

  const [selectedHabit, setSelectedHabit] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchHabits = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/habit')
      const data = res.data
      setHabits(data)
      setTodayHabits(data.filter((habit: any) => habit.days.includes(currentDayOfWeek)))
    } catch (err) {
      console.error('Failed to fetch habits', err)
    } finally {
      setLoading(false)
    }
}
const updateHabitState = (habitId : string , progress : number)=>{
  const targeyHabit = (todayHabits.find((h) =>{
    return h._id == habitId 
}))


const updaterHistory = targeyHabit?.history.map(item => {
  return item.date == ISOToday ? {date : ISOToday ,  progress : progress} : item
})

targeyHabit.history = updaterHistory
console.log(targeyHabit)

setTodayHabits(todayHabits.map((h) =>{
  return h._id == habitId ? targeyHabit : h
}) as any)
}

const updateHabitProgress = async (habitId : string , progress : number) => {
  try {
    const response = await axios.patch(`/api/habit/${habitId}`, { progress })
    setHabits(habits.map((h) =>{
      return h._id == habitId ? response.data : h
  }) as any)

  } catch (err) {
      console.error('Failed to update habit', err)
  }
  }

  const handleHabitClick = async (habit: any) => {
    setSelectedHabit(habit)
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  if (loading) return <div className='screen'><InfinityLoading/></div>

  const totalHabits = todayHabits.length
  const completedHabits = todayHabits.filter(h => isHabitCompleted(h, ISOToday)).length
  const totalStreak = todayHabits.reduce((sum, h) => sum + calculateStreak(h.history), 0)

  return (
    <div className="flex w-screen overflow-hidden">
        <meta name="theme-color" content={`${selectedHabit? hexWithOpacity(selectedHabit.color.hex,50) : "#f112b2" }`}></meta>

            <SideBar/>

    <div className="min-h-screen max-md:pt-[64px] w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-700">
      {/* <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
          }}></div>
          </div> */}

      <div className="relative p-5  mx-auto">
        {/* <StatsCards totalHabits={totalHabits} completedHabits={completedHabits} totalStreak={totalStreak} /> */}
        
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-10">
          <motion.div 
            className="xl:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            >
            <Calender habits={habits} />
          </motion.div>
          
          <div className="xl:col-span-7 md:col-span-1 col-span-1">
            {todayHabits.length > 0 ? (
              <HabitsGrid habits={habits.filter((habit: any) => habit.days.includes(currentDayOfWeek))} updateHabitProgress={updateHabitProgress} onHabitClick={handleHabitClick} ISOToday={ISOToday} />
            ) : (
              <NoHabitsMessage onCreate={() => setSelectedHabit(null)} />
            )}
          </div>
        </div>
        
        <AnimatePresence>
          {selectedHabit && (
            <HabitModal id={selectedHabit._id} onClose={() => setSelectedHabit(null)} updateState={updateHabitState} />
          )}
        </AnimatePresence>
      </div>
    </div>
    </div>
  )
}