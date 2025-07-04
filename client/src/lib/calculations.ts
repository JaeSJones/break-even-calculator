interface CalculationData {
  workDays: number;
  expenses: Record<string, number>;
  totalMonthly: number;
  dailyBreakEven: number;
}

export function calculateBreakEven(expenses: Record<string, number>, workDays: number): CalculationData {
  const totalMonthly = Object.values(expenses).reduce((sum, amount) => sum + amount, 0);
  const workDaysPerMonth = workDays * 4.33; // Average weeks per month
  const dailyBreakEven = totalMonthly / workDaysPerMonth;

  return {
    workDays,
    expenses,
    totalMonthly,
    dailyBreakEven,
  };
}

export function validateInputs(expenses: Record<string, number>): boolean {
  const totalExpenses = Object.values(expenses).reduce((sum, amount) => sum + amount, 0);
  return totalExpenses > 0;
}
