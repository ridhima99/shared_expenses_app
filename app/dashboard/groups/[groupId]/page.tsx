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