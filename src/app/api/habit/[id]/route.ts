import dbConnect from "@/lib/dbConnect";
import Habit from "@/models/Habit";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";




export async function GET(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();

  const id = context.params.id;
  console.log(id);

  const habit = await Habit.findById(id);
  return NextResponse.json(habit);
}


  
export async function PATCH(req: NextRequest , context : { params: { id: string }} ) {
    await dbConnect();
    
    const id = context.params.id;

    const { progress } = await req.json();
    const today = dayjs().format('YYYY-MM-DD');

    console.log("progress" , progress)
    
    try {

      const habit = await Habit.findById(id);
      if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
  
      const historyEntry = habit.history.find(h => h.date === today);
  
      if (historyEntry) {
        historyEntry.progress = progress;
      } else {
        habit.history.push({ date: today, progress });
      }
  
      await habit.save();
  
      return NextResponse.json( habit );
    } catch (error) {
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
  }
