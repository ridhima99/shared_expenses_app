"use client";

type Balance = {
  userId: string;
  userName: string;
  paid: number;
  owed: number;
  net: number;
};

export default function BalanceTable({ balances }: { balances: Balance[] }) {
  return (
    <div className="border rounded-lg">
      <table className="w-full">
        <thead className="bg-secondary">
          <tr>
            <th className="p-4 text-left">Member</th>
            <th className="p-4 text-right">Paid</th>
            <th className="p-4 text-right">Owes</th>
            <th className="p-4 text-right">Net</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((balance) => (
            <tr key={balance.userId} className="border-t">
              <td className="p-4">{balance.userName}</td>
              <td className="p-4 text-right">{balance.paid}</td>
              <td className="p-4 text-right">{balance.owed}</td>
              <td className="p-4 text-right font-semibold">
                {balance.net > 0 ? '+' : ''}{balance.net}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}