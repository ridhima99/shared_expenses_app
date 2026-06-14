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
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import MembersList from "@/components/MembersList";

type Group = {
  id: string;
  name: string;
  members: {
    user: {
      id: string;
      name: string | null;
      email: string;
    };
    joinDate: string;
  }[];
};

export default function MembersPage() {
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={`/dashboard/groups/${groupId}`} className="text-primary hover:underline">
            ← Back to Group
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Members</h1>
        <MembersList groupId={groupId} members={group.members} />
      </div>
    </div>
  );
}