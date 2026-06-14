"use client";

import { useState } from "react";

type Member = {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  joinDate: string;
};

export default function MembersList({
  groupId,
  members,
}: {
  groupId: string;
  members: Member[];
}) {
  const [searchEmail, setSearchEmail] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = async () => {
    if (!searchEmail) return;
    setIsLoading(true);
    
    try {
      const res = await fetch(`/api/users?email=${searchEmail}`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const inviteMember = async (userId: string) => {
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/groups/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, userId }),
      });
      
      if (res.ok) {
        setSearchEmail("");
        setUsers([]);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Active Members</h2>
      <div className="border rounded-lg mb-6">
        {members.map((member) => (
          <div key={member.user.id} className="p-4 border-t">
            <p className="font-medium">{member.user.name || member.user.email}</p>
            <p className="text-sm text-muted-foreground">
              Joined: {new Date(member.joinDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Invite Member</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          placeholder="Enter email to search"
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={searchUsers}
          disabled={isLoading}
          className="px-4 py-2 bg-secondary rounded-lg font-medium hover:bg-secondary/90 transition disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {users.length > 0 && (
        <div className="border rounded-lg">
          {users.map((user) => (
            <div key={user.id} className="p-4 border-t flex justify-between items-center">
              <p>{user.name || user.email}</p>
              <button
                onClick={() => inviteMember(user.id)}
                disabled={isLoading}
                className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition disabled:opacity-50"
              >
                Invite
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}