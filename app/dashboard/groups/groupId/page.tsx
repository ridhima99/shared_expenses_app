// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";

// type Group = {
//   id: string;
//   name: string;
//   description: string | null;
//   currency: string;
//   members: {
//     user: {
//       id: string;
//       name: string | null;
//       email: string;
//     };
//   }[];
//   expenses: {
//     id: string;
//     title: string;
//     amount: number;
//     currency: string;
//     date: string;
//     payer: {
//       name: string | null;
//       email: string;
//     };
//   }[];
// };

// export default function GroupDetailsPage() {
//   const params = useParams();
//   const groupId = params.groupId as string;
  
//   const [group, setGroup] = useState<Group | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchGroup = async () => {
//       const res = await fetch(`/api/groups/${groupId}`);
//       const data = await res.json();
//       setGroup(data);
//       setIsLoading(false);
//     };
    
//     fetchGroup();
//   }, [groupId]);

//   if (isLoading) return <div className="p-8 text-center">Loading...</div>;
//   if (!group) return <div className="p-8 text-center">Group not found</div>;

//   return (
//     <div className="min-h-screen bg-background p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-8">
//           <Link href="/dashboard/dashboard" className="text-primary hover:underline">
//             ← Back to Dashboard
//           </Link>
//         </div>

//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
//           {group.description && (
//             <p className="text-muted-foreground">{group.description}</p>
//           )}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <Link
//             href={`/dashboard/groups/${groupId}/members`}
//             className="p-6 border rounded-lg hover:border-primary transition"
//           >
//             <h2 className="text-xl font-semibold mb-2">Members</h2>
//             <p className="text-muted-foreground">{group.members.length} members</p>
//           </Link>

//           <Link
//             href={`/dashboard/groups/${groupId}/expenses`}
//             className="p-6 border rounded-lg hover:border-primary transition"
//           >
//             <h2 className="text-xl font-semibold mb-2">Expenses</h2>
//             <p className="text-muted-foreground">{group.expenses.length} expenses</p>
//           </Link>

//           <Link
//             href={`/dashboard/groups/${groupId}/balances`}
//             className="p-6 border rounded-lg hover:border-primary transition"
//           >
//             <h2 className="text-xl font-semibold mb-2">Balances</h2>
//             <p className="text-muted-foreground">View who owes</p>
//           </Link>
//         </div>

//         <div className="mb-8">
//           <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
//           {group.expenses.length === 0 ? (
//             <p className="text-muted-foreground">No expenses yet</p>
//           ) : (
//             <div className="border rounded-lg">
//               {group.expenses.map((expense) => (
//                 <div key={expense.id} className="p-4 border-t flex justify-between items-center">
//                   <div>
//                     <h3 className="font-medium">{expense.title}</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {new Date(expense.date).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold">
//                       {expense.currency === 'INR' ? '₹' : '$'}{expense.amount}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       Paid by {expense.payer.name || expense.payer.email}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
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

type Group = {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  members: {
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }[];
  expenses: {
    id: string;
    title: string;
    amount: number;
    currency: string;
    date: string;
    payer: {
      name: string | null;
      email: string;
    };
  }[];
};

export default function GroupDetailsPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      const res = await fetch(`/api/groups/${groupId}`);
      const data = await res.json();
      setGroup(data);
      setIsLoading(false);
    };
    
    fetchGroup();
  }, [groupId]);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!group) return <div className="p-8 text-center">Group not found</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard/dashboard" className="text-primary hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
          {group.description && (
            <p className="text-muted-foreground">{group.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href={`/dashboard/groups/${groupId}/members`}
            className="p-6 border rounded-lg hover:border-primary transition"
          >
            <h2 className="text-xl font-semibold mb-2">Members</h2>
            <p className="text-muted-foreground">{group.members.length} members</p>
          </Link>

          <Link
            href={`/dashboard/groups/${groupId}/expenses`}
            className="p-6 border rounded-lg hover:border-primary transition"
          >
            <h2 className="text-xl font-semibold mb-2">Expenses</h2>
            <p className="text-muted-foreground">{group.expenses.length} expenses</p>
          </Link>

          <Link
            href={`/dashboard/groups/${groupId}/balances`}
            className="p-6 border rounded-lg hover:border-primary transition"
          >
            <h2 className="text-xl font-semibold mb-2">Balances</h2>
            <p className="text-muted-foreground">View who owes</p>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
          <ExpenseList expenses={group.expenses} />
        </div>
      </div>
    </div>
  );
}