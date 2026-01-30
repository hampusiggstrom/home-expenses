export const SPLITWISE_CATEGORIES = [
  'Uncategorized',
  'Entertainment',
  'Food and drink',
  'Home',
  'Life',
  'Transportation',
  'Utilities',
] as const;

export const SUBCATEGORY_KEYWORDS: Record<string, string[]> = {
  'Groceries': ['ica', 'coop', 'willys', 'lidl', 'hemköp', 'mathem', 'grocery', 'food'],
  'Restaurant': ['restaurant', 'cafe', 'coffee', 'lunch', 'dinner', 'pizza', 'sushi'],
  'Streaming': ['netflix', 'spotify', 'disney', 'hbo', 'youtube', 'apple tv'],
  'Internet': ['bredband', 'internet', 'fiber', 'telia', 'comhem'],
  'Electricity': ['el', 'electricity', 'power', 'vattenfall', 'fortum'],
  'Phone': ['telefon', 'phone', 'mobile', 'tele2', 'tre', 'telenor'],
  'Insurance': ['insurance', 'försäkring', 'trygg', 'if', 'folksam'],
  'Rent': ['hyra', 'rent', 'boende'],
  'Gas': ['bensin', 'gas', 'fuel', 'tank'],
  'Public Transport': ['sl', 'metro', 'bus', 'train', 'tåg', 'buss', 'pendel'],
};

export const CATEGORY_COLORS: Record<string, string> = {
  'Uncategorized': '#94a3b8',
  'Entertainment': '#a855f7',
  'Food and drink': '#22c55e',
  'Home': '#3b82f6',
  'Life': '#ec4899',
  'Transportation': '#f97316',
  'Utilities': '#06b6d4',
};

// Categories to exclude from expense calculations (paybacks, not actual expenses)
export const EXCLUDED_CATEGORIES = ['Betalning'] as const;

// Swedish category groups with their associated Splitwise categories
export const CATEGORY_GROUPS: Record<string, string[]> = {
  'Boende': [
    'Elektricitet',
    'Vatten',
    'Försäkringar',
    'Avfall',
    'Skötsel/underhåll',
    'Hem - Övrigt',
    'Möbler',
    'Verktyg - Övrigt',
  ],
  'Mat & Dryck': ['Livsmedel', 'Restaurangbesök', 'Alkohol'],
  'Transport': ['Bensin/bränsle', 'Bil', 'Buss/tåg', 'Parkering'],
  'Semester': ['Flyg', 'Hotell'],
  'Underhållning': ['Filmer', 'TV/telefon/internet', 'Underhållning - Övrigt', 'Sport'],
  'Barn & Familj': ['Barnomsorg', 'Presenter'],
  'Hälsa': ['Sjukvård/medicin'],
  'Husdjur': ['Husdjur'],
  'Ekonomi': ['Avbetalning/Amortering'],
  'Övrigt': ['Allmänt', 'Elektronik', 'Förbrukningsvaror', 'Livet - Övrigt', 'Tjänster'],
};

// Colors for category groups
export const CATEGORY_GROUP_COLORS: Record<string, string> = {
  'Boende': '#3b82f6',
  'Mat & Dryck': '#22c55e',
  'Transport': '#f97316',
  'Semester': '#0ea5e9',
  'Underhållning': '#a855f7',
  'Barn & Familj': '#ec4899',
  'Hälsa': '#ef4444',
  'Husdjur': '#84cc16',
  'Ekonomi': '#6366f1',
  'Övrigt': '#64748b',
};

// Create reverse lookup: category -> group
export const CATEGORY_TO_GROUP: Record<string, string> = Object.entries(CATEGORY_GROUPS).reduce(
  (acc, [group, categories]) => {
    categories.forEach(category => {
      acc[category] = group;
    });
    return acc;
  },
  {} as Record<string, string>
);
