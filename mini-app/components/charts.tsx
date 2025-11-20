'use client';
import { useEffect, useState } from 'react';
import { getExpenses } from '@/lib/storage';

export default function Charts() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    setExpenses(getExpenses());
  }, []);

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-semibold mb-2">Spending by Category</h2>
      <ul className="space-y-1">
        {data.map(d => (
          <li key={d.category} className="flex justify-between">
            <span>{d.category}</span>
            <span>${d.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
