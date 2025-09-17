import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface Participant {
  name: string
  amountSponsored: number
  isSelected: boolean // For the "tick" to select (e.g., who shares/owes)
}

interface AddBillDialogProps {
  isOpen: boolean
  onClose: () => void
  tripId: string | null
}

export function AddBillDialog({ isOpen, onClose, tripId }: AddBillDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [newParticipantName, setNewParticipantName] = useState("")
  const [participants, setParticipants] = useState<Participant[]>([])

  const handleAddParticipant = () => {
    if (newParticipantName.trim()) {
      setParticipants([
        ...participants,
        { name: newParticipantName, amountSponsored: 0, isSelected: false },
      ])
      setNewParticipantName("")
    }
  }

  const handleAmountChange = (index: number, value: number) => {
    const updated = [...participants]
    updated[index].amountSponsored = value
    setParticipants(updated)
  }

  const handleSelectChange = (index: number, checked: boolean) => {
    const updated = [...participants]
    updated[index].isSelected = checked
    setParticipants(updated)
  }

  const handleSave = () => {
    if (!tripId) return
    const billData = { title, description, participants }
    // TODO: Send to backend API (e.g., axios.post(`/api/trips/${tripId}/bills`, billData))
    console.log("Saving bill to trip", tripId, ":", billData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Bill</DialogTitle>
          <DialogDescription>
            Enter bill details for the selected trip. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dinner Bill"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Group dinner at restaurant"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Add Participant</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                placeholder="e.g., Alice"
              />
              <Button onClick={handleAddParticipant}>Add</Button>
            </div>
          </div>
          <div className="mt-4">
            <Label>Participants and Amounts Sponsored</Label>
            <div className="mt-2 space-y-2">
              {participants.map((p, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={p.isSelected}
                      onCheckedChange={(checked) => handleSelectChange(index, checked as boolean)}
                    />
                    <Badge variant="secondary">{p.name}</Badge>
                  </div>
                  <Input
                    type="number"
                    value={p.amountSponsored}
                    onChange={(e) => handleAmountChange(index, parseFloat(e.target.value) || 0)}
                    placeholder="Amount sponsored"
                    className="w-32"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!tripId || participants.length === 0}>
            Save Bill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}