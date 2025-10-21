import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * USER MODEL (Simplified - No Passwords!)
 * 
 * SIMPLIFIED FROM EXPRESS:
 * - No password field (no authentication needed)
 * - Only 2 users: "default" and "demo"
 * - Users login with a button click, no credentials
 * 
 * Each user can have their own meals, pantry items, and shopping list.
 */

// TypeScript interface for User document
export interface IUser extends Document {
  username: string;
  email: string;
  createdAt: Date;
}

// Mongoose schema definition
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for faster queries
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

/**
 * Export User model
 * 
 * Checks if model exists to prevent Next.js hot-reload errors
 */
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
