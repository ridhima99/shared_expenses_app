// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";

// type Balance = {
//   userId: string;
//   userName: string;
//   paid: number;
//   owed: number;
//   net: number;
// };

// export default function BalancesPage() {
//   const params = useParams();
//   const groupId = params.groupId as string;
  
//   const [balances, setBalances] = useState<Balance[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchBalances = async () => {
//       const res = await fetch(`/api/balances?groupId=${groupId}`);
//       const data = await res.json();
//       setBalances(data);
//       setIsLoading(false);
//     };
    
//     fetchBalances();
//   }, [groupId]);

//   if (isLoading) return <div className="p-8 text-center">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-background p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-8">
//           <Link href={`/dashboard/groups/${groupId}`} className="text-primary hover:underline">
//             ← Back to Group
//           </Link>
//         </div>

//         <h1 className="text-3xl font-bold mb-6">Balance Summary</h1>

//         <div className="border rounded-lg">
//           <table className="w-full">
//             <thead className="bg-secondary">
//               <tr>
//                 <th className="p-4 text-left">Member</th>
//                 <th className="p-4 text-right">Paid</th>
//                 <th className="p-4 text-right">Owes</th>
//                 <th className="p-4 text-right">Net</th>
//               </tr>
//             </thead>
//             <tbody>
//               {balances.map((balance) => (
//                 <tr key={balance.userId} className="border-t">
//                   <td className="p-4">{balance.userName}</td>
//                   <td className="p-4 text-right">{balance.paid}</td>
//                   <td className="p-4 text-right">{balance.owed}</td>
//                   <td className="p-4 text-right font-semibold">
//                     {balance.net > 0 ? '+' : ''}{balance.net}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import BalanceTable from "@/components/BalanceTable";

// type Balance = {
//   userId: string;
//   userName: string;
//   paid: number;
//   owed: number;
//   net: number;
// };

// export default function BalancesPage() {
//   const params = useParams();
//   const groupId = params.groupId as string;
  
//   const [balances, setBalances] = useState<Balance[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchBalances = async () => {
//       const res = await fetch(`/api/balances?groupId=${groupId}`);
//       const data = await res.json();
//       setBalances(data);
//       setIsLoading(false);
//     };
    
//     fetchBalances();
//   }, [groupId]);

//   if (isLoading) return <div className="p-8 text-center">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-background p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-8">
//           <Link href={`/dashboard/groups/${groupId}`} className="text-primary hover:underline">
//             ← Back to Group
//           </Link>
//         </div>

//         <h1 className="text-3xl font-bold mb-6">Balance Summary</h1>
//         <BalanceTable balances={balances} />
//       </div>
//     </div>
//   );
// }
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { groupService } from "@/services/group/groupService";
import { balanceService } from "@/services/balance/balanceService";
import Link from "next/link";

export default async function BalancesPage({ params }: { params: Promise<{ groupId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return notFound();
  
  const resolvedParams = await params;
  const groupId = resolvedParams.groupId;
  
  try {
    const group = await groupService.getGroup(groupId, session.user.id);
    if (!group) return notFound();

    // The core Accounting Engine!
    const balances = await balanceService.calculateGroupBalances(groupId);
    
    return (
      <div className="max-w-5xl mx-auto space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
              <Link href={`/dashboard/groups/${groupId}`} className="hover:text-blue-600 transition-colors">
                {group.name}
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-medium">Balances</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Group Balances</h1>
          </div>
        </div>

        {/* Balances List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {balances.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg">No balances to calculate yet.</p>
              <p className="text-sm mt-1">Add some expenses first!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {balances.map((balance) => {
                
                // --- THE FIX IS HERE ---
                // We convert Prisma's Decimal object into standard numbers
                const netAmount = Number(balance.net);
                const paidAmount = Number(balance.paid);
                
                const isPositive = netAmount > 0;
                const isNegative = netAmount < 0;
                const isNeutral = netAmount === 0;

                return (
                  <div key={balance.userId} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg border border-slate-200">
                        {balance.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">
                          {balance.userName}
                          {balance.userId === session.user.id && (
                            <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">You</span>
                          )}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Total Paid: {group.currency === 'INR' ? '₹' : '$'}{paidAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        isPositive ? 'text-emerald-600' : 
                        isNegative ? 'text-red-600' : 'text-slate-500'
                      }`}>
                        {isPositive ? '+' : ''}{group.currency === 'INR' ? '₹' : '$'}{Math.abs(netAmount).toFixed(2)}
                      </p>
                      <span className="text-xs font-medium text-slate-500">
                        {isPositive ? 'gets back' : isNegative ? 'owes' : 'settled up'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading balances:", error);
    return notFound();
  }
}