"use client";

type Settlement = {
  id: string;
  amount: number;
  currency: string;
  date: string;
  payer: {
    name: string | null;
    email: string;
  };
  receiver: {
    name: string | null;
    email: string;
  };
};

export default function SettlementList({ settlements }: { settlements: Settlement[] }) {
  if (settlements.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No settlements yet</div>;
  }

  return (
    <div className="border rounded-lg">
      {settlements.map((settlement) => (
        <div key={settlement.id} className="p-4 border-t">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">
                {settlement.receiver.name || settlement.receiver.email}
                <span className="text-muted-foreground"> gets from </span>
                {settlement.payer.name || settlement.payer.email}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(settlement.date).toLocaleDateString()}
              </p>
            </div>
            <p className="font-semibold">
              {settlement.currency === 'INR' ? '₹' : '$'}{settlement.amount}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}