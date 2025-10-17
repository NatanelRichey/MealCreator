import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ShoppingListSchema = new Schema({
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

export default mongoose.model('ShoppingList', ShoppingListSchema);

