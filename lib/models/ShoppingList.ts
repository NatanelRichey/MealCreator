import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * SHOPPING LIST MODEL (TypeScript version)
 * 
 * Converted from Express models/shopping-list.js
 * 
 * This model stores shopping list items (ingredients the user needs to buy).
 * Items can be checked off when purchased.
 */

// TypeScript interface for ShoppingList document
export interface IShoppingList extends Document {
  name: string;
  category: string;
  owner: string;
  inStock: boolean;
  checked: boolean;
  quantity: number;
  unit: string;
  addedDate: Date;
}

// Mongoose schema definition
const ShoppingListSchema = new Schema<IShoppingList>({
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
    default: false
  },
  checked: {
    type: Boolean,
    default: false
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
 * Export ShoppingList model
 * 
 * Checks if model exists to prevent Next.js hot-reload errors
 */
const ShoppingList: Model<IShoppingList> = mongoose.models.ShoppingList || mongoose.model<IShoppingList>('ShoppingList', ShoppingListSchema);

export default ShoppingList;

