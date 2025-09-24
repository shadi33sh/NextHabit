'use client'
import { useEffect } from 'react'

export default function DarkModeToggle() {
  
  // const savedTheme = localStorage.getItem('theme')
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])
  

    // if (savedTheme==='dark') {
    //   document.documentElement.classList.remove('dark')
    //   localStorage.setItem('theme', 'light')
    // } else {
    //   document.documentElement.classList.add('dark')
    //   localStorage.setItem('theme', 'dark')
    // }

    return null
}
