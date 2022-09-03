import Pantry from "../models/pantry.js"
import ShoppingList from "../models/shopping-list.js"

const shoppingCategories = ["Vegetables", "Fruits", "Grains & Pasta", "Dairy", "Fish & Eggs", "Fats & Oils", "Condiments", "Freezer", "Miscellaneous"]

export const renderList = async (req, res) => {
    const curUsername = res.locals.currentUser.username
    const items = await ShoppingList.find({owner:curUsername})
    res.render('list', { items, shoppingCategories })
}

export const moveToPantry =  async (req, res) => {
    const name = req.params.name
    const curUsername = res.locals.currentUser.username
    ShoppingList.findOne({name:name, owner:curUsername})
    .then (res => {
        Pantry.insertMany({name:res.name, category:res.category, owner:curUsername, inStock:true})
    })
    await ShoppingList.deleteMany({name:name, owner:curUsername})
    req.flash('success', `'${name}' stocked in Pantry`);
    res.redirect('/shopping-list')
}

export const addToList = async (req, res) => {
    const name = req.body.name
    const category = req.params.category
    const curUsername = res.locals.currentUser.username
    ShoppingList.insertMany({name:name, category:category, owner:curUsername});
    req.flash('success', `'${name}' added succesfully!`);
    res.redirect('/shopping-list')
}

export const deleteFromList = async (req, res) => {
    const { id } = req.params;
    await ShoppingList.findByIdAndDelete(id);
    req.flash('success', `Item deleted`);
    res.redirect('/shopping-list')
}

export const updateItemName = async (req, res) => {
    const { id } = req.params;
    await ShoppingList.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('error', 'Please enter item name');
    res.redirect('/shopping-list')
}