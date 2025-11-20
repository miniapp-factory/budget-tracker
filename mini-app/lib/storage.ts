export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO string
  note?: string;
};

const STORAGE_KEY = 'expenses';

export function getExpenses(): Expense[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveExpenses(expenses: Expense[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function addExpense(expense: Omit<Expense, 'id'>) {
  const expenses = getExpenses();
  const newExpense: Expense = { ...expense, id: Date.now().toString() };
  expenses.push(newExpense);
  saveExpenses(expenses);
}

export function deleteExpense(id: string) {
  const expenses = getExpenses().filter(e => e.id !== id);
  saveExpenses(expenses);
}

export function updateExpense(updated: Expense) {
  const expenses = getExpenses().map(e => e.id === updated.id ? updated : e);
  saveExpenses(expenses);
}
