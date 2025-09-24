import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Habit, { IHabit } from '@/models/Habit';
import { BarChart3, Calendar, Minus, MinusCircle, Plus } from 'lucide-react';
import dayjs from 'dayjs';
import axios from 'axios';
import HabitCalendar from './HabitCalandar';

interface HabitModalProps {
  id: string;
  onClose: () => void;
  updateState : (id :string , progress : number) => void
}

const today = dayjs()
const ISOToday = today.format('YYYY-MM-DD')

export const HabitModal: React.FC<HabitModalProps> = ({ id , onClose , updateState } : {id : string , onClose: () => void , updateState : (id :string , progress : number)=> void}) => {
  
  const [numberValue, setNumberValue] = useState();
  const [isRunning, setIsRunning] = useState(false);
  const [isChecked, setIsChecked] = useState();
  const [timeElapsed, setTimeElapsed] = useState();
  const [habit , setHabit] = useState<IHabit>()
  const [activeTab, setActiveTab] = useState<'today' | 'stats' | 'history'>('today');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
    if (!isRunning) {
      // setTimeElapsed(0);
    }
  };

  const getdata= async() => {
         
    try{
      const response = await axios.get(`api/habit/${id}`)
      setHabit(response.data)
     
      
      const today = dayjs().format('YYYY-MM-DD')
      
      const todayEntry = response.data.history?.find(h =>
        h.date === today
      );
      

      console.log(todayEntry)
      
    if (response.data.habitType.type === 'number') {
      setNumberValue(todayEntry?.progress ?? 0);
    } else if (response.data.habitType.type === 'time') {
      setTimeElapsed((todayEntry?.progress ?? 0)); 
    } else if (response.data.habitType.type === 'check') {
      setIsChecked(todayEntry?.progress == 0 ? false : true);
    }
  }catch(e){
    console.log(e)
  }
  }

  useEffect(()=>{
    getdata()
  }, []);


  const updateHabit = async()=>{
    try {
      if((numberValue || isChecked || timeElapsed)&&habit){
        await axios.patch(`api/habit/${habit._id}`, {
          progress:  numberValue || (isChecked?1:0) || timeElapsed,    
        });
        updateState(habit._id , numberValue || (isChecked?1:0) || timeElapsed)
        }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
      updateHabit()
  },[numberValue  , isChecked , isRunning])

  useEffect(()=>{
    if(timeElapsed&&isRunning==false || timeElapsed&&timeElapsed%30==0){
      updateHabit()
    }
  },[timeElapsed])
  
  const formatTime = (seconds: number) => {


    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (date : string , habit : any) => {

    if (habit){
      const todayEntry = habit.history?.find(h =>
        h.date == date 
     );

     const progress = todayEntry?.progress ?? 0;

      if (habit.habitType.type === 'check') {
        return progress * 100;
      } else{
        return progress/habit.habitType.value*100
     }

  }
  };
  


  const calculateStats = () => {
    if (habit){
      
      
      const totalDays = habit.history?.length || 0;
      const completedDays = habit.history?.filter(h => (h.progress || 0) > 0).length || 0;
      const currentStreak = 7; // Mock current streak
      const longestStreak = 15; // Mock longest streak
      const averageProgress = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
      
      // Weekly progress (mock data)
      const weeklyData = [
      { day: 'Mon', progress: 80, completed: true },
      { day: 'Tue', progress: 100, completed: true },
      { day: 'Wed', progress: 60, completed: false },
      { day: 'Thu', progress: 100, completed: true },
      { day: 'Fri', progress: 90, completed: true },
      { day: 'Sat', progress: 0, completed: false },
      { day: 'Sun', progress: 100, completed: true }
    ];

    // Monthly trend (mock data)
    const monthlyTrend = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      progress: Math.random() * 100,
      completed: Math.random() > 0.3
    }));
    
    return {
      totalDays,
      completedDays,
      currentStreak,
      longestStreak,
      averageProgress,
      weeklyData,
      monthlyTrend,
      completionRate: Math.round((completedDays / Math.max(totalDays, 1)) * 100)
    };
  }
  };

  const Card = ({ children, className = '', gradient = false, ...props }) => (
    <motion.div
      className={`relative overflow-hidden rounded-3xl ${gradient 
        ? 'bg-gradient-to-br from-white/90 to-white/60 dark:from-gray-800/90 dark:to-gray-800/60' 
        : 'bg-white/80 dark:bg-gray-800/80'
      } backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-xl ${className}`}
      whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-50" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  const stats = calculateStats();
  const progressPercentage = getProgressPercentage(ISOToday , habit);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const scheduledDays = habit?.days?.map((d: number) => dayNames[d]) || [];
  
  if(!habit) return <>wating</>

  return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Enhanced Backdrop with animated particles */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Floating particles background */}
        {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full opacity-20"
              style={{ 
                backgroundColor: habit.color.hex,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div> */}
        
        {/* Enhanced Modal */}
        <motion.div
          className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden scroll-hidden "
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >



          {/* Header of the Modal */}
          <div 
            className="relative p-6 text-white overflow-hidden "
            style={{
              background: `linear-gradient(135deg, ${habit.color.hex}ee, ${habit.color.hex}cc, ${habit.color.hex}fa)`
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
                  backgroundSize: '24px 24px'
                }}
                animate={{ backgroundPosition: ['0px 0px', '24px 24px'] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                  <motion.h2 
                    className="text-3xl font-bold mb-2"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {habit.title}
                  </motion.h2>
                                  
                <button
                  onClick={onClose}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:rotate-90"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 pt-4">
            <div className="flex  rounded-2xl p-1">
              {[
                { id: 'today', label: 'Today', icon: '' },
                { id: 'history', label: 'History', icon: '' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? habit.color.hex : 'transparent'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="md:p-6 max-md:p- max-h-[700px] max-md:max-h-[500px] overflow-y-auto scroll-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              {/* Today Tab */}
              {activeTab === 'today' && (
                <motion.div
                  key="today"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Interactive Controls */}
                  {habit.habitType.type === 'number' && (
                    <div className=" p-8">
                      <h3 className="text-lg font-semibold text-center mb-6 text-gray-800 dark:text-white">
                        Update Progress
                      </h3>
                      <div className="flex items-center justify-center gap-8">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          style={{backgroundColor : habit.color.hex}}

                          whileTap={{ scale: 0.9 }}
                          onClick={() => setNumberValue(prev => Math.max(0, prev - 1))}
                          className=" bg-gradient-to-br p-2 center rounded-2xl text-2xl font-bold text-white shadow-lg"
                        >
                          <Minus/>
                        </motion.button>
                        
                        <div className="relative">
                          <motion.div 
                            className="px-8"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.3 }}
                            key={numberValue}
                          >
                        
                          <span className={`text-7xl font-bold ${habit.habitType.value==numberValue ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            {numberValue}
                          </span>
                          <span className={`text-lg ${habit.habitType.value==numberValue ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                            /{habit.habitType.value}
                          </span>
                          </motion.div>
                          
                          {/* Progress bar */}
                          <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: habit.color.hex }}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((numberValue / habit.habitType.value) * 100, 100)}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          style={{backgroundColor : habit.color.hex}}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setNumberValue(prev => prev + 1)}
                          className="bg-gradient-to-br p-2 center rounded-2xl text-2xl font-bold text-white shadow-lg "
                        >
                          <Plus/>
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {habit.habitType.type === 'time' && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8">
                      <h3 className="text-lg font-semibold text-center mb-6 text-gray-800 dark:text-white">
                        Timer Session
                      </h3>
                      <div className="flex flex-col items-center space-y-6">
                        <div className="relative">
                          <motion.div
                            className="w-48 h-48 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden"
                            animate={{
                              borderColor: isRunning ? habit.color.hex : undefined,
                              boxShadow: isRunning ? `0 0 40px ${habit.color.hex}60` : undefined
                            }}
                          >
                            {/* Animated background */}
                            {isRunning && (
                              <motion.div
                                className="absolute inset-0 rounded-full opacity-10"
                                style={{ backgroundColor: habit.color.hex }}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                            
                            <div className="text-center z-10">
                              <motion.div 
                                className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                                animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
                                transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
                              >
                                {formatTime(timeElapsed)}
                              </motion.div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Target: {Math.round(habit.habitType.value/60)} : {habit.habitType.value%60}
                              </div>
                              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-3 overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: habit.color.hex }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min((timeElapsed / (habit.habitType.value * 60)) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </motion.div>
                          
                          {/* Rotating border animation */}
                          {isRunning && (
                            <motion.div
                              className="absolute -inset-4 rounded-full border-4 border-dashed opacity-30"
                              style={{ borderColor: habit.color.hex }}
                              animate={{ rotate: 360 }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={toggleTimer}
                          className={`px-6 py-2 rounded-3xl my-5 font-bold text-sm transition-all duration-300 ${
                            isRunning
                              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg '
                              : 'text-white shadow-lg'
                          }`}
                          style={{
                            background: isRunning ? undefined : `linear-gradient(135deg, ${habit.color.hex}, ${habit.color.hex}dd)`,
                            boxShadow: isRunning ? undefined : `0 8px 25px ${habit.color.hex}40`
                          }}
                        >
                          {isRunning ? 'Stop Timer' : 'Start Timer'}
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {habit.habitType.type === 'check' && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8">
                      <motion.label
                        className="flex items-center ga cursor-pointer "
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => setIsChecked(prev => !prev)}
                            className="sr-only"
                          />
                          <motion.div
                            className="w-10 h-10 rounded-2xl border-4 flex items-center justify-center shadow-lg"
                            animate={{
                              backgroundColor: isChecked ? habit.color.hex : 'transparent',
                              borderColor: isChecked ? habit.color.hex : '#d1d5db',
                              scale: isChecked ? [1, 1.1, 1] : 1
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {isChecked && (
                              <motion.svg
                                className="w-8 h-8 text-white"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </motion.svg>
                            )}
                          </motion.div>
                          
                          {isChecked && (
                            <div className="absolute inset-0 pointer-events-none">
                              {Array.from({ length: 8 }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute w-2 h-2 rounded-full"
                                  style={{ backgroundColor: habit.color.hex }}
                                  initial={{ scale: 0, x: 0, y: 0 }}
                                  animate={{
                                    scale: [0, 1, 0],
                                    x: Math.cos(i * 45 * Math.PI / 180) * 50,
                                    y: Math.sin(i * 45 * Math.PI / 180) * 50
                                  }}
                                  transition={{ duration: 0.6, delay: i * 0.1 }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 pl-5">
                          <motion.div 
                            className="text-lg font-bold text-gray-900 dark:text-white mb-2"
                            animate={{ color: isChecked ? habit.color.hex : undefined }}
                          >
                            {isChecked ? 'Completed' : 'Mark as Complete'}
                          </motion.div>
                       
                        </div>
                      </motion.label>
                    </div>
                  )}
                </motion.div>
              )}
              {activeTab === 'history' && (
                <>
            
                  
                  <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 md:grid grid-cols-2 w-full"
                >
                  
                  <div  className="p-8">
                    <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white flex items-center justify-center gap-3">
                      <Calendar className="w-6 h-6" style={{ color: habit.color.hex }} />
                      Progress History
                    </h3>



                      <HabitCalendar
                      habit={habit} 
                      getProgressPercentage={getProgressPercentage} 
                      />
                    
                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-200"></div>
                        <span className='text-[9px] font-bold text-nowrap'>Not completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded opacity-50" 
                          style={{ backgroundColor: habit.color.hex }}
                        ></div>
                        <span className='text-[9px] font-bold text-nowrap'>Partially completed</span>
                      </div>  
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: habit.color.hex }}
                        ></div>
                        <span className='text-[9px] font-bold text-nowrap'>Completed</span>
                      </div>
                    </div>
                  </div>
                  
                  <Card gradient className='h-fit'>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white flex items-center justify-center gap-3">
                      <BarChart3 className="w-6 h-6" style={{ color: habit.color.hex }} />
                      Weekly Overview
                    </h3>
                    
                    <div className="grid grid-cols-7 gap-4">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                        const progress = [85, 100, 60, 100, 90, 6, 100][index];
                        const isCompleted = progress > 0;
                        
                        return (
                          <motion.div
                            key={day}
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="mb-3">
                              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                {day}
                              </div>
                              <motion.div
                                className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-xl relative overflow-hidden"
                              >
                                <motion.div
                                  className="absolute bottom-0 w-full rounded-xl relative overflow-hidden"
                                  style={{ 
                                    height: `${progress}%`,
                                    backgroundColor: isCompleted ? habit.color.hex : '#e5e7eb'
                                  }}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${progress}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                >
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/20 to-white/0"
                                    animate={{ y: [-100, 100] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  />
                                </motion.div>
                                
                                {/* Progress label */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className={`text-[9px] font-bold ${progress > 50 ? 'text-white' : 'text-gray-600'}`}>
                                    {progress}%
                                  </span>
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>


                  </Card>

                </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
  );
};