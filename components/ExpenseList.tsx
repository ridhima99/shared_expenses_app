"use client";

type Expense = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  date: string;
  splitType: string;
  payer: {
    name: string | null;
    email: string;
  };
  participants: {
    user: {
      name: string | null;
      email: string;
    };
    amount: number;
  }[];
};

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  if (expenses.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No expenses yet</div>;
  }

  return (
    <div className="border rounded-lg">
      {expenses.map((expense) => (
        <div key={expense.id} className="p-4 border-t">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{expense.title}</h3>
            <p className="font-semibold">
              {expense.currency === 'INR' ? '₹' : '$'}{expense.amount}
            </p>
          </div>
          {expense.description && (
            <p className="text-sm text-muted-foreground mb-2">{expense.description}</p>
          )}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{new Date(expense.date).toLocaleDateString()}</span>
            <span>Split: {expense.splitType}</span>
          </div>
          <div className="text-sm mt-2">
            <span className="text-muted-foreground">Paid by </span>
            <span className="font-medium">{expense.payer.name || expense.payer.email}</span>
          </div>
        </div>
      ))}
    </div>
  );
}