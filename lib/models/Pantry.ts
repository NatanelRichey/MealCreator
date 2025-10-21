import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * PANTRY MODEL (TypeScript version)
 * 
 * Converted from Express models/pantry.js
 * 
 * This model stores pantry items (ingredients that the user has in stock).
 * Items can be marked as in stock or not, and have quantities.
 */

// TypeScript interface for Pantry document
export interface IPantry extends Document {
  name: string;
  category: string;
  owner: string;
  inStock: boolean;
  quantity: number;
  unit: string;
  addedDate: Date;
}

// Mongoose schema definition
const PantrySchema = new Schema<IPantry>({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  unit: {
    type: String,
    default: ''
  },
  addedDate: {
    type: Date,
    default: Date.now
  }
});

/**
 * Export Pantry model
 * 
 * Checks if model exists to prevent Next.js hot-reload errors
 */
const Pantry: Model<IPantry> = mongoose.models.Pantry || mongoose.model<IPantry>('Pantry', PantrySchema);

export default Pantry;

