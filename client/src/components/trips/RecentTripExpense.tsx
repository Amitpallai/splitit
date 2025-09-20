"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrip } from "@/context/TripContext";
import { expenseApi } from "@/services/expenseApi";
import type { Expense } from "@/services/expenseApi";

export default function PaymentsTable() {
  const { trips } = useTrip(); // <-- comes from your TripContext
  const [selectedTrip, setSelectedTrip] = React.useState<string | null>(null);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [loading, setLoading] = React.useState(false);

  // fetch expenses when selectedTrip changes
  React.useEffect(() => {
    const fetchExpenses = async () => {
      if (!selectedTrip) return;
      setLoading(true);
      try {
        const data = await expenseApi.getRecentExpenses(selectedTrip);
        setExpenses((data as any).expenses || data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [selectedTrip]);

  return (
    <Card className="w-full mx-auto">
      {/* Header with dropdown */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payments</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedTrip
                ? trips.find((t: any) => t.id === selectedTrip)?.tripName
                : "Select Trip"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Select Trip</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {trips.map((trip: any) => (
              <DropdownMenuItem
                key={trip.id}
                onClick={() => setSelectedTrip(trip.id)}
              >
                {trip.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      {/* Main content */}
      <CardContent>
        {!selectedTrip ? (
          <p className="text-muted-foreground text-center py-6">
            Please select a trip to view payments.
          </p>
        ) : loading ? (
          <p className="text-muted-foreground text-center py-6">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No payments found for this trip.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-3 font-semibold text-sm border-b py-2">
              <div>Title</div>
              <div className="text-center">Paid By</div>
              <div className="text-end">Amount</div>
            </div>
            {expenses.map((exp) => (
              <div
                key={exp._id}
                className="grid grid-cols-3 text-sm py-2 border-b last:border-0"
              >
                <div>{exp.title}</div>
                <div className="text-muted-foreground text-center">
                  {exp.paidBy}
                </div>
                <div className="text-green-600 text-end">
                  ${exp.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
