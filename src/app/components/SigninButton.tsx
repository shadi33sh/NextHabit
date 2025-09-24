"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react"; // or use next/image for profile pic

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (session) {
    return (
      <div className="relative" ref={menuRef}>
        {/* Avatar / Icon Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white hover:bg-gray-700"
        >
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className="w-6 h-6" />
          )}
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-12 top-0 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 z-50"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {session.user?.email}
              </p>
              <button
                onClick={() => signOut()}
                className="mt-3 w-full px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Not signed in → show login button (small icon)
  return (
    <button
      onClick={() => signIn("github")} // change to "google" if needed
      className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-500"
    >
      <User className="w-6 h-6" />
    </button>
  );
}
