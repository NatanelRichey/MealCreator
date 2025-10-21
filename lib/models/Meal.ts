import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * MEAL MODEL (TypeScript version)
 * 
 * Converted from Express models/meal.js
 * 
 * This model stores meal recipes with ingredients, tags, images, and metadata.
 * Each meal belongs to a user (owner field).
 */

// TypeScript interface for Meal document
export interface IMeal extends Document {
  mealName: string;
  description: string;
  ingredients: string[];
  tags: string[];
  instructions: string;
  imgSrc: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  category: string;
  owner: string;
  confirmed: boolean;
  createdAt: Date;
}

// Mongoose schema definition
const MealSchema = new Schema<IMeal>({
  mealName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  ingredients: [String],
  tags: [String],
  instructions: {
    type: String,
    default: ''
  },
  imgSrc: {
    type: String,
    default: 'https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg'
  },
  prepTime: {
    type: Number,
    default: 0
  },
  cookTime: {
    type: Number,
    default: 0
  },
  servings: {
    type: Number,
    default: 1
  },
  category: {
    type: String,
    default: 'Other'
  },
  owner: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Export Meal model
 * 
 * In Next.js, we need to check if model already exists to avoid
 * "Cannot overwrite model" errors during hot reload in development
 */
const Meal: Model<IMeal> = mongoose.models.Meal || mongoose.model<IMeal>('Meal', MealSchema);

export default Meal;

