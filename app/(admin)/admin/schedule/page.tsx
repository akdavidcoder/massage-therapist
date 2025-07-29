"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Clock, PlusCircle, Trash2, Ban } from "lucide-react"
import { format } from "date-fns"

interface WorkingHours {
  [key: string]: {
    enabled: boolean
    start: string
    end: string
  }
}

interface BlockedDate {
  _id: string
  date: string
  reason: string
  allDay: boolean
  timeSlots: string[]
}

const initialWorkingHours: WorkingHours = {
  monday: { enabled: true, start: "09:00", end: "17:00" },
  tuesday: { enabled: true, start: "09:00", end: "17:00" },
  wednesday: { enabled: true, start: "09:00", end: "17:00" },
  thursday: { enabled: true, start: "09:00", end: "17:00" },
  friday: { enabled: true, start: "09:00", end: "17:00" },
  saturday: { enabled: true, start: "10:00", end: "16:00" },
  sunday: { enabled: false, start: "00:00", end: "00:00" },
}

export default function SchedulePage() {
  const [workingHours, setWorkingHours] = useState<WorkingHours>(initialWorkingHours)
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [isBlockedDateDialogOpen, setIsBlockedDateDialogOpen] = useState(false)
  const [newBlockedDate, setNewBlockedDate] = useState<{
    date?: Date
    reason: string
    allDay: boolean
    timeSlots: string
  }>({
    reason: "",
    allDay: true,
    timeSlots: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchScheduleData()
  }, [])

  const fetchScheduleData = async () => {
    try {
      const [hoursRes, blockedRes] = await Promise.all([
        fetch("/api/admin/schedule/hours"),
        fetch("/api/admin/schedule/blocked"),
      ])

      if (hoursRes.ok) {
        const data = await hoursRes.json()
        setWorkingHours({ ...initialWorkingHours, ...data.workingHours })
      } else {
        console.error("Failed to fetch working hours")
      }

      if (blockedRes.ok) {
        const data = await blockedRes.json()
        setBlockedDates(data)
      } else {
        console.error("Failed to fetch blocked dates")
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateDayHours = (day: string, field: "enabled" | "start" | "end", value: boolean | string) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }))
  }

  const handleSaveWorkingHours = async () => {
    try {
      const response = await fetch("/api/admin/schedule/hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workingHours }),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Working hours updated successfully." })
      } else {
        throw new Error("Failed to update working hours")
      }
    } catch (error: any) {
      console.error("Save working hours error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update working hours. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlockedDate.date || !newBlockedDate.reason) {
      toast({ title: "Validation Error", description: "Date and reason are required.", variant: "destructive" })
      return
    }

    try {
      const response = await fetch("/api/admin/schedule/blocked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newBlockedDate.date.toISOString(),
          reason: newBlockedDate.reason,
          allDay: newBlockedDate.allDay,
          timeSlots: newBlockedDate.allDay ? [] : newBlockedDate.timeSlots.split(",").map((t) => t.trim()),
        }),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Date blocked successfully." })
        setIsBlockedDateDialogOpen(false)
        setNewBlockedDate({ reason: "", allDay: true, timeSlots: "" })
        fetchScheduleData()
      } else {
        throw new Error("Failed to block date")
      }
    } catch (error: any) {
      console.error("Block date error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to block date. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUnblockDate = async (id: string) => {
    if (!confirm("Are you sure you want to unblock this date/time?")) {
      return
    }
    try {
      const response = await fetch(`/api/admin/schedule/blocked/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Success", description: "Date unblocked successfully." })
        fetchScheduleData()
      } else {
        throw new Error("Failed to unblock date")
      }
    } catch (error: any) {
      console.error("Unblock date error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to unblock date. Please try again.",
        variant: "destructive",
      })
    }
  }

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Schedule Management</h1>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Set Working Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-4">
                <Switch
                  checked={workingHours[day]?.enabled || false}
                  onCheckedChange={(checked) => updateDayHours(day, "enabled", checked)}
                  id={`switch-${day}`}
                />
                <Label htmlFor={`switch-${day}`} className="capitalize font-medium">
                  {day}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={workingHours[day]?.start || "09:00"}
                  onChange={(e) => updateDayHours(day, "start", e.target.value)}
                  disabled={!workingHours[day]?.enabled}
                  className="w-28"
                />
                <span>-</span>
                <Input
                  type="time"
                  value={workingHours[day]?.end || "17:00"}
                  onChange={(e) => updateDayHours(day, "end", e.target.value)}
                  disabled={!workingHours[day]?.enabled}
                  className="w-28"
                />
              </div>
            </div>
          ))}
          <Button onClick={handleSaveWorkingHours} className="w-full mt-4">
            Save Working Hours
          </Button>
        </CardContent>
      </Card>

      {/* Blocked Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Ban className="w-5 h-5 mr-2" />
              Blocked Dates & Times
            </div>
            <Dialog open={isBlockedDateDialogOpen} onOpenChange={setIsBlockedDateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => setNewBlockedDate({ reason: "", allDay: true, timeSlots: "" })}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Block Date
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Block Date or Time</DialogTitle>
                  <DialogDescription>Mark specific dates or time slots as unavailable.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleBlockDate} className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="blocked-date">Date</Label>
                    <Calendar
                      mode="single"
                      selected={newBlockedDate.date}
                      onSelect={(date) => setNewBlockedDate({ ...newBlockedDate, date: date || undefined })}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Input
                      id="reason"
                      value={newBlockedDate.reason}
                      onChange={(e) => setNewBlockedDate({ ...newBlockedDate, reason: e.target.value })}
                      placeholder="e.g., Vacation, Appointment"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="all-day"
                      checked={newBlockedDate.allDay}
                      onCheckedChange={(checked) => setNewBlockedDate({ ...newBlockedDate, allDay: checked })}
                    />
                    <Label htmlFor="all-day">Block All Day</Label>
                  </div>
                  {!newBlockedDate.allDay && (
                    <div className="grid gap-2">
                      <Label htmlFor="time-slots">Specific Time Slots (comma-separated, e.g., 9:00 AM, 10:00 AM)</Label>
                      <Input
                        id="time-slots"
                        value={newBlockedDate.timeSlots}
                        onChange={(e) => setNewBlockedDate({ ...newBlockedDate, timeSlots: e.target.value })}
                        placeholder="e.g., 9:00 AM, 10:00 AM"
                      />
                    </div>
                  )}
                  <DialogFooter>
                    <Button type="submit">Block Date</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {blockedDates.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No blocked dates or times.</p>
          ) : (
            blockedDates.map((blocked) => (
              <div
                key={blocked._id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <div className="font-medium">
                    {format(new Date(blocked.date), "MMM d, yyyy")} - {blocked.reason}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {blocked.allDay ? "All Day" : `Times: ${blocked.timeSlots.join(", ")}`}
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleUnblockDate(blocked._id)}>
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Unblock</span>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
