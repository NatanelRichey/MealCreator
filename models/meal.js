import pkg  from 'mongoose';
const { Schema, model } = pkg

// const ImageSchema = new Schema({
//     url: { type: String, default: "https://res.cloudinary.com/meal-creator/image/upload/v1662279775/meal-images/empty-plate.jpg"},
//     filename: { type: String, default: "meal-images/empty-plate"}
// });

const mealSchema = new Schema({
    mealName: String,
    ingredients: [String],
    tags: [String],
    imgSrc: {type: String, default: "https://res.cloudinary.com/meal-creator/image/upload/v1662279775/meal-images/empty-plate.jpg"},

    owner: String
})

const Meals = model('Meals', mealSchema);

export default Meals;