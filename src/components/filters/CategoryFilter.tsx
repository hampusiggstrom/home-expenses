import { Button } from '../ui/button';
import { isExcludedCategory, getCategoryGroup } from '../../lib/expense-utils';
import { CATEGORY_GROUPS, CATEGORY_GROUP_COLORS } from '../../constants/categories';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export function CategoryFilter({ categories, selectedCategories, onCategoriesChange }: CategoryFilterProps) {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const handleSelectAll = () => {
    onCategoriesChange([]);
  };

  const handleSelectGroup = (groupCategories: string[]) => {
    // Get categories from this group that exist in our data
    const groupCatsInData = groupCategories.filter(c => categories.includes(c));
    const allSelected = groupCatsInData.every(c => selectedCategories.includes(c));

    if (allSelected) {
      // Deselect all categories in this group
      onCategoriesChange(selectedCategories.filter(c => !groupCatsInData.includes(c)));
    } else {
      // Select all categories in this group
      const newSelection = new Set([...selectedCategories, ...groupCatsInData]);
      onCategoriesChange(Array.from(newSelection));
    }
  };

  // Filter out excluded categories (like "Betalning")
  const visibleCategories = categories.filter(c => c && c.trim() && !isExcludedCategory(c));

  // Group categories by their group
  const groupedCategories = Object.entries(CATEGORY_GROUPS).map(([groupName, groupCats]) => {
    const categoriesInGroup = visibleCategories.filter(c => getCategoryGroup(c) === groupName);
    return {
      name: groupName,
      categories: categoriesInGroup,
      color: CATEGORY_GROUP_COLORS[groupName],
      allCategories: groupCats,
    };
  }).filter(g => g.categories.length > 0);

  // Find uncategorized (categories not in any group)
  const categorizedSet = new Set(Object.values(CATEGORY_GROUPS).flat());
  const uncategorized = visibleCategories.filter(c => !categorizedSet.has(c));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategories.length === 0 ? 'default' : 'outline'}
          size="sm"
          onClick={handleSelectAll}
          className="text-xs"
        >
          Alla
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {groupedCategories.map(group => {
        const allInGroupSelected = group.categories.every(c => selectedCategories.includes(c));
        const someInGroupSelected = group.categories.some(c => selectedCategories.includes(c));

        return (
          <div key={group.name} className="space-y-1">
            <button
              onClick={() => handleSelectGroup(group.allCategories)}
              className="text-xs font-medium flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: group.color }}
              />
              <span className={someInGroupSelected && !allInGroupSelected ? 'text-muted-foreground' : ''}>
                {group.name}
              </span>
            </button>
            <div className="flex flex-wrap gap-1 pl-4">
              {group.categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryToggle(category)}
                  className="text-xs h-7 px-2"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        );
      })}
      </div>

      {uncategorized.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
            <span>Övrigt</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pl-4">
            {uncategorized.map(category => (
              <Button
                key={category}
                variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryToggle(category)}
                className="text-xs h-7 px-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
