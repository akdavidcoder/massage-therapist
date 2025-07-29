"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, ExternalLink } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for your message. We'll get back to you within 24 hours.",
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or call us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "(555) 123-4567",
      description: "Call or text for appointments",
      action: "tel:+15551234567",
      actionText: "Call Now",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      details: "(555) 123-4567",
      description: "Quick messaging for appointments",
      action: "https://wa.me/15551234567",
      actionText: "Message on WhatsApp",
    },
    {
      icon: Mail,
      title: "Email",
      details: "sophia@massagetherapy.com",
      description: "We respond within 24 hours",
      action: "mailto:sophia@massagetherapy.com",
      actionText: "Send Email",
    },
    {
      icon: MapPin,
      title: "Studio Address",
      details: "123 Wellness Street, Spa City, CA 90210",
      description: "Convenient downtown location",
      action: "https://maps.google.com/?q=123+Wellness+Street+Spa+City+CA",
      actionText: "Get Directions",
    },
  ]

  const businessHours = [
    { day: "Monday", hours: "9:00 AM - 7:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 7:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 7:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 7:00 PM" },
    { day: "Friday", hours: "9:00 AM - 7:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4">Get in Touch</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Sophia</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Have questions about our services? Ready to book your appointment? We're here to help you on your wellness
            journey.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <info.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-700 font-medium mb-1">{info.details}</p>
                  <p className="text-sm text-gray-600 mb-4">{info.description}</p>
                  <Button asChild variant="outline" size="sm">
                    <a href={info.action} target="_blank" rel="noopener noreferrer">
                      {info.actionText}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What can we help you with?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your needs, questions, or how we can help you..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>

                    <p className="text-sm text-gray-600 text-center">
                      We typically respond within 24 hours. For urgent matters, please call us directly.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map and Business Hours */}
            <div className="space-y-8">
              {/* Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Find Our Studio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Interactive Map</p>
                      <p className="text-sm text-gray-400">123 Wellness Street</p>
                      <p className="text-sm text-gray-400">Spa City, CA 90210</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">Studio Location</p>
                    <p className="text-gray-700">123 Wellness Street</p>
                    <p className="text-gray-700">Spa City, CA 90210</p>
                    <p className="text-sm text-gray-600">
                      Convenient downtown location with free parking available. Easily accessible by public
                      transportation.
                    </p>
                  </div>
                  <Button asChild className="w-full mt-4 bg-transparent" variant="outline">
                    <a
                      href="https://maps.google.com/?q=123+Wellness+Street+Spa+City+CA"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {businessHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">{schedule.day}</span>
                        <span
                          className={`${schedule.hours === "Closed" ? "text-red-600" : "text-gray-700"} font-medium`}
                        >
                          {schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> We also offer home visits by appointment. Evening and weekend appointments
                      may be available upon request.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I book an appointment?</h3>
                <p className="text-gray-700">
                  You can book online through our booking page, call us, or send a WhatsApp message. We'll confirm your
                  appointment within a few hours.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What should I expect during my first visit?</h3>
                <p className="text-gray-700">
                  We'll discuss your health history, goals, and preferences. Then you'll enjoy a customized massage
                  session in our peaceful studio environment.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer home visits?</h3>
                <p className="text-gray-700">
                  Yes! We provide home visits for an additional fee. This is perfect for those who prefer the comfort of
                  their own space.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-700">
                  We accept cryptocurrency payments for secure, private transactions. Payment is processed through our
                  secure booking system.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How far in advance should I book?</h3>
                <p className="text-gray-700">
                  We recommend booking at least 48 hours in advance, especially for weekend appointments. However, we
                  often have same-day availability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What's your cancellation policy?</h3>
                <p className="text-gray-700">
                  Please provide at least 24 hours notice for cancellations. This allows us to offer the time slot to
                  other clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
