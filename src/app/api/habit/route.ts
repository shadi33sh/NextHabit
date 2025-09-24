// src/app/api/habit/route.ts
import { NextResponse } from 'next/server';
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
    { hex: '#4cac97', name: 'Light Yellow' }
];

export async function POST(req: Request) {
  await dbConnect();
  // const { title, habitType, color } = await req.json();
  const created = await Habit.create(await req.json());
  return NextResponse.json(created, { status: 201 });
}

export async function GET() {
  await dbConnect();
  const created = await Habit.find();
  return NextResponse.json(created);
}

export async function PATCH(req: Request) {
  await dbConnect();

  const { id,  progress } = await req.json();
  
  const today = dayjs().format('YYYY-MM-DD');

  console.log("progress" , progress)
  try {
    // Add or update today's entry in history
    const habit = await Habit.findById(id);
    if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 });

    const historyEntry = habit.history.find(h => h.date === today);

    if (historyEntry) {
      historyEntry.progress = progress;
    } else {
      habit.history.push({ date: today, progress });
    }

    await habit.save();

    return NextResponse.json({ success: true, habit });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}



