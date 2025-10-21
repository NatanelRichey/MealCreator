import { CldImage } from 'next-cloudinary';

interface TagSelectionProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const TAG_GROUPS = [
  {
    title: "Health",
    tags: ['healthy', 'regular']
  },
  {
    title: "Meal Time", 
    tags: ['breakfast', 'lunch', 'dinner']
  },
  {
    title: "Dietary",
    tags: ['dairy', 'parve', 'meaty']
  }
];

export function TagSelection({ selectedTags, onTagToggle }: TagSelectionProps) {
  const getIconName = (tag: string) => {
    if (tag === 'dairy') return 'milk';
    if (tag === 'meaty') return 'meat';
    return tag;
  };

  return (
    <div className="w-full mb-1 sm:mb-2 lg:mb-8 mt-2 sm:mt-4 lg:mt-20">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-athiti text-gray-800 mb-2 sm:mb-2 lg:mb-6 text-center">Tags</h3>
      
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full">
        {TAG_GROUPS.map((group, groupIndex) => (
          <div key={group.title} className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {group.tags.map((tag, tagIndex) => {
              const isSelected = selectedTags.includes(tag);
              const iconName = getIconName(tag);
              
              return (
                <div key={tag} className="flex flex-col items-center min-w-[50px] sm:min-w-[60px]">
                  <button
                    type="button"
                    onClick={() => onTagToggle(tag)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 p-0 border-2 rounded-lg bg-white transition-all duration-200 ${
                      isSelected 
                        ? 'border-meal-green-light' 
                        : 'border-gray-300 hover:border-meal-green-light'
                    }`}
                  >
                    <CldImage 
                      src={`icons/${iconName}`}
                      alt={tag}
                      width={32}
                      height={32}
                      quality="auto"
                      format="auto"
                      className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto ${!isSelected ? 'grayscale opacity-60' : ''}`}
                    />
                  </button>
                  <span className="hidden md:inline text-[10px] sm:text-xs font-athiti text-gray-700 mt-1 capitalize text-center">
                    {tag}
                  </span>
                </div>
              );
            })}
            
            {/* Add divider between groups (except for the last group) - hidden on small screens */}
            {groupIndex < TAG_GROUPS.length - 1 && (
              <div className="hidden md:block w-px h-12 bg-gray-300 mx-2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
