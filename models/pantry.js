import pkg  from 'mongoose';
const { Schema, model } = pkg

const pantrySchema = new Schema({
    name: String,
    category: String,
    inStock: {
        type: Boolean,
        default: true
    },
    owner: String
})

const Pantry = model('Pantry', pantrySchema);
export default Pantry;