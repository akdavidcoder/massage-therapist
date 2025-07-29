import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star, Clock, MapPin, Sparkles, Leaf, Phone } from "lucide-react"

export default function HomePage() {
  const services = [
    {
      name: "Swedish Massage",
      description: "Gentle, relaxing massage using long strokes and kneading",
      duration: "60-90 min",
      price: "From $120",
      image: "https://images.fresha.com/lead-images/placeholders/massage-52.jpg?class=venue-gallery-mobile",
    },
    {
      name: "Deep Tissue Massage",
      description: "Target deep muscle layers to relieve chronic tension",
      duration: "60-90 min",
      price: "From $140",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDScO4fXUzdl7ikPfh65b-9wf0L60a4bABIQ&s",
    },
    {
      name: "Aromatherapy Massage",
      description: "Essential oils combined with therapeutic massage",
      duration: "60-90 min",
      price: "From $150",
      image: "https://media.post.rvohealth.io/wp-content/uploads/2024/09/masseuse-using-massage-oil-732x549-thumbnail.jpg",
    },
    {
      name: "Reflexology",
      description: "Pressure point therapy focused on feet and hands",
      duration: "45-60 min",
      price: "From $100",
      image: "https://zenmassageusa.com/wp-content/uploads/2023/04/MassageSafety-e1682085389609.jpg",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Sophia has magical hands! My chronic back pain disappeared after just three sessions.",
      service: "Deep Tissue Massage",
    },
    {
      name: "Michael Chen",
      rating: 5,
      text: "The most relaxing and professional massage experience I've ever had. Highly recommended!",
      service: "Swedish Massage",
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      text: "The aromatherapy massage was pure bliss. I felt completely rejuvenated afterwards.",
      service: "Aromatherapy Massage",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://zenmassageusa.com/wp-content/uploads/2023/04/MassageSafety-e1682085389609.jpg"
            alt="Calming spa atmosphere with stones and candles"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Relax. <span className="text-primary">Heal.</span> Rejuvenate.
          </h1>
          <div className="text-xl md:text-2xl text-white/90 mb-4 max-w-2xl mx-auto">
            <p>
              Experience professional massage therapy with Sophia, a licensed therapist with over 10 years of
              experience.
            </p>
            <p className="mt-2">Dedicated to your wellness journey through the healing power of therapeutic touch.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" className="text-lg px-8 py-4">
              <Link href="/booking">Book Your Massage</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              <Link href="/about">Learn About Sophia</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">About Sophia</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Wellness Journey Starts Here</h2>
              <p className="text-gray-700 text-lg mb-6">
                With over 10 years of experience in therapeutic massage, I'm passionate about helping clients achieve
                optimal wellness through the healing power of touch. Licensed and certified, I specialize in various
                massage techniques tailored to your unique needs.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Licensed Professional</h3>
                    <p className="text-gray-600 text-sm">Fully certified & insured</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Holistic Approach</h3>
                    <p className="text-gray-600 text-sm">Mind, body & spirit healing</p>
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link href="/about">Learn More About Me</Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src="https://images.fresha.com/lead-images/placeholders/massage-52.jpg?class=venue-gallery-mobile"
                alt="Sophia - Professional Massage Therapist"
                width={500}
                height={600}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Our Services</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Therapeutic Massage Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our range of professional massage therapies, each designed to address your specific wellness
              needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={service.image || "/placeholder.svg?height=300&width=400&query=massage therapy"}
                    alt={service.name}
                    width={400}
                    height={300}
                    className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration}
                    </div>
                    <span className="font-semibold text-primary">{service.price}</span>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline" asChild>
                    <Link href={`/services#${service.name.toLowerCase().replace(/\s+/g, "-")}`}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.service}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/testimonials">Read All Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Location & Map Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Visit Our Studio</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Conveniently Located in the Heart of the City</h2>
              <p className="text-gray-700 text-lg mb-6">
                Our peaceful studio provides the perfect environment for your massage therapy session. We also offer
                home visits for your convenience.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-semibold">123 Wellness Street</div>
                    <div className="text-gray-600">Spa City, CA 90210</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-semibold">Business Hours</div>
                    <div className="text-gray-600">Mon-Sat: 9AM-7PM, Sun: Closed</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-semibold">(555) 123-4567</div>
                    <div className="text-gray-600">Call or text for appointments</div>
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link href="/contact">Get Directions</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Interactive Map</p>
                  <p className="text-sm text-gray-400">123 Wellness Street, Spa City, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Begin Your Wellness Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your appointment today and experience the healing power of professional massage therapy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" variant="secondary">
              <Link href="/booking">Book Appointment</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary bg-transparent"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-lg">
            <div className="flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              <span>Studio & Home Visits Available</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-6 h-6 mr-2" />
              <span>Flexible Scheduling</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
