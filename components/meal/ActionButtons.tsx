interface ActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
}

export function ActionButtons({ onCancel, onSubmit, onDelete, isSubmitting = false }: ActionButtonsProps) {
  return (
    <div className="w-full flex justify-center gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-gray-100 border-2 border-gray-300 text-gray-700 text-base sm:text-lg md:text-xl font-athiti rounded-lg hover:bg-gray-200 transition-colors min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
      >
        Cancel
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-red-500 text-white text-base sm:text-lg md:text-xl font-athiti rounded-lg hover:bg-red-600 transition-colors min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
        >
          Delete
        </button>
      )}
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-meal-green-light text-black text-base sm:text-lg md:text-xl font-athiti rounded-lg hover:bg-meal-green-hover transition-colors min-w-[100px] sm:min-w-[120px] md:min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving...' : 'Done'}
      </button>
    </div>
  );
}
