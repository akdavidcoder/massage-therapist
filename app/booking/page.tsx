"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { CalendarDays, Clock, Wallet } from "lucide-react"
import { format } from "date-fns"

interface Service {
  _id: string
  name: string
  description: string
  duration: number[]
  prices: { [key: number]: number }
}

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [selectedDuration, setSelectedDuration] = useState("")
  const [location, setLocation] = useState("")
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
  })
  const [notes, setNotes] = useState("")
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services")
        if (response.ok) {
          const data = await response.json()
          setServices(data)
        }
      } catch (error) {
        console.error("Failed to fetch services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ]

  const selectedServiceData = services.find((s) => s._id === selectedService)
  const price =
    selectedServiceData && selectedDuration ? selectedServiceData.prices[Number.parseInt(selectedDuration)] : 0

  const connectWallet = async () => {
    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockAddress = "0x" + Math.random().toString(16).substr(2, 40)
      setWalletAddress(mockAddress)
      setWalletConnected(true)
      toast({
        title: "Wallet Connected",
        description: "Your crypto wallet has been connected successfully.",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const bookingData = {
        clientName: clientInfo.name,
        clientEmail: clientInfo.email,
        clientPhone: clientInfo.phone,
        clientGender: clientInfo.gender,
        serviceId: selectedService,
        serviceName: selectedServiceData?.name,
        duration: Number.parseInt(selectedDuration),
        price,
        date: selectedDate,
        time: selectedTime,
        location,
        walletAddress,
        notes,
        paymentMethod: "crypto",
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        toast({
          title: "Booking Confirmed!",
          description:
            "Your massage appointment has been booked successfully. You'll receive a confirmation email shortly.",
        })

        // Reset form
        setSelectedDate(undefined)
        setSelectedTime("")
        setSelectedService("")
        setSelectedDuration("")
        setLocation("")
        setClientInfo({ name: "", email: "", phone: "", gender: "" })
        setNotes("")
        setWalletConnected(false)
        setWalletAddress("")
      } else {
        throw new Error("Booking failed")
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    selectedDate &&
    selectedTime &&
    selectedService &&
    selectedDuration &&
    location &&
    clientInfo.name &&
    clientInfo.email &&
    clientInfo.phone &&
    clientInfo.gender &&
    walletConnected

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Massage</h1>
            <p className="text-xl text-gray-600">Loading available services...</p>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Massage</h1>
          <p className="text-xl text-gray-600">Schedule your relaxing massage therapy session with Sophia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Service Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2" />
                    Select Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="service">Massage Type</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a massage type" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service._id} value={service._id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedServiceData && (
                    <div>
                      <Label htmlFor="duration">Session Duration</Label>
                      <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedServiceData.duration.map((duration) => (
                            <SelectItem key={duration} value={duration.toString()}>
                              {duration} minutes - ${selectedServiceData.prices[duration]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label>Location</Label>
                    <RadioGroup value={location} onValueChange={setLocation}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="studio" id="studio" />
                        <Label htmlFor="studio">Studio (123 Wellness Street)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="home" id="home" />
                        <Label htmlFor="home">Home Visit (+$25)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Date & Time Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Select Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Preferred Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <Label>Available Times</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTime === time ? "default" : "outline"}
                            className="text-sm"
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={clientInfo.gender}
                      onValueChange={(value) => setClientInfo({ ...clientInfo, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Special Requests (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests or areas of focus?"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="w-5 h-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    We accept cryptocurrency payments for secure, private transactions.
                  </div>

                  {!walletConnected ? (
                    <Button type="button" variant="outline" onClick={connectWallet} className="w-full bg-transparent">
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Crypto Wallet
                    </Button>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center text-green-800">
                        <Wallet className="w-4 h-4 mr-2" />
                        <span className="font-medium">Wallet Connected</span>
                      </div>
                      <div className="text-sm text-green-700 mt-1">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </div>
                    </div>
                  )}

                  {price > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount:</span>
                        <span className="text-2xl font-bold text-primary">
                          ${location === "home" ? price + 25 : price}
                        </span>
                      </div>
                      {location === "home" && (
                        <div className="text-sm text-gray-600 mt-1">Includes $25 home visit fee</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Summary & Submit */}
          {selectedDate && selectedTime && selectedService && price > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600">Service</div>
                    <div className="font-medium">{selectedServiceData?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-medium">{selectedDuration} minutes</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Date & Time</div>
                    <div className="font-medium">
                      {format(selectedDate, "MMMM d, yyyy")} at {selectedTime}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-medium capitalize">{location}</div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? "Processing..." : `Confirm Booking - $${location === "home" ? price + 25 : price}`}
                </Button>
              </CardContent>
            </Card>
          )}
        </form>
      </div>

      <Footer />
    </div>
  )
}
