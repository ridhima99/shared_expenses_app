"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CreateGroupFormData = {
  name: string;
  description: string;
  currency: string;
};

export default function CreateGroupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateGroupFormData>({
    name: "",
    description: "",
    currency: "INR",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const group = await res.json();
        router.push(`/dashboard/groups/${group.id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Group Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter group name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description (Optional)
        </label>
        <input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter description"
        />
      </div>

      <div>
        <label htmlFor="currency" className="block text-sm font-medium mb-2">
          Currency
        </label>
        <select
          id="currency"
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
      >
        {isLoading ? "Creating..." : "Create Group"}
      </button>
    </form>
  );
}