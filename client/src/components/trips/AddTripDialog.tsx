"use client";

import { useState } from "react";
import { useTrip } from "@/context/TripContext"; // ✅ fixed import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddTripDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTripDialog({ isOpen, onClose }: AddTripDialogProps) {
  const { addTrip, loading } = useTrip(); // ✅ fixed hook usage

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [participantInput, setParticipantInput] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleAddParticipant = () => {
    const value = participantInput.trim();
    if (!value) return;
    if (participants.includes(value)) {
      setError("Participant already added");
      return;
    }
    setParticipants((prev) => [...prev, value]);
    setParticipantInput("");
    setError("");
    toast.success(`Participant "${value}" added ✅`);
  };

  const handleRemoveParticipant = (index: number) => {
    const removed = participants[index];
    setParticipants((prev) => prev.filter((_, i) => i !== index));
    toast.info(`Removed participant: ${removed}`);
  };

  const handleSave = async () => {
    if (!name || !location) {
      toast.error("Trip name and location are required");
      return;
    }

    try {
      await addTrip({ tripName: name, location, participants });
      toast.success("Trip created successfully 🎉");
      onClose();

      // reset fields
      setName("");
      setLocation("");
      setParticipants([]);
      setParticipantInput("");
    } catch {
      toast.error("Failed to create trip ❌");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Trip</DialogTitle>
          <DialogDescription>
            Enter trip details and click save when done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Trip Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Paris Vacation"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Paris, France"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Participants</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={participantInput}
                  onChange={(e) => setParticipantInput(e.target.value)}
                  placeholder="e.g., Alice"
                />
                <Button type="button" onClick={handleAddParticipant}>
                  Add
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {participants.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {participants.map((p, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center border rounded-md px-3 py-1"
                    >
                      <span>{p}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveParticipant(i)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Trip"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
