// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// type FormData = {
//   name: string;
//   description: string;
//   currency: string;
// };

// export default function GroupsPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const { register, handleSubmit } = useForm<FormData>();

//   const onSubmit = async (data: FormData) => {
//     setIsLoading(true);
    
//     try {
//       const res = await fetch("/api/groups", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: data.name,
//           description: data.description,
//           currency: data.currency,
//         }),
//       });
      
//       if (res.ok) {
//         const group = await res.json();
//         router.push(`/dashboard/groups/${group.id}`);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background p-8">
//       <div className="max-w-md mx-auto">
//         <div className="mb-8">
//           <Link href="/dashboard/dashboard" className="text-primary hover:underline">
//             ← Back to Dashboard
//           </Link>
//         </div>

//         <h1 className="text-3xl font-bold mb-6">Create Group</h1>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium mb-2">
//               Group Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               {...register("name", { required: true })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               placeholder="Enter group name"
//             />
//           </div>

//           <div>
//             <label htmlFor="description" className="block text-sm font-medium mb-2">
//               Description (Optional)
//             </label>
//             <input
//               id="description"
//               type="text"
//               {...register("description")}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               placeholder="Enter description"
//             />
//           </div>

//           <div>
//             <label htmlFor="currency" className="block text-sm font-medium mb-2">
//               Currency
//             </label>
//             <select
//               id="currency"
//               {...register("currency")}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             >
//               <option value="INR">INR (₹)</option>
//               <option value="USD">USD ($)</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
//           >
//             {isLoading ? "Creating..." : "Create Group"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
"use client";

import CreateGroupForm from "@/components/CreateGroupForm";

export default function GroupsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Group</h1>
        <CreateGroupForm />
      </div>
    </div>
  );
}