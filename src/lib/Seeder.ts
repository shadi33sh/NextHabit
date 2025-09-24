import dbConnect from '@/lib/dbConnect';
import Habit from '@/models/Habit';
import dayjs from 'dayjs';

// Util: pick random items from a list
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickMany = <T,>(arr: T[], count: number): T[] => [...arr].sort(() => 0.5 - Math.random()).slice(0, count);

const titles = ['Meditate', 'Read', 'Exercise', 'Journal', 'Stretch', 'Walk', 'Sleep Early', 'Drink Water', 'Code Practice', 'Gratitude'];
const types = ['check', 'number', 'time'] as const;

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

export async function seedHabits() {
  await dbConnect();

  const habits = Array.from({ length: 10 }).map(() => {
    const type = pick(types);
    let value = 1;

    if (type === 'number') value = Math.floor(Math.random() * 10) + 3;
    if (type === 'time') value = Math.floor(Math.random() * 30) + 15;

    return {
      title: pick(titles),
      days: pickMany([1, 2, 3, 4, 5, 6, 7], Math.floor(Math.random() * 5) + 3), // 3–7 days
      habitType: {
        type,
        value
      },
      color: pick(colors),
      history: [
        {
          date: dayjs().subtract(1, 'day').toISOString(),
          progress: 0
        }
      ]
    };
  });

  await Habit.insertMany(habits);
  console.log('✅ Seeded 10 habits');
}
