# MealCreator - Next.js Edition

A modern meal planning and pantry management application built with Next.js, React, TypeScript, and MongoDB.

## 🚀 Features

- **Meal Management** - Create, edit, and organize your recipes
- **Smart Pantry** - Track ingredients and what's in stock
- **Shopping List** - Automatically generate shopping lists
- **Meal Selector** - Find meals based on available ingredients
- **Image Upload** - Upload meal photos via Cloudinary
- **Instant UI Updates** - React Query for lightning-fast performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Mongoose)
- **Image Storage**: Cloudinary
- **Performance**: React Query (TanStack Query) for caching and optimistic updates
- **Deployment**: Vercel

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (MongoDB Atlas recommended)
- Cloudinary account for image uploads

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mealcreator.git
   cd mealcreator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   DB_URL=your_mongodb_connection_string
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_api_key
   CLOUDINARY_SECRET=your_api_secret
   
   # Next.js (optional)
   NEXT_PUBLIC_API_URL=
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_URL` | MongoDB connection string | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_SECRET` | Cloudinary API secret | Yes |
| `NEXT_PUBLIC_API_URL` | Base URL for API calls (optional) | No |

**Note**: Never commit `.env.local` to git! It's already in `.gitignore`.

## 🚀 Deployment to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Add environment variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local` file
   - Deploy again to apply changes

## 📁 Project Structure

```
mealcreator/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── meals/             # Meals pages
│   ├── pantry/            # Pantry page
│   ├── shopping-list/     # Shopping list page
│   └── login/             # Authentication
├── components/            # React components
│   ├── meal/             # Meal-related components
│   ├── pantry/           # Pantry components
│   ├── shopping/         # Shopping list components
│   ├── auth/             # Authentication components
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities and libraries
│   ├── hooks/            # Custom React hooks (React Query)
│   ├── models/           # Mongoose models
│   ├── api.ts            # API client functions
│   ├── db.ts             # Database connection
│   └── types.ts          # TypeScript types
├── public/               # Static assets
└── old-express-backup/   # Legacy Express.js code (archived)
```

## ⚡ Performance Optimizations

This app uses **React Query** for:
- **Smart Caching** - Data cached for 5 minutes, instant page loads
- **Optimistic Updates** - UI updates immediately, no waiting
- **Automatic Rollback** - Reverts changes if server fails
- **Background Sync** - Server updates happen in background

See [PERFORMANCE_OPTIMIZATIONS.md](PERFORMANCE_OPTIMIZATIONS.md) for details.

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (port 3001)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📚 Documentation

- [Performance Optimizations](PERFORMANCE_OPTIMIZATIONS.md)
- [React Modernization Guide](REACT_MODERNIZATION_GUIDE.md)
- [Development Order](DEVELOPMENT_ORDER.md)
- [Testing Guide](TESTING_GUIDE.md)

## 🎯 Features in Detail

### Meal Management
- Create and edit recipes with ingredients, instructions, and images
- Tag meals with categories (healthy, comfort food, quick meals, etc.)
- Search and filter meals
- Upload meal photos to Cloudinary

### Smart Pantry
- Track ingredients by category
- Mark items as in stock or save for later
- Move items to shopping list
- Instant updates with optimistic UI

### Shopping List
- Organized by food categories
- Move items directly to pantry when purchased
- Add/edit/delete items instantly

### Meal Selector
- Find meals based on available ingredients
- Filter by meal type and preferences
- "Surprise Me" feature for random meal suggestions

## 🐛 Troubleshooting

### Server won't start
- Ensure `.env.local` exists with all required variables
- Check MongoDB connection string is correct
- Try deleting `.next` folder and rebuilding: `rm -rf .next && npm run dev`

### Database connection errors
- Verify MongoDB connection string
- Ensure your IP is whitelisted in MongoDB Atlas
- Check MongoDB cluster is running

### Images not uploading
- Verify Cloudinary credentials in `.env.local`
- Check Cloudinary account has sufficient storage

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this project for learning or personal use.

## 👨‍💻 Author

Built with ❤️ by Natanel Richey

---

**Note**: The old Express.js version of this app is archived in `old-express-backup.zip`.
