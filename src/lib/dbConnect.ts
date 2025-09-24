// src/lib/dbConnect.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// @ts-ignore
let cached: MongooseCache = global._mongooseCache || { conn: null, promise: null };
if (!global._mongooseCache) global._mongooseCache = cached;

async function dbConnect() {
  if (cached.conn) {
    console.log('✅ Reusing existing MongoDB connection');
    return cached.conn;
  }
  if (!cached.promise) {
    console.log('🔌 Establishing new MongoDB connection…');
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
      .then((mongooseClient) => {
        console.log('✅ MongoDB connected');
        return mongooseClient;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
