// "use client";

// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useState } from "react";
// import { prisma } from "@/lib/prisma/client";

// type FormData = {
//   name: string;
//   email: string;
//   password: string;
// };

// export default function RegisterPage() {
//   const router = useRouter();
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>();

//   const onSubmit = async (data: FormData) {
//     setIsLoading(true);
//     setError("");

//     try {
//       const existingUser = await prisma.user.findUnique({
//         where: { email: data.email },
//       });

//       if (existingUser) {
//         setError("User already exists with this email");
//         setIsLoading(false);
//         return;
//       }

//       const user = await prisma.user.create({
//         data: {
//           name: data.name,
//           email: data.email,
//           password: data.password,
//         },
//       });

//       if (user) {
//         router.push("/login");
//       } else {
//         setError("Something went wrong");
//       }
//     } catch (err) {
//       setError("Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center p-4">
//       <div className="w-full max-w-md space-y-8">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold">Register</h1>
//           <p className="text-muted-foreground mt-2">
//             Create your account
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {error && (
//             <div className="p-3 bg-destructive text-destructive-foreground rounded-lg text-sm">
//               {error}
//             </div>
//           )}

//           <div className="space-y-4">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium mb-2">
//                 Name
//               </label>
//               <input
//                 id="name"
//                 type="text"
//                 {...register("name", { required: "Name is required" })}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="Enter your name"
//               />
//               {errors.name && (
//                 <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium mb-2">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 {...register("email", { required: "Email is required" })}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="Enter your email"
//               />
//               {errors.email && (
//                 <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium mb-2">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 {...register("password", { 
//                   required: "Password is required",
//                   minLength: { value: 6, message: "Password must be at least 6 characters" }
//                 })}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="Enter your password"
//               />
//               {errors.password && (
//                 <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
//               )}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
//           >
//             {isLoading ? "Creating account..." : "Create Account"}
//           </button>
//         </form>

//         <div className="text-center text-sm">
//           <Link href="/auth/login" className="text-primary hover:underline">
//             Already have an account? Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      setError("Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

          {error && (
            <div className="mb-4 p-3 bg-destructive text-destructive-foreground rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name (Optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your password (min 6 characters)"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-primary hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}