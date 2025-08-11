"use client"

import type React from "react"
import { useState, useEffect } from "react"
// Removed Paystack import - using custom payment methods
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { CalendarDays, Clock, Terminal, Loader2, Check, X, ChevronLeft, PartyPopper, CheckCircle, Camera } from "lucide-react"
import { format } from "date-fns"
import type { Service, ServiceModel } from "@/lib/types"
import ClientOnly from "@/components/ClientOnly"
import PaymentModal from "@/components/PaymentModal"

type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed'

interface PaymentMethod {
  _id: string
  name: string
  type: 'cashapp' | 'paypal' | 'crypto' | 'venmo' | 'zelle' | 'creditcard'
  details: {
    cashtag?: string
    paypalEmail?: string
    walletAddress?: string
    cryptoType?: string
    venmoHandle?: string
    zelleEmail?: string
    zellePhone?: string
  }
  instructions?: string
}

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [selectedDuration, setSelectedDuration] = useState("")
  const [clientInfo, setClientInfo] = useState({ name: "", email: "", phone: "", gender: "" })
  const [therapistPreference, setTherapistPreference] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedModel, setSelectedModel] = useState<ServiceModel | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'gender' | 'booking'>('gender')
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending')
  const [transactionReference, setTransactionReference] = useState("")
  const [bookingComplete, setBookingComplete] = useState(false)
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null)
  const [driverLicenseFrontFile, setDriverLicenseFrontFile] = useState<File | null>(null)
  const [driverLicenseBackFile, setDriverLicenseBackFile] = useState<File | null>(null)
  const [driverLicenseFrontUrl, setDriverLicenseFrontUrl] = useState<string>('')
  const [driverLicenseBackUrl, setDriverLicenseBackUrl] = useState<string>('')
  const [uploadingFront, setUploadingFront] = useState(false)
  const [uploadingBack, setUploadingBack] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const servicesPromise = fetch("/api/services").then(res => res.json())
        const paymentMethodsPromise = fetch("/api/payment-methods").then(res => res.json())
        const [servicesData, paymentMethodsData] = await Promise.all([servicesPromise, paymentMethodsPromise])
        
        if (Array.isArray(servicesData)) setServices(servicesData)
        if (paymentMethodsData?.success && Array.isArray(paymentMethodsData.paymentMethods)) {
          setPaymentMethods(paymentMethodsData.paymentMethods)
        }
      } catch (error) {
        console.error("Failed to fetch initial booking data:", error)
        toast({ title: "Error", description: "Could not load booking information.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [toast])

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]
  const selectedServiceData = services.find((s) => s._id === selectedService)
  const price = selectedServiceData && selectedDuration ? selectedServiceData.prices[parseInt(selectedDuration)] : 0
  const totalPrice = price

  // Show services and filter therapists based on client gender and service
  const filteredServices = services
  const therapists = selectedServiceData?.models?.filter(model => model.gender === therapistPreference) || []

  const handleSubmitAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);

    try {
      // Step 1: Save the booking to your database first
      const bookingData = {
        clientName: clientInfo.name, 
        clientEmail: clientInfo.email, 
        clientPhone: clientInfo.phone,
        clientGender: clientInfo.gender, 
        serviceId: selectedService, 
        serviceName: selectedServiceData?.name,
        duration: parseInt(selectedDuration), 
        price: totalPrice, 
        date: selectedDate, 
        time: selectedTime,
        notes, 
        paymentMethod: "pending", 
        model: selectedModel?.name,
        driverLicenseFrontUrl,
        driverLicenseBackUrl,
        paymentStatus: 'pending'
      };

      const response = await fetch("/api/bookings", {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to create booking.");
      }
      
      const bookingId = result.bookingId;
      setCurrentBookingId(bookingId);
      console.log(`Booking created with ID: ${bookingId}`);

      // Step 2: Show payment modal
      setPaymentModalOpen(true);

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDriverLicenseUpload = async (file: File, side: 'front' | 'back') => {
    const setUploading = side === 'front' ? setUploadingFront : setUploadingBack;
    const setUrl = side === 'front' ? setDriverLicenseFrontUrl : setDriverLicenseBackUrl;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUrl(result.fileUrl);
        toast({
          title: "Upload Successful",
          description: `Driver license ${side} uploaded successfully`
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCameraCapture = async (side: 'front' | 'back') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Create a simple camera interface
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0);
        
        // Convert to blob and upload
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `license-${side}-${Date.now()}.jpg`, { type: 'image/jpeg' });
            await handleDriverLicenseUpload(file, side);
          }
          stream.getTracks().forEach(track => track.stop());
        }, 'image/jpeg', 0.8);
      });
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera",
        variant: "destructive"
      });
    }
  };

  const handlePaymentComplete = (paymentMethod: PaymentMethod, reference: string) => {
    setSelectedPaymentMethod(paymentMethod);
    setTransactionReference(reference);
    setPaymentModalOpen(false);
    setBookingComplete(true);
    
    toast({
      title: "Payment Successful!",
      description: "Your booking has been confirmed. You will receive a confirmation email shortly."
    });
  };

  const handlePaymentConfirmation = async () => {
    if (!currentBookingId || !selectedPaymentMethod) return;
    
    setPaymentStatus('processing');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update booking payment status
      const response = await fetch(`/api/admin/bookings/${currentBookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: 'paid',
          paymentMethod: selectedPaymentMethod.type,
          paymentDetails: {
            methodId: selectedPaymentMethod._id,
            reference: `${selectedPaymentMethod.type.toUpperCase()}-${Date.now()}`,
            confirmedAt: new Date()
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }
      
      setPaymentStatus('success');
      setTransactionReference(`${selectedPaymentMethod.type.toUpperCase()}-${Date.now()}`);
      setTimeout(() => {
        setBookingComplete(true);
      }, 1500);
      
    } catch (error) {
      console.error('Payment confirmation error:', error);
      setPaymentStatus('failed');
      toast({
        title: "Payment Error",
        description: "Could not confirm your payment. Please try again.",
        variant: "destructive"
      });
    }
  }

  const resetForm = () => {
    setSelectedDate(undefined)
    setSelectedTime("")
    setSelectedService("")
    setSelectedDuration("")
    setClientInfo({ name: "", email: "", phone: "", gender: "" })
    setNotes("")
    setSelectedModel(null)
    setSelectedPaymentMethod(null)
    setPaymentStatus('pending')
    setTransactionReference("")
    setBookingComplete(false)
    setCurrentBookingId(null)
    setDriverLicenseFrontFile(null)
    setDriverLicenseBackFile(null)
    setDriverLicenseFrontUrl('')
    setDriverLicenseBackUrl('')
    setStep('gender')
  }

  const isFormValid =
    !!selectedDate && 
    !!selectedTime && 
    !!selectedService && 
    !!selectedDuration && 
    clientInfo.name.trim() !== "" && 
    clientInfo.email.trim() !== "" &&
    clientInfo.phone.trim() !== "" && 
    !!clientInfo.gender &&
    !!driverLicenseFrontUrl &&
    !!driverLicenseBackUrl &&
    (!selectedServiceData?.models?.length || !!selectedModel)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Loading Booking Form...</h1>
        </div>
        <Footer />
      </div>
    )
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <PartyPopper className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Booking Complete!</h1>
          <p className="mt-2 text-gray-600">
            Your payment was successful and your appointment is confirmed.
            You will receive a confirmation email shortly.
          </p>
          <Button className="mt-6" onClick={resetForm}>Book Another Session</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (step === 'gender') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Select Your Preference</h1>
            <p className="text-xl text-gray-600">Choose your preferred therapist gender to continue</p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <Label className="block text-lg font-medium text-gray-900 mb-4">
                    I would prefer a:
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={therapistPreference === 'female' ? 'default' : 'outline'}
                      size="lg"
                      className="h-24 flex-col gap-2"
                      onClick={() => setTherapistPreference('female')}
                    >
                      <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                        <span className="text-2xl">♀</span>
                      </div>
                      Female Therapist
                    </Button>
                    <Button
                      variant={therapistPreference === 'male' ? 'default' : 'outline'}
                      size="lg"
                      className="h-24 flex-col gap-2"
                      onClick={() => setTherapistPreference('male')}
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-2xl">♂</span>
                      </div>
                      Male Therapist
                    </Button>
                  </div>
                </div>

                {therapistPreference && (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setStep('booking')}
                  >
                    Continue to Booking
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
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
          <p className="text-xl text-gray-600">Schedule your relaxing massage therapy session</p>
        </div>

        <form className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><CalendarDays className="w-5 h-5 mr-2" />Select Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="service">Massage Type</Label>
                    <Select value={selectedService} onValueChange={(value) => {
                      setSelectedService(value)
                      setSelectedDuration("")
                      setSelectedModel(null)
                    }}>
                      <SelectTrigger id="service"><SelectValue placeholder="Choose a massage type" /></SelectTrigger>
                      <SelectContent>
                        {filteredServices.map((service) => (
                          <SelectItem 
                            key={service._id?.toString() || service.name} 
                            value={service._id || ""}
                          >
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedServiceData && (
                    <>
                      <div>
                        <Label htmlFor="duration">Session Duration</Label>
                        <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                          <SelectTrigger id="duration"><SelectValue placeholder="Choose duration" /></SelectTrigger>
                          <SelectContent>
                            {selectedServiceData.duration.map((duration) => (
                              <SelectItem key={duration} value={duration.toString()}>
                                {duration} minutes - ${selectedServiceData.prices[duration]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Therapist Selection with larger images */}
                      {selectedServiceData.models && selectedServiceData.models.length > 0 && (
                        <div>
                          <Label>Select Therapist</Label>
                          <div className="grid grid-cols-1 gap-4 mt-2">
{therapists.map((model, index) => (
                                <div
                                  key={index}
                                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                    selectedModel?.name === model.name 
                                      ? 'border-primary bg-primary/10' 
                                      : 'border-gray-200'
                                  }`}
                                  onClick={() => setSelectedModel(model)}
                                >
                                  <div className="flex items-center">
                                    {model.imageUrl ? (
                                      <img 
                                        src={model.imageUrl} 
                                        alt={model.name} 
                                        className="w-32 h-32 object-cover rounded-lg mr-4"
                                      />
                                    ) : (
                                      <div className="bg-gray-200 border-2 border-dashed rounded-lg w-32 h-32 mr-4" />
                                    )}
                                    <div>
                                      <div className="font-medium text-lg">{model.name}</div>
                                      <div className="text-sm text-gray-500 capitalize">{model.gender}</div>
                                      <div className="mt-2 text-sm">
                                        <span className="font-medium">Specializes in:</span> {selectedServiceData.name}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Clock className="w-5 h-5 mr-2" />Select Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Preferred Date</Label>
                    <ClientOnly>
                      <Calendar 
                        mode="single" 
                        selected={selectedDate} 
                        onSelect={setSelectedDate} 
                        disabled={(date) => {
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today || date.getDay() === 0
                        }} 
                        className="rounded-md border"
                      />
                    </ClientOnly>
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
            <div className="space-y-6">
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
                      required
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
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={clientInfo.phone} 
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })} 
                      placeholder="480-287-2633" 
                      required
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select 
                      value={clientInfo.gender} 
                      onValueChange={(value) => setClientInfo({ ...clientInfo, gender: value })}
                    >
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <Label>Driver License (Required - Both Sides)</Label>
                    
                    {/* Front Side */}
                    <div>
                      <Label className="text-sm font-medium">Front Side</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setDriverLicenseFrontFile(file);
                              handleDriverLicenseUpload(file, 'front');
                            }
                          }}
                          disabled={uploadingFront}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCameraCapture('front')}
                          disabled={uploadingFront}
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      </div>
                      {uploadingFront && (
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Uploading front...
                        </div>
                      )}
                      {driverLicenseFrontUrl && (
                        <div className="flex items-center text-sm text-green-600 mt-1">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Front uploaded successfully
                        </div>
                      )}
                    </div>

                    {/* Back Side */}
                    <div>
                      <Label className="text-sm font-medium">Back Side</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setDriverLicenseBackFile(file);
                              handleDriverLicenseUpload(file, 'back');
                            }
                          }}
                          disabled={uploadingBack}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCameraCapture('back')}
                          disabled={uploadingBack}
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      </div>
                      {uploadingBack && (
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Uploading back...
                        </div>
                      )}
                      {driverLicenseBackUrl && (
                        <div className="flex items-center text-sm text-green-600 mt-1">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Back uploaded successfully
                        </div>
                      )}
                    </div>
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
            </div>
          </div>
          
