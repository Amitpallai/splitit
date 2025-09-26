"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrip } from "@/context/TripContext";
import { expenseApi } from "@/services/expenseApi";
import type { Expense } from "@/services/expenseApi";
import { useCurrency } from "@/context/CureencyContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type TripLike = {
  _id?: string;
  id?: string;
  tripName?: string;
  name?: string;
  participants?: { _id: string; username: string }[];
  guestParticipants?: string[];
  members?: string[];
};

export default function RecentTripExpense() {
  const { trips } = useTrip();
  const { currency } = useCurrency();

  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTripId = (t: TripLike) => t._id ?? t.id ?? "";
  const tripLabel = (t: TripLike) => t.tripName ?? t.name ?? `Trip ${getTripId(t)}`;

  const currentTrip = useMemo(() => {
    if (!selectedTripId) return null;
    return trips.find((t) => getTripId(t) === selectedTripId) as TripLike | null;
  }, [selectedTripId, trips]);

  const members = useMemo(() => {
    if (!currentTrip) return [];
    const participants = Array.isArray(currentTrip.participants) ? currentTrip.participants.map((p) => p.username) : [];
    const membersArr = Array.isArray(currentTrip.members) ? currentTrip.members : [];
    const guests = Array.isArray(currentTrip.guestParticipants) ? currentTrip.guestParticipants : [];
    return Array.from(new Set([...participants, ...membersArr, ...guests].filter(Boolean)));
  }, [currentTrip]);

  const fetchExpenses = async (showLoader = false) => {
    if (!selectedTripId) {
      setExpenses([]);
      return;
    }

    if (showLoader) setLoading(true); // show loader only on manual refresh
    setError(null);

    try {
      const raw = await expenseApi.getRecentExpenses(selectedTripId);
      const data = raw && (raw as any).expenses ? (raw as any).expenses : raw;
      
      if (showLoader) {
        // wait 3 seconds before updating
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      setExpenses(Array.isArray(data) ? (data as Expense[]) : []);
    } catch (err: any) {
      console.error("getRecentExpenses error:", err);
      setError(err?.message ?? "Failed to fetch expenses");
      setExpenses([]);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // Auto-fetch on trip change without loader
  useEffect(() => {
    fetchExpenses(false);
  }, [selectedTripId]);

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + Number(e?.amount ?? 0), 0), [expenses]);
  const perPersonShare = useMemo(() => (members.length ? totalExpenses / members.length : 0), [totalExpenses, members]);

  const balances = useMemo(() => {
    const map: Record<string, number> = {};
    members.forEach((m) => (map[m] = 0));
    expenses.forEach((exp) => {
      const payer = exp.paidBy ?? "";
      map[payer] = (map[payer] ?? 0) + Number(exp.amount ?? 0);
    });
    Object.keys(map).forEach((m) => (map[m] = map[m] - perPersonShare));
    return map;
  }, [expenses, members, perPersonShare]);

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  };

  const settlements = useMemo(() => {
    const debtors: { name: string; amount: number }[] = [];
    const creditors: { name: string; amount: number }[] = [];

    Object.entries(balances).forEach(([name, bal]) => {
      if (bal < -0.005) debtors.push({ name, amount: -bal });
      else if (bal > 0.005) creditors.push({ name, amount: bal });
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const result: string[] = [];
    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const d = debtors[i];
      const c = creditors[j];
      const amt = Math.min(d.amount, c.amount);
      result.push(`${d.name} pays ${c.name} ${formatAmount(amt)}`);
      d.amount -= amt;
      c.amount -= amt;
      if (Math.abs(d.amount) < 0.005) i++;
      if (Math.abs(c.amount) < 0.005) j++;
    }

    return result;
  }, [balances, currency]);

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <CardTitle>Recent Trip Expenses</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedTripId ?? ""} onValueChange={(val) => setSelectedTripId(val || null)}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="— Select trip —" />
            </SelectTrigger>
            <SelectContent>
              {trips.map((t) => (
                <SelectItem key={getTripId(t)} value={getTripId(t)}>
                  {tripLabel(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => fetchExpenses(true)} variant="outline" size="sm">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {!selectedTripId ? (
          <p className="text-muted-foreground text-center py-6">Please select a trip to view expenses.</p>
        ) : loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-4">Error: {error}</p>
        ) : expenses.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">No expenses found for this trip.</p>
        ) : (
          <div className="space-y-4">
            {/* Expenses Table */}
            <div className="grid grid-cols-3 font-semibold text-sm border-b py-2">
              <div>Title</div>
              <div className="text-center">Paid By</div>
              <div className="text-end">Amount</div>
            </div>

            {expenses.map((exp) => (
              <div key={(exp as any)._id ?? JSON.stringify(exp)} className="grid grid-cols-3 text-sm py-2 border-b last:border-0">
                <div className="capitalize">{exp.title}</div>
                <div className="text-muted-foreground text-center">{exp.paidBy}</div>
                <div className="text-green-600 text-end">{formatAmount(Number(exp.amount ?? 0))}</div>
              </div>
            ))}

            <div className="grid grid-cols-3 text-sm font-semibold border-t pt-2 mt-2">
              <div>Total</div>
              <div></div>
              <div className="text-green-600 text-end">{formatAmount(totalExpenses)}</div>
            </div>

            <p className="mt-2 text-sm">
              Per Person Share: <span className="font-semibold text-blue-600">{formatAmount(perPersonShare)}</span>
            </p>

            <div>
              <h3 className="font-semibold mt-4 mb-2">Balances</h3>
              <div className="space-y-1 text-sm capitalize">
                {Object.entries(balances).map(([member, balance]) => (
                  <p key={member} className={balance >= 0 ? "text-green-600" : "text-red-600"}>
                    {member || "(unknown)"} {balance >= 0 ? "gets back" : "owes"} {formatAmount(Math.abs(balance))}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mt-4 mb-2">Settlement Suggestions</h3>
              {settlements.length === 0 ? (
                <p className="text-muted-foreground text-sm">Everyone is settled up!</p>
              ) : (
                <ul className="list-disc list-inside text-sm space-y-1 capitalize">
                  {settlements.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
