// app/about/page.tsx
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Award, Heart, Users, Clock, Star, CheckCircle, Play, Globe } from "lucide-react"

export default function AboutPage() {
  const qualifications = [
    {
      title: "Licensed Wellness Institution",
      institution: "Swiss Federal Office of Public Health (FOPH)",
      year: "2013",
      type: "License",
    },
    {
      title: "Holistic Therapy Accreditation",
      institution: "International Council for Wellness and Healing (ICWH)",
      year: "2015",
      type: "Certification",
    },
    {
      title: "Advanced Manual Therapy Program",
      institution: "Zurich Institute of Massage Science",
      year: "2016",
      type: "Certification",
    },
    {
      title: "Global Spa & Wellness Compliance",
      institution: "World Wellness Federation",
      year: "2018",
      type: "Certification",
    },
    {
      title: "Therapeutic Aromatherapy Diploma",
      institution: "Swiss Aromatherapy Guild",
      year: "2019",
      type: "Certification",
    },
  ]

  const achievements = [
    { icon: Users, label: "10,000+ Global Clients", value: "10,000+" },
    { icon: Clock, label: "12+ Years of Service", value: "12+" },
    { icon: Star, label: "Rated 4.9/5 Worldwide", value: "4.9/5" },
    { icon: Globe, label: "Centers in 4 Countries", value: "4+" },
  ]

  const philosophy = [
    {
      title: "Science Meets Soul",
      description:
        "We blend Swiss precision with holistic methodologies to deliver a personalized healing experience that transcends borders.",
      icon: Heart,
    },
    {
      title: "Global Standards, Local Care",
      description:
        "Our certified practitioners across Switzerland, Canada, the USA, and Australia follow world-class therapeutic standards tailored to local needs.",
      icon: Award,
    },
    {
      title: "Safe, Inclusive Healing Spaces",
      description: "Each of our centers promotes a welcoming and professional environment for all individuals seeking healing and renewal.",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">About Melhot Aesthetic International</Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Global Wellness, Rooted in Switzerland</h1>
              <p className="text-xl text-gray-700 mb-8">
                Melhot Aesthetic International is a Swiss-based holistic wellness company with centers in Canada, USA, and
                Australia. We specialize in integrative massage therapies, using certified techniques and cutting-edge
                approaches to support your wellness journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/booking">Book a Session</Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Brand Video
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.fresha.com/lead-images/placeholders/massage-52.jpg?class=venue-gallery-mobile"
                alt="Melhot Aesthetic Global Massage"
                width={500}
                height={600}
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-primary">12+</div>
                <div className="text-sm text-gray-600">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
            <div className="space-y-6 text-gray-700">
              <p>
                Founded in the heart of Switzerland, Melhot Aesthetic International was born from a desire to make healing
                accessible, scientific, and deeply human. Our founders combined medical insight with holistic
                philosophy, aiming to transform how people experience wellness globally.
              </p>
              <p>
                Over the years, we have expanded into Canada, the United States, and Australia, bringing our Swiss
                standards and personalized care to a global community. Each branch is staffed by certified professionals
                trained under our unified protocols.
              </p>
              <p>
                Our services have empowered athletes, professionals, expecting mothers, and everyday individuals to
                reclaim balance, health, and vitality. Through our global team, we provide continuity of care whether
                you're in Zurich, Toronto, Sydney, or San Francisco.
              </p>
              <p>
                Melhot Aesthetic is more than a wellness provider — we are your lifelong partner in healing, offering you the
                highest standard of care wherever you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Global Impact</h2>
            <p className="text-xl text-gray-600">Proven wellness. Trusted worldwide.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <achievement.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{achievement.value}</div>
                  <div className="text-gray-600">{achievement.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Global Certifications</h2>
            <p className="text-xl text-gray-600">World-class training, international recognition</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {qualifications.map((qual, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{qual.title}</h3>
                        <Badge variant="outline">{qual.type}</Badge>
                      </div>
                      <p className="text-gray-600 mb-1">{qual.institution}</p>
                      <p className="text-sm text-gray-500">Issued: {qual.year}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy & Mission */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Philosophy & Mission</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              "To elevate global well-being by integrating the wisdom of nature, the precision of science, and the
              compassion of human touch — one healing experience at a time."
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophy.map((item, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <item.icon className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="opacity-90">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the Melhot Aesthetic Experience</h2>
          <p className="text-xl text-gray-600 mb-8">
            Book your wellness session with any of our international branches. Let us help you feel renewed, centered,
            and energized.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/booking">Book Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent">
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
