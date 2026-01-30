import { useState, useMemo } from 'react';
import { Layout } from './components/layout/Layout';
import { CsvUploader } from './components/upload/CsvUploader';
import { CsvPreview } from './components/upload/CsvPreview';
import { FilterBar } from './components/filters/FilterBar';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { MonthlyExpenseChart } from './components/charts/MonthlyExpenseChart';
import { CategoryPieChart } from './components/charts/CategoryPieChart';
import { TrendLineChart } from './components/charts/TrendLineChart';
import { ExpenseTable } from './components/tables/ExpenseTable';
import { CategorySummaryTable } from './components/tables/CategorySummaryTable';
import { useExpenses } from './hooks/useExpenses';
import { useFilters } from './hooks/useFilters';
import type { Expense } from './types/expense';
import {
  calculateCategorySummaries,
  calculateMonthlyTotals,
  calculateTotalSpending,
  calculateMonthlyAverage,
  getUniqueCategories,
} from './lib/expense-utils';

function App() {
  const { expenses, importExpenses, clearExpenses, deleteExpense, hasData } = useExpenses();
  const { filters, filteredExpenses, setDateRange, setCategories, setSearchTerm, resetFilters } = useFilters(expenses);
  const [pendingImport, setPendingImport] = useState<Expense[] | null>(null);

  const categories = useMemo(() => getUniqueCategories(expenses), [expenses]);

  const categorySummaries = useMemo(
    () => calculateCategorySummaries(filteredExpenses),
    [filteredExpenses]
  );

  const monthlyTotals = useMemo(
    () => calculateMonthlyTotals(filteredExpenses),
    [filteredExpenses]
  );

  const totalSpending = useMemo(
    () => calculateTotalSpending(filteredExpenses),
    [filteredExpenses]
  );

  const monthlyAverage = useMemo(
    () => calculateMonthlyAverage(filteredExpenses),
    [filteredExpenses]
  );

  const topCategory = useMemo(() => {
    if (categorySummaries.length === 0) return null;
    return { name: categorySummaries[0].category, amount: categorySummaries[0].total };
  }, [categorySummaries]);

  const handleFilesParsed = (parsedExpenses: Expense[]) => {
    setPendingImport(parsedExpenses);
  };

  const handleConfirmImport = () => {
    if (pendingImport) {
      importExpenses(pendingImport);
      setPendingImport(null);
    }
  };

  const handleCancelImport = () => {
    setPendingImport(null);
  };

  return (
    <Layout onClearData={clearExpenses} hasData={hasData}>
      {pendingImport ? (
        <CsvPreview
          expenses={pendingImport}
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
        />
      ) : !hasData ? (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Välkommen till Hemutgifter</h2>
            <p className="text-muted-foreground">
              Ladda upp din Splitwise CSV-export för att visualisera dina utgifter.
            </p>
          </div>
          <CsvUploader onFilesParsed={handleFilesParsed} />
        </div>
      ) : (
        <div className="space-y-6">
          <SummaryCards
            totalSpending={totalSpending}
            monthlyAverage={monthlyAverage}
            topCategory={topCategory}
            expenseCount={filteredExpenses.length}
          />

          <FilterBar
            filters={filters}
            categories={categories}
            onDateRangeChange={setDateRange}
            onCategoriesChange={setCategories}
            onSearchChange={setSearchTerm}
            onReset={resetFilters}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyExpenseChart data={monthlyTotals} />
            <CategoryPieChart data={categorySummaries} />
          </div>

          <TrendLineChart data={monthlyTotals} />

          <CategorySummaryTable summaries={categorySummaries} monthCount={monthlyTotals.length} />
          <ExpenseTable expenses={filteredExpenses} onDeleteExpense={deleteExpense} />

          <div className="pt-4">
            <CsvUploader onFilesParsed={handleFilesParsed} />
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
