// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { useForm } from "react-hook-form";

// type Expense = {
//   id: string;
//   title: string;
//   description: string | null;
//   amount: number;
//   currency: string;
//   date: string;
//   splitType: string;
//   payer: {
//     name: string | null;
//     email: string;
//   };
//   participants: {
//     user: {
//       name: string | null;
//       email: string;
//     };
//     amount: number;
//   }[];
// };

// type FormData = {
//   title: string;
//   description: string;
//   amount: string;
//   currency: string;
//   date: string;
//   paidBy: string;
//   splitType: string;
// };

// export default function ExpensesPage() {
//   const params = useParams();
//   const groupId = params.groupId as string;
  
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const { register, handleSubmit } = useForm<FormData>();

//   useEffect(() => {
//     fetchExpenses();
//   }, [groupId]);

//   const fetchExpenses = async () => {
//     const sessionRes = await fetch("/api/auth/session");
//     const session = await sessionRes.json();
    
//     const res = await fetch(`/api/expenses?groupId=${groupId}&userId=${session.user.id}`);
//     const data = await res.json();
//     setExpenses(data);
//     setIsLoading(false);
//   };

//   const onCreateExpense = async (data: FormData) => {
//     const sessionRes = await fetch("/api/auth/session");
//     const session = await sessionRes.json();
    
//     const res = await fetch("/api/expenses", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         groupId,
//         title: data.title,
//         description: data.description,
//         amount: parseFloat(data.amount),
//         currency: data.currency,
//         date: data.date,
//         paidBy: session.user.id,
//         splitType: data.splitType,
//       }),
//     });
    
//     if (res.ok) {
//       setShowForm(false);
//       fetchExpenses();
//     }
//   };

//   if (isLoading) return <div className="p-8 text-center">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-background p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-8">
//           <Link href={`/dashboard/groups/${groupId}`} className="text-primary hover:underline">
//             ← Back to Group
//           </Link>
//         </div>

//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">Expenses</h1>
//           <button
//             onClick={() => setShowForm(true)}
//             className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
//           >
//             Add Expense
//           </button>
//         </div>

//         {showForm && (
//           <div className="mb-8 p-6 border rounded-lg">
//             <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
//             <form onSubmit={handleSubmit(onCreateExpense)} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Title</label>
//                 <input
//                   type="text"
//                   {...register("title", { required: true })}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Description</label>
//                 <input
//                   type="text"
//                   {...register("description")}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Amount</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     {...register("amount", { required: true })}
//                     className="w-full px-3 py-2 border rounded-lg"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Currency</label>
//                   <select
//                     {...register("currency")}
//                     className="w-full px-3 py-2 border rounded-lg"
//                   >
//                     <option value="INR">INR</option>
//                     <option value="USD">USD</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Date</label>
//                 <input
//                   type="date"
//                   {...register("date", { required: true })}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Split Type</label>
//                 <select
//                   {...register("splitType")}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 >
//                   <option value="EQUAL">Equal Split</option>
//                   <option value="PERCENTAGE">Percentage Split</option>
//                   <option value="SHARE">Share Split</option>
//                   <option value="EXACT">Exact Amount</option>
//                 </select>
//               </div>

//               <div className="flex gap-4">
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
//                 >
//                   Add Expense
//                 </button>
//                 <button
//                   onClick={() => setShowForm(false)}
//                   className="px-4 py-2 bg-secondary rounded-lg"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         <div className="border rounded-lg">
//           {expenses.length === 0 ? (
//             <div className="p-8 text-center text-muted-foreground">No expenses yet</div>
//           ) : (
//             expenses.map((expense) => (
//               <div key={expense.id} className="p-4 border-t">
//                 <div className="flex justify-between items-start mb-2">
//                   <h3 className="font-semibold">{expense.title}</h3>
//                   <p className="font-semibold">
//                     {expense.currency === 'INR' ? '₹' : '$'}{expense.amount}
//                   </p>
//                 </div>
//                 {expense.description && (
//                   <p className="text-sm text-muted-foreground mb-2">{expense.description}</p>
//                 )}
//                 <div className="flex justify-between text-sm text-muted-foreground">
//                   <span>{new Date(expense.date).toLocaleDateString()}</span>
//                   <span>Split: {expense.splitType}</span>
//                 </div>
//                 <div className="text-sm mt-2">
//                   <span className="text-muted-foreground">Paid by </span>
//                   <span className="font-medium">{expense.payer.name || expense.payer.email}</span>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ExpenseList from "@/components/ExpenseList";
import CreateExpenseForm from "@/components/CreateExpenseForm";

type Expense = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  date: string;
  splitType: string;
  payer: {
    name: string | null;
    email: string;
  };
  participants: {
    user: {
      name: string | null;
      email: string;
    };
    amount: number;
  }[];
};

export default function ExpensesPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [groupId]);

  const fetchExpenses = async () => {
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    
    const res = await fetch(`/api/expenses?groupId=${groupId}&userId=${session.user.id}`);
    const data = await res.json();
    setExpenses(data);
    setIsLoading(false);
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href={`/dashboard/groups/${groupId}`} className="text-primary hover:underline">
            ← Back to Group
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Add Expense
          </button>
        </div>

        {showForm && (
          <CreateExpenseForm groupId={groupId} onSuccess={() => { setShowForm(false); fetchExpenses(); }} />
        )}

        <ExpenseList expenses={expenses} />
      </div>
    </div>
  );
}