{selectedDate && selectedService && price > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div><div className="text-sm text-gray-600">Service</div><div className="font-medium">{selectedServiceData?.name}</div></div>
                  <div><div className="text-sm text-gray-600">Duration</div><div className="font-medium">{selectedDuration} minutes</div></div>
                  <div><div className="text-sm text-gray-600">Date & Time</div><div className="font-medium">{format(selectedDate, "MMMM d, yyyy")} at {selectedTime}</div></div>
                  <div><div className="text-sm text-gray-600">Total</div><div className="font-medium text-lg">${totalPrice}</div></div>
                  {selectedModel && (
                    <div>
                      <div className="text-sm text-gray-600">Therapist</div>
                      <div className="font-medium flex items-center gap-2">
                        {selectedModel.imageUrl && (
                          <img 
                            src={selectedModel.imageUrl} 
                            alt={selectedModel.name} 
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        {selectedModel.name}
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg" 
                  disabled={!isFormValid || isSubmitting}
                  onClick={handleSubmitAndPay}
                >
                  {isSubmitting ? "Processing..." : `Confirm & Proceed to Pay - $${totalPrice}`}
                </Button>
              </CardContent>
            </Card>
          )}
        </form>

        <Button 
          variant="ghost" 
          className="mt-6"
          onClick={() => setStep('gender')}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Gender Selection
        </Button>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        amount={totalPrice}
        bookingId={currentBookingId}
        serviceName={selectedServiceData?.name || ""}
        onPaymentComplete={handlePaymentComplete}
      />
      
      <Footer />
    </div>
  )
}