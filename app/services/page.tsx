import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Clock, DollarSign, Check, Star } from "lucide-react"

export default async function ServicesPage() {
  let services = []

  try {
    // Fetch services from API (this will be a server-side fetch)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/services`, {
      cache: "no-store", // Ensure fresh data
    })
    if (response.ok) {
      services = await response.json()
    }
  } catch (error) {
    console.error("Failed to fetch services:", error)
    // Fallback to empty array, component will handle empty state
  }

  const packages = [
    {
      name: "Wellness Package",
      description: "4 sessions of any 60-minute massage",
      originalPrice: 480,
      packagePrice: 400,
      savings: 80,
      sessions: 4,
      duration: 60,
    },
    {
      name: "Deep Relaxation Package",
      description: "3 sessions of 90-minute massages",
      originalPrice: 540,
      packagePrice: 450,
      savings: 90,
      sessions: 3,
      duration: 90,
    },
    {
      name: "Monthly Maintenance",
      description: "2 sessions per month (60 min each)",
      originalPrice: 240,
      packagePrice: 200,
      savings: 40,
      sessions: 2,
      duration: 60,
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Professional Massage Services</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Discover our comprehensive range of therapeutic massage services, each designed to address your unique
            wellness needs and promote healing.
          </p>
          <Button asChild size="lg">
            <Link href="/booking">Book Your Session</Link>
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
              >
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="relative">
                    {service.popular && (
                      <Badge className="absolute -top-2 -left-2 z-10 bg-orange-500">Most Popular</Badge>
                    )}
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg w-full"
                    />
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h2>
                  <p className="text-gray-700 text-lg mb-6">{service.fullDescription}</p>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Benefits:</h3>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Duration & Pricing:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {service.duration.map((duration) => (
                        <div key={duration} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Clock className="w-4 h-4 text-primary mr-1" />
                            <span className="font-medium">{duration} min</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-gray-600" />
                            <span className="text-lg font-bold text-gray-900">{service.prices[duration]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button asChild>
                    <Link href={`/booking?service=${service.id}`}>Book This Service</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Deals */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Package Deals</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Save money with our massage packages designed for regular wellness maintenance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Save ${pkg.savings}
                  </Badge>
                </div>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <p className="text-gray-600">{pkg.description}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-3xl font-bold text-primary">${pkg.packagePrice}</span>
                      <span className="text-lg text-gray-500 line-through">${pkg.originalPrice}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {pkg.sessions} sessions × {pkg.duration} minutes each
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center text-sm">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>Valid for 6 months</span>
                    </div>
                    <div className="flex items-center justify-center text-sm">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>Transferable to family</span>
                    </div>
                    <div className="flex items-center justify-center text-sm">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>Flexible scheduling</span>
                    </div>
                  </div>

                  <Button className="w-full">Purchase Package</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
