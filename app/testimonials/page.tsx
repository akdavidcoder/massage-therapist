import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { Star, Quote, Users, Heart, MessageSquare } from "lucide-react"

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      service: "Deep Tissue Massage",
      date: "2 weeks ago",
      review:
        "Sophia has magical hands! I came to her with chronic back pain that had been bothering me for months. After just three sessions, the pain has significantly reduced. Her technique is incredible and she really listens to what your body needs. The studio atmosphere is so calming and professional. I can't recommend her enough!",
      verified: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      service: "Swedish Massage",
      date: "1 month ago",
      review:
        "The most relaxing and professional massage experience I've ever had. Sophia creates such a peaceful environment and her Swedish massage technique is perfect for stress relief. I left feeling completely rejuvenated and have been sleeping so much better since my session. Will definitely be returning regularly!",
      verified: true,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      service: "Aromatherapy Massage",
      date: "3 weeks ago",
      review:
        "The aromatherapy massage was pure bliss! Sophia carefully selected essential oils based on my needs and the combination with her skilled massage technique was incredible. I felt completely relaxed and the stress just melted away. The scents were divine and I felt the benefits for days afterward.",
      verified: true,
    },
    {
      id: 4,
      name: "David Thompson",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      service: "Reflexology",
      date: "1 week ago",
      review:
        "I was skeptical about reflexology at first, but Sophia explained everything so well and the results speak for themselves. My chronic headaches have improved dramatically and I feel more balanced overall. Her knowledge of pressure points is impressive and the session was incredibly relaxing.",
      verified: true,
    },
    {
      id: 5,
      name: "Lisa Park",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      service: "Prenatal Massage",
      date: "2 months ago",
      review:
        "As a first-time mom, I was nervous about prenatal massage, but Sophia made me feel so comfortable and safe. She's clearly experienced with pregnancy massage and knew exactly how to position me and which techniques to use. It helped so much with my back pain and swelling. Highly recommend to any expecting mothers!",
      verified: true,
    },
    {
      id: 6,
      name: "Robert Kim",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      service: "Hot Stone Massage",
      date: "3 weeks ago",
      review:
        "The hot stone massage was an amazing experience. Sophia's technique with the heated stones was perfect - not too hot, but just right to melt away all the tension in my muscles. The combination of the stones and her massage skills created the most relaxing hour I've had in years. Absolutely therapeutic!",
      verified: true,
    },
  ]

  const stats = [
    { icon: Users, label: "Happy Clients", value: "500+" },
    { icon: Star, label: "Average Rating", value: "4.9/5" },
    { icon: MessageSquare, label: "Reviews", value: "200+" },
    { icon: Heart, label: "Satisfaction Rate", value: "98%" },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4">Client Testimonials</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">What Our Clients Say</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Real experiences from real people who have found healing, relaxation, and wellness through our massage
            therapy services.
          </p>
          <Button asChild size="lg">
            <Link href="/booking">Experience It Yourself</Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                        {testimonial.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{testimonial.service}</p>
                      <p className="text-xs text-gray-500">{testimonial.date}</p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <div className="relative">
                    <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-2" />
                    <p className="text-gray-700 italic pl-6">{testimonial.review}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Share Your Experience Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Share Your Experience</h2>
            <p className="text-xl text-gray-600">
              Help others discover the benefits of massage therapy by sharing your experience with Sophia.
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="service">Service Received</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="swedish">Swedish Massage</SelectItem>
                        <SelectItem value="deep-tissue">Deep Tissue Massage</SelectItem>
                        <SelectItem value="aromatherapy">Aromatherapy Massage</SelectItem>
                        <SelectItem value="reflexology">Reflexology</SelectItem>
                        <SelectItem value="hot-stone">Hot Stone Massage</SelectItem>
                        <SelectItem value="prenatal">Prenatal Massage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rating">Your Rating</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Rate your experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                        <SelectItem value="2">⭐⭐ Fair</SelectItem>
                        <SelectItem value="1">⭐ Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Share your experience with Sophia's massage therapy services..."
                    rows={5}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="consent" className="rounded" />
                  <Label htmlFor="consent" className="text-sm">
                    I consent to having my review published on the website and marketing materials.
                  </Label>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Submit Your Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Own Success Story?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join hundreds of satisfied clients who have found relief, relaxation, and renewed vitality through our
            massage therapy services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/booking">Book Your First Session</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary bg-transparent"
            >
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
