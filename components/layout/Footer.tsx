export function Footer() {
  // Simple footer matching MealCreator's minimal design
  // Your old app didn't have a footer, so keeping it clean and simple
  
  return (
    <footer className="bg-meal-grey text-white py-4 text-center text-sm mt-auto">
      <p>&copy; {new Date().getFullYear()} MealCreator</p>
    </footer>
  );
}

