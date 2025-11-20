'use client';
import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '@/lib/storage';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    setExpenses(getExpenses());
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const filterByDate = (start: string, end: string) =>
    expenses.filter(e => e.date >= start && e.date <= end);

  const totalToday = filterByDate(today, today).reduce((sum, e) => sum + e.amount, 0);
  const totalWeek = filterByDate(weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0]).reduce((sum, e) => sum + e.amount, 0);
  const totalMonth = expenses.reduce((sum, e) => sum + e.amount, 0);

  const topCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  const topCat = Object.entries(topCategory).reduce((a, b) => (b[1] > a[1] ? b : a), ['', 0]);

  return (
    <div className="w-full max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div>Total Today: ${totalToday.toFixed(2)}</div>
      <div>Total This Week: ${totalWeek.toFixed(2)}</div>
      <div>Total This Month: ${totalMonth.toFixed(2)}</div>
      <div>Top Category: {topCat[0]} (${topCat[1].toFixed(2)})</div>
      <h3 className="text-lg font-semibold mt-4">Expenses</h3>
      <ul className="space-y-2">
        {expenses.map(e => (
          <li key={e.id} className="flex justify-between items-center border p-2 rounded">
            <div>
              <div>{e.category} - ${e.amount.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">{e.date}</div>
            </div>
            <button onClick={() => { deleteExpense(e.id); setExpenses(getExpenses()); }} className="text-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
