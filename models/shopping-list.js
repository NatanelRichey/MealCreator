import pkg  from 'mongoose';
const { Schema, model } = pkg

const shoppingListSchema = new Schema({
    name: String,
    category: String,
    owner: String
})

const ShoppingList = model('ShoppingList', shoppingListSchema);

export default ShoppingList;