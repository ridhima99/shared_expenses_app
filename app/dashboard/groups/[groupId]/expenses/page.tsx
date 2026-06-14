// import { notFound } from "next/navigation";
// import { auth } from "@/auth";
// import { groupService } from "@/services/group/groupService";
// import { expenseService } from "@/services/expense/expenseService";
// import Link from "next/link";
// import CreateExpenseModal from "@/components/expenses/CreateExpenseModal";
// import CsvImportButton from "@/components/expenses/CsvImportButton";
// export default async function ExpensesPage({ params }: { params: Promise<{ groupId: string }> }) {
//   const session = await auth();
//   if (!session?.user?.id) return notFound();
  
//   const resolvedParams = await params;
//   const groupId = resolvedParams.groupId;
  
//   try {
//     const group = await groupService.getGroup(groupId, session.user.id);
//     if (!group) return notFound();

//     // Fetch expenses using the backend service
//     const expenses = await expenseService.getExpenses(groupId, session.user.id);
    
//     return (
//       <div className="max-w-5xl mx-auto space-y-8 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
//               <Link href={`/dashboard/groups/${groupId}`} className="hover:text-blue-600 transition-colors">
//                 {group.name}
//               </Link>
//               <span>/</span>
//               <span className="text-slate-800 font-medium">Expenses</span>
//             </div>
//             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Group Expenses</h1>
//           </div>
          
//           {/* This is the modal we just built! */}
//           <CreateExpenseModal 
//             groupId={groupId} 
//             members={group.members} 
//             currentUserId={session.user.id} 
//           />
//         </div>

//         {/* Expenses List */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//           {expenses.length === 0 ? (
//             <div className="p-12 text-center text-slate-500">
//               <p className="text-lg">No expenses recorded yet.</p>
//               <p className="text-sm mt-1">Click the button above to add your first expense!</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-slate-100">
//               {expenses.map((expense) => (
//                 <div key={expense.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
//                   <div className="flex items-center space-x-4">
//                     <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl border border-blue-100">
//                       🧾
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-slate-900 text-lg">{expense.title}</h3>
//                       <p className="text-sm text-slate-500">
//                         Paid by <span className="font-medium text-slate-700">{expense.payer.name || expense.payer.email}</span> • {new Date(expense.date).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="text-right">
//                     <p className="text-xl font-bold text-slate-900">
//                       {expense.currency === 'INR' ? '₹' : '$'}{Number(expense.amount).toFixed(2)}
//                     </p>
//                     <span className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 capitalize">
//                       {expense.splitType.toLowerCase()} Split
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error("Error loading expenses:", error);
//     return notFound();
//   }
// }
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { groupService } from "@/services/group/groupService";
import { expenseService } from "@/services/expense/expenseService";
import Link from "next/link";
import CreateExpenseModal from "@/components/expenses/CreateExpenseModal";
import CsvImportButton from "@/components/expenses/CsvImportButton"; // <-- New Import

export default async function ExpensesPage({ params }: { params: Promise<{ groupId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return notFound();
  
  const resolvedParams = await params;
  const groupId = resolvedParams.groupId;
  
  try {
    const group = await groupService.getGroup(groupId, session.user.id);
    if (!group) return notFound();

    // Fetch expenses using the backend service
    const expenses = await expenseService.getExpenses(groupId, session.user.id);
    
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
              <span className="text-slate-800 font-medium">Expenses</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Group Expenses</h1>
          </div>
          
          {/* --- NEW BUTTON CONTAINER IS HERE --- */}
          <div className="flex items-center space-x-3">
            <CsvImportButton 
              groupId={groupId} 
              currentUserId={session.user.id} 
            />
            <CreateExpenseModal 
              groupId={groupId} 
              members={group.members} 
              currentUserId={session.user.id} 
            />
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {expenses.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg">No expenses recorded yet.</p>
              <p className="text-sm mt-1">Click the button above to add your first expense!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <div key={expense.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl border border-blue-100">
                      🧾
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{expense.title}</h3>
                      <p className="text-sm text-slate-500">
                        Paid by <span className="font-medium text-slate-700">{expense.payer.name || expense.payer.email}</span> • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                      {expense.currency === 'INR' ? '₹' : '$'}{Number(expense.amount).toFixed(2)}
                    </p>
                    <span className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 capitalize">
                      {expense.splitType.toLowerCase()} Split
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading expenses:", error);
    return notFound();
  }
}