import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
    name: String,
    quantity: Number,
    unit: String
});

const MealSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    ingredients: [IngredientSchema],
    instructions: {
        type: String,
        default: ''
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
    images: [{
        url: String,
        filename: String
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Meals', MealSchema);

