'use client'
import axios from "axios";
import { Check, Sparkles, Loader2, X } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "../Alert";
import { HabitType } from "@/models/Habit";

function darkenHex(hex: string, amount: number = 0.2): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  hex = hex.replace(/^#/, '');
  const r = clamp(parseInt(hex.slice(0, 2), 16) * (1 - amount));
  const g = clamp(parseInt(hex.slice(2, 4), 16) * (1 - amount));
  const b = clamp(parseInt(hex.slice(4, 6), 16) * (1 - amount));
  return '#' + [r, g, b].map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
}

export default function AddHabitForm({ onCancel = () => {} }) {
  const [title, setTitle] = useState('');
  const [habitType, setHabitType] = useState<HabitType>({ type: 'check', value: 0 });
  const [color, setColor] = useState({ hex: '#F472B6', name: 'Rose' });
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const { showAlert } = useAlert();

  // Lock background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const weekDays = [
    { label: 'Sun', value: 1 },
    { label: 'Mon', value: 2 },
    { label: 'Tue', value: 3 },
    { label: 'Wed', value: 4 },
    { label: 'Thu', value: 5 },
    { label: 'Fri', value: 6 },
    { label: 'Sat', value: 7 }
  ];

  const colors = [
    { hex: '#F472B6', name: 'Rose' },
    { hex: '#8B5CF6', name: 'Purple' },
    { hex: '#06B6D4', name: 'Cyan' },
    { hex: '#10B981', name: 'Emerald' },
    { hex: '#F59E0B', name: 'Amber' },
    { hex: '#f16d6d', name: 'Red' },
    { hex: '#EC4899', name: 'Pink' },
    { hex: '#6366F1', name: 'Indigo' },
    { hex: '#3B82F6', name: 'Blue' },
    { hex: '#22D3EE', name: 'Sky' },
    { hex: '#E879F9', name: 'Fuchsia' },
    { hex: '#84Cfa1', name: 'Lime' },
    { hex: '#FACC15', name: 'Yellow' },
    { hex: '#A855F7', name: 'Violet' },
    { hex: '#D946EF', name: 'Pink Violet' },
    { hex: '#FB923C', name: 'Orange' },
    { hex: '#4ADE80', name: 'Green' },
    { hex: '#FDE68A', name: 'Light Yellow' }
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showAlert('error', 'Habit name is required');
      return;
    }

    setLoading(true);
    const payload: any = { title, habitType, color, days };

    try {
      await axios.post('/api/habit', payload);
      showAlert('success', "Habit created successfully 🎉");
      onCancel();
    } catch (error) {
      console.log(error);
      showAlert('error', "There was an error while adding the habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3"
        role="dialog"
        aria-modal="true"
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              style={{ backgroundImage: `linear-gradient(120deg, ${color.hex}, ${darkenHex(color.hex, 0.3)})` }}
              className="p-3 rounded-2xl text-white"
            >
              <Sparkles size={22} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Habit</h3>
          </div>

          {/* Fields */}
          <div className="space-y-5">
            {/* Habit name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Habit Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Morning meditation"
                className="w-full px-4 py-3 border-2 border-gray-100 dark:border-gray-600 rounded-2xl focus:outline-none focus:border-purple-300 dark:focus:border-purple-500 focus:bg-purple-50/30 dark:focus:bg-purple-900/20 transition-all duration-300 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                autoFocus
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
              />
            </div>



            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Frequency</label>
              <select
                value={habitType.type}
                onChange={(e) => {
                  const selectedType = e.target.value as 'check' | 'number' | 'time';
                  setHabitType({ type: selectedType, value: 1 });
                }}
                
                
                className="w-full px-4 py-3 border-2 border-gray-100 dark:border-gray-600 rounded-2xl focus:outline-none focus:border-purple-300 dark:focus:border-purple-500 focus:bg-purple-50/30 dark:focus:bg-purple-900/20 transition-all duration-300 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
              >
                <option value="check">check</option>
                <option value="time">Duration</option>
                <option value="number">number</option>
              </select>
            </div>
            
            {habitType.type === 'time' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Default Duration (minutes)</label>
                  <input
                    type="number"
                    value={habitType.value}
                    onChange={(e) => setHabitType({ ...habitType, value: Number(e.target.value) })}
                    min={1}
                    placeholder="e.g. 15"
                    className="w-full px-4 py-3 border-2 border-gray-100 dark:border-gray-600 rounded-2xl focus:outline-none focus:border-purple-300 dark:focus:border-purple-500 focus:bg-purple-50/30 dark:focus:bg-purple-900/20 transition-all duration-300 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                  />
                </div>
              )}

            {/* Repeat days */}
            <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Repeat on</label>

              <div className="grid grid-cols-7 gap-2">
                {weekDays.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setDays(prev =>
                        prev.includes(value) ? prev.filter(d => d !== value) : [...prev, value]
                      )
                    }
                    className={`px-2 py-2 rounded-xl text-sm font-semibold transition-all ${
                      days.includes(value)
                        ? 'text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                    style={{ backgroundColor: days.includes(value) ? color.hex : '' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Choose Color</label>
              <div className="grid grid-cols-6 gap-3 justify-center">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`relative w-10 h-10 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                      color.hex === c.hex ? 'scale-110 shadow-lg' : 'hover:shadow-md'
                    }`}
                    style={{ 
                      backgroundColor: c.hex,
                      boxShadow: color.hex === c.hex ? `0 8px 25px ${c.hex}40` : '0 4px 15px rgba(0,0,0,0.1)'
                    }}
                  >
                    {color.hex === c.hex && (
                      <Check size={18} className="absolute inset-0 m-auto text-white drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-8">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundImage: `linear-gradient(120deg, ${color.hex}, ${darkenHex(color.hex, 0.3)})` }}
              className="flex-1 px-5 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Create
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}