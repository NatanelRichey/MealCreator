import pkg  from 'mongoose';
const { Schema, model } = pkg

const ImageSchema = new Schema({
    url: { type: String, default: "https://res.cloudinary.com/meal-creator/image/upload/v1662227283/meal-images/empty-plate_p22fqq.jpg"},
    filename: { type: String, default: "meal-images/empty-plate_p22fqq"}
});

const mealSchema = new Schema({
    mealName: String,
    ingredients: [String],
    tags: [String],
    imgSrc: ImageSchema,
    owner: String
})

const Meals = model('Meals', mealSchema);

export default Meals;