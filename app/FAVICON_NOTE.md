# Favicon Setup

## Quick Instructions:

### Option 1: Copy existing favicon
Copy `favicon.ico` from your main project folder to here (`app/favicon.ico`)

### Option 2: Use your logo PNG
In `layout.tsx`, change the icon configuration:
```tsx
icons: {
  icon: '/images/meal-creator-logo.png',
}
```

### Option 3: Generate a new favicon
1. Go to https://favicon.io
2. Upload your logo or create text-based icon
3. Download the generated favicon.ico
4. Place it in the `app/` folder

## Current Status:
The app will work without a favicon, you'll just see a default browser icon in the tab.

You can delete this file once you've added your favicon!

