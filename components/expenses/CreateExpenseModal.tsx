"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateExpenseModal({ groupId, members, currentUserId }: { groupId: string, members: any[], currentUserId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [splitType, setSplitType] = useState("EQUAL");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          title,
          amount: parseFloat(amount),
          currency,
          date: new Date(date).toISOString(),
          paidBy,
          splitType,
          // For EQUAL split, we don't need to pass specific participant amounts yet, 
          // the backend service handles equal distribution automatically among active members.
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create expense");
      }

      setIsOpen(false);
      setTitle("");
      setAmount("");
      router.refresh(); // Reload to show the new expense
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all hover:shadow text-sm"
      >
        + Add Expense
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Add New Expense</h2>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Description</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Dinner at Marina Bites" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Amount</label>
                  <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Who Paid?</label>
                  <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    {members.map(m => (
                      <option key={m.userId} value={m.userId}>{m.user.name || m.user.email}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Split Type</label>
                <select value={splitType} onChange={(e) => setSplitType(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="EQUAL">Equally</option>
                  <option value="PERCENTAGE">By Percentage</option>
                  <option value="SHARE">By Shares</option>
                  <option value="EXACT">Exact Amounts</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors shadow-sm">
                  {isLoading ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}