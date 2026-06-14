"use client";

import { useRouter } from "next/navigation";

export default function DeleteExpenseButton({ expenseId }: { expenseId: string }) {
  const router = useRouter();

  return (
    <button 
      onClick={async () => {
        if(confirm("Delete this expense?")) {
          await fetch('/api/delete', { 
            method: 'POST', 
            body: JSON.stringify({ type: 'expense', id: expenseId }) 
          });
          router.refresh(); // Refreshes the server component data
        }
      }}
      className="text-red-500 hover:text-red-700 text-sm ml-4 font-medium"
    >
      Delete
    </button>
  );
}