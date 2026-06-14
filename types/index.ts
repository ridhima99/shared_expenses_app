export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  createdBy: string;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  date: Date;
  paidBy: string;
  splitType: string;
}