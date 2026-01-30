# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (Vite)
- `npm run build` - TypeScript check + production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture

Home Expenses is a React app for visualizing Splitwise CSV exports. Data is stored in localStorage.

### Data Flow

1. **CSV Import** (`src/lib/csv-parser.ts`) - Parses Splitwise exports (Swedish/English), extracts person shares, infers subcategories from description keywords
2. **Storage** (`src/hooks/useExpenses.ts` + `useLocalStorage.ts`) - Persists expenses to localStorage, converts Date objects to ISO strings for storage
3. **Filtering** (`src/hooks/useFilters.ts`) - Date range, category, and search filtering
4. **Visualization** - Charts (Recharts), tables, and summary cards

### Key Types (`src/types/expense.ts`)

- `Expense` - Core expense with date, description, category, cost, currency, and person shares
- `StoredExpense` - Same as Expense but with ISO date string for localStorage
- `FilterState` - Active filters (dateRange, categories, searchTerm)

### Category System (`src/constants/categories.ts`)

- Swedish Splitwise categories are grouped into broader Swedish groups (Boende, Mat & Dryck, Transport, etc.)
- `EXCLUDED_CATEGORIES` - Categories like "Betalning" (paybacks) excluded from calculations
- `CATEGORY_TO_GROUP` - Reverse lookup from individual category to group

### Component Structure

- `src/components/ui/` - Reusable primitives (Button, Card, Input)
- `src/components/charts/` - Recharts-based visualizations
- `src/components/filters/` - Filter controls (CategoryFilter groups categories visually)
- `src/components/tables/` - Data tables
- `src/components/upload/` - CSV upload and preview

### Styling

Tailwind CSS v4 with custom theme variables in `src/index.css`. Uses shadcn/ui-style components.
