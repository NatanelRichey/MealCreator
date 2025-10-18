import Pantry from "../models/pantry.js"
import ShoppingList from "../models/shopping-list.js"

const categories = ["Vegetables", "Fruits", "Grains Pasta", "Dairy", "Meat Poultry", "Fish Eggs", "Fats Oils", "Condiments", "Freezer", "Baking", "Nuts Snacks", "Miscellaneous", "Saved Items"]
const twoWordCats = {"Grains Pasta":"Grains & Pasta", "Fish Eggs":"Fish & Eggs", "Fats Oils":"Fats & Oils", "Meat Poultry":"Meat & Poultry", "Nuts Snacks":"Nuts & Snacks"}

export const moveToSavedItems =  async (req, res) => {
    const name = req.params.name
    const curUsername = res.locals.currentUser.username
    // console.log(curUsername)
    const newItem = await Pantry.updateMany({name:name, owner:curUsername},{inStock:false})
    // console.log(newItem)
    req.flash('success', `'${name}' moved to Saved Items`);
    res.redirect('/pantry')
}

export const renderPantry =  async (req, res) => {
    const curUsername = res.locals.currentUser.username
    const items = await Pantry.find({owner:curUsername})
    res.render('pantry', { items, categories, twoWordCats })
}

export const addItemToPantry =  async (req, res) => {
    const name = req.body.name
    const category = req.params.category
    const curUsername = res.locals.currentUser.username
    await Pantry.insertMany({name:name, category:category, owner:curUsername, inStock:true});
    req.flash('success', `'${name}' added successfully!`);
    res.redirect('/pantry')
}

export const moveFromSavedItems =  async (req, res) => {
    const name = req.params.name
    const curUsername = res.locals.currentUser.username
    await Pantry.updateMany({name:name, owner:curUsername},{inStock:true})
    req.flash('success', `'${name}' moved back to Pantry`);
    res.redirect('/pantry')
}

export const moveToCart =  async (req, res) => {
    const name = req.params.name
    const curUsername = res.locals.currentUser.username
    Pantry.findOne({name:name})
    .then (res => {
        ShoppingList.insertMany({name, category:res.category, inStock:true, owner:curUsername})
    })
    await Pantry.deleteMany({name:name, owner:curUsername})
    req.flash('success', `'${name}' moved succesfully to Shopping List!`);
    res.redirect('/pantry')
}

export const editPantryItemName =  async (req, res) => {
    const { id } = req.params;
    const updatedItem = await Pantry.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    
    // Check if request is AJAX (from fetch)
    if (req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers['content-type'] === 'application/json') {
        return res.json({ success: true, item: updatedItem });
    }
    
    // Traditional form submission
    res.redirect('/pantry')
}

export const deleteItem =  async (req, res) => {
    const { id } = req.params;
    await Pantry.findByIdAndDelete(id);
    req.flash('success', `Item deleted`);
    res.redirect('/pantry')
}