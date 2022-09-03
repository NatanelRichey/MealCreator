import Joi from 'joi'

export const mealSchema = Joi.object({
    mealName: Joi.string().required(),
    ingredients: [Joi.string()],
    tags: [Joi.string()],
    // imgSrc: String
})

export const pantrySchema = Joi.object({
    name: Joi.string().required(),
    category: String,
    inStock: {
        type: Boolean,
        default: true
    } 
})

export const shoppingListSchema = Joi.object({
    name: Joi.string().required(),
    category: String,
})