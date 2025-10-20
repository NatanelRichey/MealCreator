# 🍳 MealCreator

A comprehensive full-stack web application for meal planning, recipe management, and grocery list organization. Built with Express.js, MongoDB, and EJS templating.

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://mealcreator.onrender.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## 📋 Features

- **🔐 User Authentication**: Secure user registration and login with Passport.js
- **🍽️ Meal Management**: Create, edit, and organize your favorite recipes
- **🥕 Pantry System**: Keep track of ingredients you have on hand
- **📝 Shopping Lists**: Generate and manage grocery lists from your recipes
- **☁️ Image Upload**: Store recipe images using Cloudinary integration
- **📱 Responsive Design**: Mobile-friendly interface with Bootstrap 5
- **💾 Session Management**: Persistent user sessions with MongoDB store

## 🚀 Live Demo

Check out the live application: [https://mealcreator.onrender.com/](https://mealcreator.onrender.com/)

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **Passport.js** - Authentication middleware
- **passport-local-mongoose** - Simplified passport/Mongoose integration
- **express-session** - Session management
- **connect-mongo** - MongoDB session store

### Frontend
- **EJS** - Templating engine
- **ejs-mate** - Layout support for EJS
- **Bootstrap 5** - CSS framework
- **jQuery** - JavaScript library

### File Upload & Storage
- **Multer** - File upload handling
- **Cloudinary** - Cloud-based image storage

### Validation & Utils
- **Joi** - Schema validation
- **method-override** - HTTP verb support (PUT, DELETE)
- **connect-flash** - Flash messages
- **dotenv** - Environment variable management

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB account (local or MongoDB Atlas)
- Cloudinary account (for image uploads)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/NatanelRichey/MealCreator.git
   cd MealCreator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   DB_URL=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET=your_cloudinary_api_secret
   SESSION_SECRET=your_session_secret
   PORT=3000
   ```

4. **Database Setup**
   
   Make sure your MongoDB instance is running and accessible with the connection string in your `.env` file.

5. **Start the application**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   nodemon index.js
   ```

6. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
meal-creator/
├── cloudinary/          # Cloudinary configuration
├── controllers/         # Route controllers
├── models/             # Mongoose models (User, Meal, Pantry, etc.)
├── public/             # Static assets (CSS, JS, images)
├── routes/             # Express routes
│   ├── app.js          # Main application routes
│   ├── meals.js        # Meal-related routes
│   ├── pantry.js       # Pantry management routes
│   ├── list.js         # Shopping list routes
│   └── users.js        # User authentication routes
├── views/              # EJS templates
├── index.js            # Application entry point
├── middleware.js       # Custom middleware
├── schemas.js          # Joi validation schemas
├── package.json        # Dependencies and scripts
└── .env               # Environment variables (not tracked)
```

## 🔧 Configuration

### MongoDB

The application uses MongoDB for data storage. You can use either:
- **MongoDB Atlas** (cloud): Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Local MongoDB**: Install and run MongoDB locally

### Cloudinary

For image uploads, you'll need a Cloudinary account:
1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from the dashboard
3. Add these credentials to your `.env` file

## 📝 Available Scripts

- `npm start` - Start the production server
- `npm test` - Run tests (not yet implemented)

## 🌟 Usage

### Creating a Meal
1. Register for an account or log in
2. Navigate to "Create Meal"
3. Add meal details, ingredients, and instructions
4. Upload an optional image
5. Save your meal

### Managing Your Pantry
1. Go to "My Pantry"
2. Add ingredients you currently have
3. The system will suggest meals you can make with available ingredients

### Shopping Lists
1. Select meals you want to prepare
2. Generate a shopping list
3. The app will compare with your pantry and show what you need to buy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- [ ] React modernization in progress (see `REACT_MODERNIZATION_GUIDE.md`)
- [ ] Need to implement comprehensive test suite

## 🔮 Future Enhancements

- [ ] Meal planning calendar
- [ ] Nutritional information tracking
- [ ] Recipe sharing between users
- [ ] Recipe import from URLs
- [ ] Mobile app version
- [ ] AI-powered meal suggestions
- [ ] Dietary restriction filters
- [ ] Meal prep scheduling

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Natanel Richey**

- GitHub: [@NatanelRichey](https://github.com/NatanelRichey)
- LinkedIn: [Natanel Richey](https://www.linkedin.com/in/natanelrichey/)
- Email: natanelrichey@gmail.com

## 🙏 Acknowledgments

- Bootstrap for the responsive design framework
- Cloudinary for image hosting
- MongoDB Atlas for database hosting
- Render for application hosting

---

⭐ Star this repo if you find it helpful!


