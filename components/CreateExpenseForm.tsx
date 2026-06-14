"use client";

import { useState } from "react";

type ExpenseFormData = {
  title: string;
  description: string;
  amount: string;
  currency: string;
  date: string;
  splitType: string;
};

export default function CreateExpenseForm({
  groupId,
  onSuccess,
}: {
  groupId: string;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: "",
    description: "",
    amount: "",
    currency: "INR",
    date: new Date().toISOString().split("T")[0],
    splitType: "EQUAL",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          title: formData.title,
          description: formData.description,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          date: formData.date,
          paidBy: session.user.id,
          splitType: formData.splitType,
        }),
      });
      
      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Split Type</label>
          <select
            value={formData.splitType}
            onChange={(e) => setFormData({ ...formData, splitType: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="EQUAL">Equal Split</option>
            <option value="PERCENTAGE">Percentage Split</option>
            <option value="SHARE">Share Split</option>
            <option value="EXACT">Exact Amount</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            {isLoading ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}