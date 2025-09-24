  import mongoose, { Schema, Document  , Model} from 'mongoose';

  export interface IHistory {
    date: String;
    progress?: number;
  }
  

  export type HabitType = { type: 'check' | 'time' | 'number'; value: number };

    
    const ColorSchema = new Schema(
      {
        hex: { type: String},
        name: { type: String}
      },
      { _id: false }
    );

    
    export interface IHabit extends Document {
      title: string;
      habitType: HabitType;
      history: IHistory[];
      days : Number[]
      color: { hex: string; name: string };
      createdAt: Date;
      updatedAt: Date;
    }
    
    const HistorySchema = new Schema<IHistory>(
      {
        date: { type: String, required: true },
        progress: { type: Number }
      },
      { _id: false }
    );
    
    


    const HabitTypeSchema = new Schema(
      {
        type: { 
          type: String,
          required: true,
          enum: ['check', 'number', 'time']
        },
        value: { type: Number  , required: true,}
      },
      { _id: false }
    );
    

    
    const HabitSchema = new Schema<IHabit>(
      {
        title: { type: String, required: true },
        habitType: { type: HabitTypeSchema, required: true },
        history: { type: [HistorySchema], default: [] },
        days: { type: [Number], default: [1,2,3,4,5,6,7] },
        color: { type: ColorSchema, required: true }
      },
      { timestamps: true }
    );
    

    
    const Habit: Model<IHabit> =
    mongoose.models.Habit ||
    mongoose.model<IHabit>('Habit', HabitSchema);

  export default Habit;
