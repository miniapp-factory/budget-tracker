import { description, title } from "@/lib/metadata";
import { generateMetadata } from "@/lib/farcaster-embed";

export { generateMetadata };

import ExpenseForm from "@/components/expense-form";
import Dashboard from "@/components/dashboard";
import Charts from "@/components/charts";

export default function Home() {
import ExpenseForm from "@/components/expense-form";
import Dashboard from "@/components/dashboard";
import Charts from "@/components/charts";

  return (
    <main className="flex flex-col gap-4 px-4 py-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <ExpenseForm />
      <Dashboard />
      <Charts />
    </main>
  );
}
