import mongoose from 'mongoose';

/**
 * DATABASE CONNECTION FOR NEXT.JS
 * 
 * This file handles MongoDB connection using Mongoose.
 * It uses a singleton pattern to prevent multiple connections in development
 * (Next.js hot reloads can create multiple connections without this pattern).
 * 
 * How it works:
 * 1. Checks if already connected - reuses existing connection
 * 2. If not connected, creates new connection
 * 3. Caches connection in global scope to persist across hot reloads
 */

// Get database URL from environment variables
const MONGODB_URI = process.env.DB_URL || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the DB_URL or MONGODB_URI environment variable in .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB database
 * 
 * @returns Promise that resolves to mongoose instance
 * 
 * Usage in API routes:
 * ```typescript
 * import { connectDB } from '@/lib/db';
 * 
 * export async function GET(request: Request) {
 *   await connectDB();
 *   // Your database operations here
 * }
 * ```
 */
async function connectDB(): Promise<typeof mongoose> {
  // If already connected, return cached connection
  if (cached.conn) {
    console.log('📦 Using cached database connection');
    return cached.conn;
  }

  // If no existing promise, create new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
    };

    console.log('🔌 Creating new database connection...');
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully!');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;

