"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Pencil, Trash, Users } from "lucide-react";
import { expenseApi } from "@/services/expenseApi";
import { useExpenses } from "@/context/ExpensesContext";
import type { Expense } from "@/services/expenseApi";
import { useTrip } from "@/context/TripContext";

interface TripCardProps {
  id: string;
  name: string;
  location: string;
  participants?: string[];
  guestParticipants?: string[];
}

export function TripCard({
  id,
  name,
  location,
  participants = [],
  guestParticipants = [],
}: TripCardProps) {
  const [open, setOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [editTripOpen, setEditTripOpen] = useState(false);
  const [deleteTripOpen, setDeleteTripOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expenseMode, setExpenseMode] = useState<"add" | "edit">("add");
  const [currentExpense, setCurrentExpense] = useState<Partial<Expense>>({});
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [tripExpenses, setTripExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [editTripName, setEditTripName] = useState(name);
  const [editLocation, setEditLocation] = useState(location);
  const [editParticipants, setEditParticipants] = useState(
    [...participants, ...guestParticipants].join(", ")
  );

  const allMembers = [...participants, ...guestParticipants];
  const { addExpense, editExpense, deleteExpense } = useExpenses();
  const { updateTrip, deleteTrip } = useTrip();

  // -----------------------------
  // Fetch expenses on mount AND when dialog opens
  // -----------------------------
  const fetchTripExpenses = async () => {
    try {
      const data = await expenseApi.getRecentExpenses(id);
      setTripExpenses((data as any).expenses || data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  // fetch immediately for dashboard
  useEffect(() => {
    fetchTripExpenses();
  }, []);

  // fetch again if dialog opens to ensure latest
  useEffect(() => {
    if (open) fetchTripExpenses();
  }, [open]);

  // -----------------------------
  // Sync current expense fields when editing
  // -----------------------------
  useEffect(() => {
    setTitle(currentExpense.title || "");
    setDescription(currentExpense.description || "");
    setPayer(currentExpense.paidBy || "");
    setAmount(currentExpense.amount?.toString() || "");
  }, [currentExpense]);

  // -----------------------------
  // Derived calculations for totals and balance
  // -----------------------------
  const totalExpensesValue = useMemo(() => {
    return tripExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [tripExpenses]);

  const perPersonShare = useMemo(() => {
    return allMembers.length > 0 ? totalExpensesValue / allMembers.length : 0;
  }, [totalExpensesValue, allMembers]);

  const memberPayments = useMemo(() => {
    const payments: Record<string, number> = {};
    allMembers.forEach((m) => {
      payments[m] = tripExpenses
        .filter((exp) => exp.paidBy === m)
        .reduce((sum, exp) => sum + exp.amount, 0);
    });
    return payments;
  }, [tripExpenses, allMembers]);

  const currentUser = "Vaibhav"; // replace with actual logged-in user
  const balanceValue = useMemo(() => {
    return (memberPayments[currentUser] ?? 0) - perPersonShare;
  }, [memberPayments, perPersonShare]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleSaveExpense = async () => {
    if (!title || !amount || !payer) {
      alert("Please fill all required fields (title, amount, payer).");
      return;
    }

    const expenseData = {
      title,
      description: description.trim() || "",
      amount: parseFloat(amount),
      paidBy: payer,
    };

    try {
      if (expenseMode === "add") {
        await addExpense({ ...expenseData, tripId: id });
      } else {
        if (!currentExpense._id) throw new Error("No expense ID");
        await editExpense(currentExpense._id, expenseData);
      }
      setExpenseDialogOpen(false);
      fetchTripExpenses();
    } catch (err) {
      console.error("Failed to save expense:", err);
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    try {
      await deleteExpense(expenseToDelete);
      setDeleteConfirmOpen(false);
      fetchTripExpenses();
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  const handleUpdateTrip = async () => {
    if (!editTripName || !editLocation) {
      alert("Please fill all required fields (trip name, location).");
      return;
    }

    const participantsList = editParticipants
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    try {
      await updateTrip(id, {
        tripName: editTripName,
        location: editLocation,
        participants: participantsList,
      });
      setEditTripOpen(false);
    } catch (err) {
      console.error("Failed to update trip:", err);
    }
  };

  const handleDeleteTrip = async () => {
    try {
      await deleteTrip(id);
      setDeleteTripOpen(false);
    } catch (err) {
      console.error("Failed to delete trip:", err);
    }
  };

  // -----------------------------
  // Participants display component
  // -----------------------------
  const ParticipantsDisplay = () => {
    const [showAll, setShowAll] = useState(false);
    const maxVisible = 2;
    const visible = showAll ? allMembers : allMembers.slice(0, maxVisible);
    const remainingCount = allMembers.length - maxVisible;

    return (
      <div className="flex flex-wrap gap-2">
        {visible.map((p) => (
          <span
            key={p}
            className={`px-2 py-1 rounded text-xs ${guestParticipants.includes(p)
                ? "bg-gray-600 text-yellow-400"
                : "bg-gray-700 text-white"
              }`}
          >
            {p} {guestParticipants.includes(p) && "(Guest)"}
          </span>
        ))}
        {allMembers.length > maxVisible && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-2 py-1 rounded bg-gray-500 text-xs hover:bg-gray-400"
          >
            {showAll ? "Show less" : `+${remainingCount} more`}
          </button>
        )}
      </div>
    );
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <>
      {/* Main Trip Card */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card className="max-w-[400px] min-w-[280px] rounded-xl border border-gray-700 shadow-md text-black dark:text-white cursor-pointer hover:scale-[1.02] transition-transform">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold capitalize">{name}</CardTitle>
                <div className="flex items-center space-x-4">
                  <span className="text-xs rounded-full border-2 px-2 py-1">
                    {allMembers.length} member{allMembers.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400 mt-1 capitalize">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {location}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditTripOpen(true);
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTripOpen(true);
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Your balance:</span>
                <span
                  className={`font-semibold ${balanceValue < 0 ? "text-red-500" : "text-green-500"
                    }`}
                >
                  {balanceValue < 0
                    ? `-$${Math.abs(balanceValue).toFixed(2)}`
                    : `$${balanceValue.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-medium">Total expenses:</span>
                <span className="font-semibold">${totalExpensesValue.toFixed(2)}</span>
              </div>

              {/* Participants */}
              <div className="flex flex-col mt-2">
                <div className="flex items-center text-sm text-gray-400 mb-1">
                  <Users className="w-4 h-4 mr-2" />
                  <span>
                    {allMembers.length} participant
                    {allMembers.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <ParticipantsDisplay />
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>

        {/* Expenses inside trip */}
        <DialogContent className="max-w-lg bg-black text-white border border-gray-700 space-y-4 capitalize">
          <DialogHeader>
            <DialogTitle>{name} - Expenses</DialogTitle>
          </DialogHeader>

          <Button
            className="bg-yellow-400 hover:bg-purple-900 text-black font-semibold"
            onClick={() => {
              setExpenseMode("add");
              setCurrentExpense({});
              setExpenseDialogOpen(true);
            }}
          >
            Add Expense
          </Button>

          <div className="space-y-4">
            {tripExpenses.length === 0 ? (
              <p>No expenses yet.</p>
            ) : (
              tripExpenses.map((exp) => (
                <Card key={exp._id}>
                  <CardHeader className="flex justify-between">
                    <CardTitle className="text-md capitalize">{exp.title}</CardTitle>
                    <p className="text-sm">Amount: ${exp.amount.toFixed(2)}</p>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center capitalize">
                    <div>
                      <p className="text-sm">Paid by: {exp.paidBy}</p>
                      {exp.description && (
                        <p className="text-sm">Description: {exp.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setExpenseMode("edit");
                          setCurrentExpense(exp);
                          setExpenseDialogOpen(true);
                        }}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setExpenseToDelete(exp._id || null);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Expense Dialog */}
      <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
        <DialogContent className="max-w-lg bg-black text-white border border-gray-700 space-y-4">
          <DialogHeader>
            <DialogTitle>{expenseMode === "add" ? "Add" : "Edit"} Expense</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-3">
            <Input
              placeholder="Expense Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-800 text-white"
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="max-h-[300px] min-h-[100px] bg-gray-800 text-white"
            />
            <div>
              <span className="font-medium mb-2 block">Select Payer:</span>
              <div className="grid grid-cols-2 gap-2">
                {allMembers.map((m) => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payer"
                      value={m}
                      checked={payer === m}
                      onChange={() => setPayer(m)}
                      className="accent-green-500"
                    />
                    <span>
                      {m}{" "}
                      {guestParticipants.includes(m) && (
                        <span className="text-yellow-400">(Guest)</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 text-white"
            />
            <Button
              className="bg-yellow-400 hover:bg-purple-900 text-black font-semibold"
              onClick={handleSaveExpense}
            >
              {expenseMode === "add" ? "Add" : "Update"} Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Trip Dialog */}
      <Dialog open={editTripOpen} onOpenChange={setEditTripOpen}>
        <DialogContent className="max-w-lg bg-black text-white border border-gray-700 space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-3">
            <Input
              placeholder="Trip Name"
              value={editTripName}
              onChange={(e) => setEditTripName(e.target.value)}
              className="bg-gray-800 text-white"
            />
            <Input
              placeholder="Location"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="bg-gray-800 text-white"
            />
            <Textarea
              placeholder="Participants (comma separated)"
              value={editParticipants}
              onChange={(e) => setEditParticipants(e.target.value)}
              className="max-h-[300px] min-h-[100px] bg-gray-800 text-white"
            />
            <Button
              className="bg-yellow-400 hover:bg-purple-900 text-black font-semibold"
              onClick={handleUpdateTrip}
            >
              Update Trip
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Trip Confirmation */}
      <Dialog open={deleteTripOpen} onOpenChange={setDeleteTripOpen}>
        <DialogContent className="max-w-lg bg-black text-white border border-gray-700 space-y-4">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this trip? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteTripOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTrip}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Expense Confirmation */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-lg bg-black text-white border border-gray-700 space-y-4">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this expense? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteExpense}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
