import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
    name: String,
    quantity: Number,
    unit: String
});

const MealSchema = new Schema({
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

export default mongoose.model('Meals', MealSchema);

