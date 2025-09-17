import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddTripDialog } from "./trips/AddTripDialog"// New dialog for adding trips, defined below
import { AddBillDialog } from "./trips/AddBillDialog"

// Mock data; replace with API fetch (e.g., useEffect with axios.get('/api/trips'))
const trips = [
  { id: "trip1", name: "Paris Vacation", description: "Group trip to France", totalExpenses: 1200.00 },
  { id: "trip2", name: "Weekend Getaway", description: "Local hiking trip", totalExpenses: 300.00 },
  // Add more...
]

export function AddTrip() {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [isAddBillOpen, setIsAddBillOpen] = useState(false)
  const [isAddTripOpen, setIsAddTripOpen] = useState(false)

  const handleTripClick = (tripId: string) => {
    setSelectedTripId(tripId)
    setIsAddBillOpen(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Split Bill Dashboard</h1>
        <Button onClick={() => setIsAddTripOpen(true)}>Add New Trip</Button>
      </header>
      <main className="flex-1 p-6 grid gap-6 md:grid-cols-3">
        {trips.map((trip) => (
          <Card 
            key={trip.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleTripClick(trip.id)}
          >
            <CardHeader>
              <CardTitle>{trip.name}</CardTitle>
              <CardDescription>{trip.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Total: ${trip.totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>
        ))}
      </main>
      <AddTripDialog isOpen={isAddTripOpen} onClose={() => setIsAddTripOpen(false)} />
      <AddBillDialog 
        isOpen={isAddBillOpen} 
        onClose={() => setIsAddBillOpen(false)} 
        tripId={selectedTripId} 
      />
    </div>
  )
}