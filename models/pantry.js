import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PantryItemSchema = new Schema({
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
    addedDate: {
        type: Date,
        default: Date.now
    }
});

const PantrySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [PantryItemSchema]
});

export default mongoose.model('Pantry', PantrySchema);

