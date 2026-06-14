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
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BalanceTable from "@/components/BalanceTable";

type Balance = {
  userId: string;
  userName: string;
  paid: number;
  owed: number;
  net: number;
};

export default function BalancesPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      const res = await fetch(`/api/balances?groupId=${groupId}`);
      const data = await res.json();
      setBalances(data);
      setIsLoading(false);
    };
    
    fetchBalances();
  }, [groupId]);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={`/dashboard/groups/${groupId}`} className="text-primary hover:underline">
            ← Back to Group
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Balance Summary</h1>
        <BalanceTable balances={balances} />
      </div>
    </div>
  );
}