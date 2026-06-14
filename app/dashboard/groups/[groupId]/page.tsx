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
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { groupService } from "@/services/group/groupService";
import Link from "next/link";

// In Next.js 15, params is a Promise, so we must await it
export default async function GroupDetailsPage({ params }: { params: Promise<{ groupId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return notFound();
  
  const resolvedParams = await params;
  const groupId = resolvedParams.groupId;
  
  try {
    const group = await groupService.getGroup(groupId, session.user.id);
    if (!group) return notFound();
    
    return (
      <div className="max-w-5xl mx-auto space-y-8 p-6">
         {/* Beautiful Header Card */}
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
               <div>
                 <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{group.name}</h1>
                 {group.description ? (
                    <p className="text-slate-500 mt-3 text-lg">{group.description}</p>
                 ) : (
                    <p className="text-slate-400 mt-3 italic text-sm">No description provided.</p>
                 )}
               </div>
               <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                 {group.currency}
               </span>
            </div>
         </div>

         {/* Navigation Cards Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href={`/dashboard/groups/${groupId}/expenses`} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all group flex flex-col items-center text-center cursor-pointer">
               <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">💸</div>
               <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600">Expenses</h3>
               <p className="text-sm text-slate-500 mt-2">View and add</p>
            </Link>

            <Link href={`/dashboard/groups/${groupId}/balances`} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all group flex flex-col items-center text-center cursor-pointer">
               <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">⚖️</div>
               <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600">Balances</h3>
               <p className="text-sm text-slate-500 mt-2">Who owes whom</p>
            </Link>

            <Link href={`/dashboard/groups/${groupId}/settlements`} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all group flex flex-col items-center text-center cursor-pointer">
               <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🤝</div>
               <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600">Settle Up</h3>
               <p className="text-sm text-slate-500 mt-2">Record payments</p>
            </Link>

            <Link href={`/dashboard/groups/${groupId}/members`} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all group flex flex-col items-center text-center cursor-pointer">
               <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">👥</div>
               <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600">Members</h3>
               <p className="text-sm text-slate-500 mt-2">Manage flatmates</p>
            </Link>
         </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading group:", error);
    return notFound();
  }
}