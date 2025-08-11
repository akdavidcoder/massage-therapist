"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Search, CheckCircle, XCircle, Loader2, FileImage, ExternalLink, Trash2, Download } from "lucide-react"
import { format } from "date-fns"

// Define the shape of a Booking object
interface Booking {
  _id: string
  clientName: string
  clientEmail: string
  serviceName: string
  duration: number
  price: number
  date: string
  time: string
  location: string
  status: string
  paymentStatus: string
  driverLicenseFrontUrl?: string
  driverLicenseBackUrl?: string
  createdAt: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  // Fetches all bookings from the public API endpoint
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        throw new Error("Failed to fetch bookings from server.");
      }
    } catch (error: any) {
      console.error("Failed to fetch bookings:", error)
      toast({
        title: "Error",
        description: error.message || "Could not fetch bookings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }

  // Calls the admin API to update a booking's status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        toast({ title: "Success", description: `Booking status updated to ${newStatus}.` });
        fetchBookings() // Refresh the list after updating
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status.");
      }
    } catch (error: any) {
      console.error("Failed to update booking:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  // Open delete modal
  const openDeleteModal = (booking: Booking) => {
    setBookingToDelete(booking)
    setDeleteModalOpen(true)
  }

  // Delete a booking
  const confirmDelete = async () => {
    if (!bookingToDelete) return
    
    try {
      const response = await fetch(`/api/admin/bookings/${bookingToDelete._id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        toast({ title: "Success", description: "Booking deleted successfully." });
        fetchBookings();
        setDeleteModalOpen(false)
        setBookingToDelete(null)
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete booking.");
      }
    } catch (error: any) {
      console.error("Failed to delete booking:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  // Download license image
  const downloadLicense = async (url: string, clientName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${clientName}-license.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast({ title: "Error", description: "Failed to download image", variant: "destructive" });
    }
  }

  // Filter bookings based on search term, status filter, and date filter
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesDate = !dateFilter || format(new Date(booking.createdAt), "yyyy-MM-dd") === dateFilter
    return matchesSearch && matchesStatus && matchesDate
  })

  // Helper function to determine badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <Badge variant="outline">{filteredBookings.length} total bookings</Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Input
              type="date"
              placeholder="Filter by booking date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full md:w-48"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking._id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{booking.clientName}</h3>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{booking.clientEmail}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(booking.date), "MMM d, yyyy")} at {booking.time}
                    </span>
                    <span>
                      {booking.serviceName} ({booking.duration} min)
                    </span>
                    <span className="font-medium">${booking.price}</span>
                    {(booking.driverLicenseFrontUrl || booking.driverLicenseBackUrl) && (
                      <div className="flex items-center gap-2 text-sm">
                        {booking.driverLicenseFrontUrl && (
                          <div className="flex items-center gap-1">
                            <a 
                              href={booking.driverLicenseFrontUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <FileImage className="w-3 h-3 mr-1" />
                              Front
                              <ExternalLink className="w-2 h-2 ml-1" />
                            </a>
                            <button
                              onClick={() => downloadLicense(booking.driverLicenseFrontUrl!, `${booking.clientName}-front`)}
                              className="flex items-center text-green-600 hover:text-green-800"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {booking.driverLicenseBackUrl && (
                          <div className="flex items-center gap-1">
                            <a 
                              href={booking.driverLicenseBackUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <FileImage className="w-3 h-3 mr-1" />
                              Back
                              <ExternalLink className="w-2 h-2 ml-1" />
                            </a>
                            <button
                              onClick={() => downloadLicense(booking.driverLicenseBackUrl!, `${booking.clientName}-back`)}
                              className="flex items-center text-green-600 hover:text-green-800"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {booking.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => updateBookingStatus(booking._id, "confirmed")}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateBookingStatus(booking._id, "cancelled")}>
                        <XCircle className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                  {booking.status === "confirmed" && (
                    <Button size="sm" variant="outline" onClick={() => updateBookingStatus(booking._id, "completed")}>
                      Mark as Completed
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => openDeleteModal(booking)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookings found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No bookings have been made yet."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {bookingToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Client:</strong> {bookingToDelete.clientName}</p>
                <p><strong>Service:</strong> {bookingToDelete.serviceName}</p>
                <p><strong>Date:</strong> {format(new Date(bookingToDelete.date), "MMM d, yyyy")} at {bookingToDelete.time}</p>
                <p><strong>Amount:</strong> ${bookingToDelete.price}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}