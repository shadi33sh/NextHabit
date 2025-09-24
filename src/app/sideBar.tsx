'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, Plus, Moon, Sun, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import AddHabitForm from './components/habitform'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import SigninButton from './components/SigninButton'

export default function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = theme === 'dark' || (!theme && prefersDark)
    setIsDark(shouldBeDark)
    if (shouldBeDark) document.documentElement.classList.add('dark')

    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleDarkMode = () => {
    const newTheme = isDark ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', !isDark)
    localStorage.setItem('theme', newTheme)
    setIsDark(!isDark)
  }

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'add', icon: Plus, label: 'Add Habit', gradient: 'from-purple-500 to-pink-500', onClick: () => setIsSidebarOpen(false) || setIsModalOpen(true) }
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle Button */}
 
      {isMobile && (
        <div className="fixed top-0 left-0 w-full h-18 bg-white/90 dark:bg-gray-800/90 flex justify-between items-center shadow-md px-4 z-30">
        <div className='flex items-center'>
          <img src="/HBDAY2.png" className='w-8 h-8 mx-1'  alt="" />
          <div className="text-xl font-extrabold text-gray-800 dark:text-white">Habit<span className='text-pink-500'>Day</span></div>
        </div>
        <SigninButton/>
      </div>
      )}


      {/* Sidebar */}
      <AnimatePresence>
          <div
            key="sidebar"
            className="max-md:hidden h-screen w-[60px] z-40 
                       md:flex flex-col items-center py-6 
                       bg-white dark:bg-gray-900 
                       backdrop-blur-xl border-r border-white/20 dark:border-gray-700/20 shadow-lg">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative group mb-8"
            >
               <div className="relative rounded- dark:border-gray-700 overflow-hidden">
                <img src="/HBDAY2.png" className='w-9 h-9 mx-1'  alt="" />
              </div>
       
            </motion.div>

            {/* Navigation */}
            <div className="flex flex-col gap-5 mb-auto dark:text-white">
            <motion.button
              onClick={()=>setIsModalOpen(true)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl group relative"
              title={"add habit"}
            >
                <Plus size={20}/>
            </motion.button>

            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl group relative"
              title={isDark ? 'Light Mode' : 'Dark Mode'}>
                <motion.div animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium
                           bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900
                           shadow-lg whitespace-nowrap"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </motion.div>
            </motion.button>

            </div>

            {/* Divider */}
            <motion.div
              layout
              className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700 mb-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4 }}
            />

            {/* Dark Mode Toggle */}


            {/* Settings */}
            <SigninButton/>
            <motion.button
              whileHover={{ rotate: 90, scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 p-2 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-md group relative"
              title="Settings"
            >

              <Settings size={20} />
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium
                           bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900
                           shadow-lg whitespace-nowrap"
              >
                Settings
              </motion.div>
            </motion.button>
          </div>

      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && <AddHabitForm onCancel={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
