// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { signOut } from "next-auth/react";

// export default function SettingsPage() {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogout = async () => {
//   setIsLoading(true);
//   signOut({ callbackUrl: "/auth/login" });
// };

//   return (
//     <div className="min-h-screen bg-background p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-8">
//           <Link href="/dashboard/dashboard" className="text-primary hover:underline">
//             ← Back to Dashboard
//           </Link>
//         </div>

//         <h1 className="text-3xl font-bold mb-6">Settings</h1>

//         <div className="p-6 border rounded-lg mb-6">
//           <h2 className="text-xl font-semibold mb-4">Account</h2>
//           <button
//             onClick={handleLogout}
//             disabled={isLoading}
//             className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition disabled:opacity-50"
//           >
//             {isLoading ? "Logging out..." : "Logout"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}