import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { groupService } from "@/services/group/groupService";
import Link from "next/link";

export default async function SettlementsPage({ params }: { params: Promise<{ groupId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return notFound();
  
  const resolvedParams = await params;
  const groupId = resolvedParams.groupId;
  
  const group = await groupService.getGroup(groupId, session.user.id);
  if (!group) return notFound();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center space-x-2 text-sm text-slate-500">
        <Link href={`/dashboard/groups/${groupId}`} className="hover:text-blue-600">
          {group.name}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">Settle Up</span>
      </div>
      
      <h1 className="text-3xl font-extrabold text-slate-900">Settle Up</h1>
      
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
        <p>This is where you'll record payments between members.</p>
        <p className="text-sm mt-2">Coming soon: Payment recording logic!</p>
      </div>
    </div>
  );
}