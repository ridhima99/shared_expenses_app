"use client";

import Link from "next/link";

type Group = {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  _count: {
    expenses: number;
    members: number;
  };
};

export default function GroupList({ groups }: { groups: Group[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <Link
          href={`/dashboard/groups/${group.id}`}
          key={group.id}
          className="block p-6 border rounded-lg hover:border-primary transition"
        >
          <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
          {group.description && (
            <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
          )}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{group._count.members} members</span>
            <span>{group._count.expenses} expenses</span>
          </div>
        </Link>
      ))}
    </div>
  );
}