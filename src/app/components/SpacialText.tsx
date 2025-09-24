'use client'
import React, { ReactNode } from 'react'

export default function SpacialText({ children }: { children: ReactNode }) {
  return (
    <div className="p-1 w-fit px-3  text-center text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
      {children}
    </div>
  )
}