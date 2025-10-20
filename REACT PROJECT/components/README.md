# Components Directory

This folder contains all reusable React components organized by category.

## 📁 Structure

```
components/
├── ui/                     - Basic UI building blocks
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Modal.tsx
│
├── layout/                 - Layout components
│   ├── Navbar.tsx
│   └── Footer.tsx
│
├── meal/                   - Meal-specific components
│   ├── MealCard.tsx
│   └── MealForm.tsx
│
├── pantry/                 - Pantry-specific components
│   ├── PantryCategory.tsx
│   └── PantryItem.tsx
│
├── shopping-list/          - Shopping list components
│   └── ShoppingListItem.tsx
│
└── FlashAlert.tsx          - Alert/notification component
```

## 🎨 Design System Available

All components have access to:

### Colors (from tailwind.config.ts):
- `bg-meal-green` / `text-meal-green` / `border-meal-green`
- `bg-meal-green-dark` (darker green for hover states)
- `bg-meal-green-light` (semi-transparent green)
- `bg-meal-grey` (button grey)
- `bg-meal-success-bg` / `border-meal-success-border`
- `bg-meal-error-bg` / `border-meal-error-border`

### Fonts:
- `font-athiti` (default body font)
- `font-indie` (shopping list style)
- `font-kalam` (choice buttons, meal text)
- `font-nothing` (logo/brand)

### Backgrounds:
- `bg-pantry`
- `bg-shopping-list`
- `bg-meals`

## ✅ Component Status

All components are **boilerplate only** - ready for you to implement!

Each file includes:
- ✅ TypeScript interfaces
- ✅ Props definitions
- ✅ TODO comments with implementation hints
- ✅ References to old CSS for styling guidance
- ✅ Basic structure

## 🚀 Next Steps

1. Implement each component with Tailwind classes
2. Test components individually
3. Use in pages (Stage 5)

Happy coding! 🎉

