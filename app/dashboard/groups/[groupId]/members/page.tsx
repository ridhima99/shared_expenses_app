// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";

// type Member = {
//   user: {
//     id: string;
//     name: string | null;
//     email: string;
//   };
//   joinDate: string;
//   leaveDate: string | null;
// };

// type Group = {
//   id: string;
//   name: string;
//   members: Member[];
// };

// export default function MembersPage() {
//   const params = useParams();
//   const groupId = params.groupId as string;
  
//   const [group, setGroup] = useState<Group | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchEmail, setSearchEmail] = useState("");
//   const [users, setUsers] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchGroup = async () => {
//       const res = await fetch(`/api/groups/${groupId}`);
//       const data = await res.json();
//       setGroup(data);
//       setIsLoading(false);
//     };
    
//     fetchGroup();
//   }, [groupId]);

//   const searchUsers = async () => {
//     if (!searchEmail) return;
    
//     const res = await fetch(`/api/users?email=${searchEmail}`);
//     const data = await res.json();
//     setUsers(data);
//   };

//   const inviteMember = async (userId: string) => {
//     const res = await fetch(`/api/groups/members`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ groupId, userId }),
//     });
    
//     if (res.ok) {
//       setUsers([]);
//       setSearchEmail("");
//       const updatedGroup = await fetch(`/api/groups/${groupId}`).then(r => r.json());
//       setGroup(updatedGroup);
//     }
//   };

//   if (isLoading) return <div className="p-8 text-center">Loading...</div>;
//   if (!group) return <div className="p-8 text-center">Group not found</div>;

//   return (
//     <div className="min-h-screen bg-background p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-8">
//           <Link href={`/dashboard/groups/${groupId}`} className="text-primary hover:underline">
//             ← Back to Group
//           </Link>
//         </div>

//         <h1 className="text-3xl font-bold mb-6">Members</h1>

//         <div className="mb-8">
//           <h2 className="text-xl font-semibold mb-4">Active Members</h2>
//           <div className="border rounded-lg">
//             {group.members.map((member) => (
//               <div key={member.user.id} className="p-4 border-t flex justify-between items-center">
//                 <div>
//                   <p className="font-medium">{member.user.name || member.user.email}</p>
//                   <p className="text-sm text-muted-foreground">
//                     Joined: {new Date(member.joinDate).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mb-8">
//           <h2 className="text-xl font-semibold mb-4">Invite Member</h2>
//           <div className="flex gap-4">
//             <input
//               type="email"
//               value={searchEmail}
//               onChange={(e) => setSearchEmail(e.target.value)}
//               placeholder="Enter email to search"
//               className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//             <button
//               onClick={searchUsers}
//               className="px-4 py-2 bg-secondary rounded-lg font-medium hover:bg-secondary/90 transition"
//             >
//               Search
//             </button>
//           </div>

//           {users.length > 0 && (
//             <div className="mt-4 border rounded-lg">
//               {users.map((user) => (
//                 <div key={user.id} className="p-4 border-t flex justify-between items-center">
//                   <p>{user.name || user.email}</p>
//                   <button
//                     onClick={() => inviteMember(user.id)}
//                     className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition"
//                   >
//                     Invite
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import MembersList from "@/components/MembersList";

// type Group = {
//   id: string;
//   name: string;
//   members: {
//     user: {
//       id: string;
//       name: string | null;
//       email: string;
//     };
//     joinDate: string;
//   }[];
// };

// export default function MembersPage() {
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
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-8">
//           <Link href={`/dashboard/groups/${groupId}`} className="text-primary hover:underline">
//             ← Back to Group
//           </Link>
//         </div>

//         <h1 className="text-3xl font-bold mb-6">Members</h1>
//         <MembersList groupId={groupId} members={group.members} />
//       </div>
//     </div>
//   );
// }
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { groupService } from "@/services/group/groupService";
import Link from "next/link";
import InviteMemberButton from "@/components/groups/InviteMemberButton";

export default async function MembersPage({ params }: { params: Promise<{ groupId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return notFound();
  
  const resolvedParams = await params;
  const groupId = resolvedParams.groupId;
  
  try {
    const group = await groupService.getGroup(groupId, session.user.id);
    if (!group) return notFound();
    
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
              <span className="text-slate-800 font-medium">Members</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Group Members</h1>
          </div>
          
          {/* THE NEW BUTTON COMPONENT */}
          <InviteMemberButton groupId={groupId} />
        </div>

        {/* Members List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-slate-100">
            {group.members.map((member) => (
              <div key={member.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg border border-blue-200">
                    {member.user.name?.charAt(0).toUpperCase() || member.user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {member.user.name || "Unnamed User"}
                      {member.user.id === session.user.id && (
                        <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">You</span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-500">{member.user.email}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    Joined {new Date(member.joinDate).toLocaleDateString()}
                  </p>
                  {member.leaveDate ? (
                    <span className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Left {new Date(member.leaveDate).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading members:", error);
    return notFound();
  }
}