// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center p-24">
//       <div className="flex flex-col items-center gap-6 text-center">
//         <h1 className="text-4xl font-bold">Shared Expenses App</h1>
//         <p className="text-lg text-muted-foreground max-w-md">
//           Manage expenses with your flatmates easily. Track who paid, who owes, and settle balances.
//         </p>
//         <div className="flex gap-4 mt-4">
//           <Link
//             href="/login"
//             className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
//           >
//             Login
//           </Link>
//           <Link
//             href="/register"
//             className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition"
//           >
//             Register
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Shared Expenses</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Manage shared expenses with flatmates easily
          </p>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}