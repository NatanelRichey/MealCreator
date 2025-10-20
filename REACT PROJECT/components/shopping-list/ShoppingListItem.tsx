'use client';

import type { ShoppingListItem as ShoppingListItemType } from '@/lib/types';

interface ShoppingListItemProps {
  item: ShoppingListItemType;
  onToggleCheck: (id: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function ShoppingListItem({ 
  item, 
  onToggleCheck, 
  onUpdate, 
  onDelete 
}: ShoppingListItemProps) {
  // TODO: Implement shopping list item
  // Reference: public/css/tablet.css lines 359-378
  // 
  // Features:
  // - Checkbox (checked/unchecked icons)
  // - Editable item name
  // - Delete button
  // - Different styling when checked
  
  return (
    <div className="list-item-bar">
      {/* Checkbox */}
      <button
        onClick={() => onToggleCheck(item._id!)}
        className={item.checked ? 'list-check' : 'list-uncheck'}
      >
        {/* Check icon */}
      </button>

      {/* Item name */}
      <input
        type="text"
        value={item.name}
        className="item-edit"
      />

      {/* Delete button */}
      <button onClick={() => onDelete(item._id!)}>
        {/* Delete icon */}
      </button>
    </div>
  );
}

