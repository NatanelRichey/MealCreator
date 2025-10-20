# MealCreator - Next.js Frontend

A modern React/Next.js frontend for the MealCreator meal planning and pantry management application.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Your existing MealCreator Node.js backend running on port 3000 (or update `.env.local`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Update `.env.local` with your backend API URL if different from `http://localhost:3000`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

> Note: The Next.js app will run on port 3001 by default to avoid conflicts with your existing backend on port 3000. You can change this by running `npm run dev -- -p <port>`

## Project Structure

```
REACT PROJECT/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
├── lib/             # Utilities, types, and helpers
│   ├── types.ts     # TypeScript type definitions
│   └── data.ts      # Constants and helper functions
├── public/          # Static assets (images, etc.)
└── ...config files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Development Progress

See [DEVELOPMENT_ORDER.md](./DEVELOPMENT_ORDER.md) for the complete development roadmap.

**Current Status:**
- [x] Stage 0: Foundation (lib/ folder)
- [x] Stage 1: Next.js configuration
- [ ] Stage 2: Basic app structure
- [ ] Stage 3: Reusable components
- [ ] Stage 4: API communication
- [ ] Stage 5: Pages & routes
- [ ] Stage 6: Advanced features

## Backend Integration

This frontend connects to your existing Node.js/Express backend. Make sure your backend:
- Is running on the port specified in `.env.local`
- Has CORS enabled for the Next.js frontend URL
- Handles session/authentication properly

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4
- **State Management:** React hooks (to be expanded)
- **API Communication:** Fetch API / Axios (to be implemented)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

