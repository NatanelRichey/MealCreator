import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ShoppingItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    unit: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: 'Other'
    },
    checked: {
        type: Boolean,
        default: false
    },
    addedDate: {
        type: Date,
        default: Date.now
    }
});

const ShoppingListSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [ShoppingItemSchema]
});

export default mongoose.model('ShoppingList', ShoppingListSchema);

