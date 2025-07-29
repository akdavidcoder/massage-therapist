import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Award, Heart, Users, Clock, Star, CheckCircle, Play } from "lucide-react"

export default function AboutPage() {
  const qualifications = [
    {
      title: "Licensed Massage Therapist",
      institution: "California Massage Therapy Council",
      year: "2014",
      type: "License",
    },
    {
      title: "Certified Aromatherapy Specialist",
      institution: "National Association for Holistic Aromatherapy",
      year: "2016",
      type: "Certification",
    },
    {
      title: "Deep Tissue Massage Certification",
      institution: "American Massage Therapy Association",
      year: "2015",
      type: "Certification",
    },
    {
      title: "Reflexology Practitioner",
      institution: "International Institute of Reflexology",
      year: "2017",
      type: "Certification",
    },
    {
      title: "Prenatal Massage Specialist",
      institution: "Body Therapy Institute",
      year: "2018",
      type: "Certification",
    },
  ]

  const achievements = [
    { icon: Users, label: "500+ Happy Clients", value: "500+" },
    { icon: Clock, label: "10+ Years Experience", value: "10+" },
    { icon: Star, label: "4.9/5 Average Rating", value: "4.9/5" },
    { icon: Award, label: "Licensed Professional", value: "Licensed" },
  ]

  const philosophy = [
    {
      title: "Holistic Healing",
      description:
        "I believe in treating the whole person, not just the symptoms. Every session is tailored to your unique needs.",
      icon: Heart,
    },
    {
      title: "Professional Excellence",
      description:
        "Continuous education and staying current with the latest techniques ensures you receive the best care.",
      icon: Award,
    },
    {
      title: "Safe Environment",
      description: "Creating a comfortable, respectful, and healing space where you can truly relax and rejuvenate.",
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
              <Badge className="mb-4">About Sophia</Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Your Wellness Journey Starts Here</h1>
              <p className="text-xl text-gray-700 mb-8">
                With over 10 years of experience in therapeutic massage, I'm passionate about helping clients achieve
                optimal wellness through the healing power of touch. Licensed and certified, I specialize in various
                massage techniques tailored to your unique needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/booking">Book Your Session</Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Welcome Video
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.fresha.com/lead-images/placeholders/massage-52.jpg?class=venue-gallery-mobile"
                alt="Sophia - Professional Massage Therapist"
                width={500}
                height={600}
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Bio Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">My Story</h2>
            <div className="space-y-6 text-gray-700">
              <p>
                My journey into massage therapy began over a decade ago when I experienced firsthand the transformative
                power of therapeutic touch during my own recovery from a sports injury. What started as personal healing
                became a calling to help others find relief, relaxation, and renewed vitality.
              </p>
              <p>
                After completing my initial certification in 2014, I've continuously expanded my expertise through
                advanced training in specialized techniques including deep tissue massage, aromatherapy, reflexology,
                and prenatal massage. I believe that learning never stops, and I regularly attend workshops and
                continuing education courses to stay current with the latest developments in massage therapy.
              </p>
              <p>
                Over the years, I've had the privilege of working with clients from all walks of life – from busy
                professionals seeking stress relief to athletes recovering from injuries, and expectant mothers looking
                for comfort during pregnancy. Each client brings unique needs and challenges, which is what makes this
                work so rewarding and keeps me passionate about what I do.
              </p>
              <p>
                My approach combines technical expertise with intuitive touch, always listening to what your body needs.
                I create a safe, comfortable environment where healing can happen naturally, and I'm committed to
                helping you achieve your wellness goals through personalized care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">By the Numbers</h2>
            <p className="text-xl text-gray-600">A decade of dedication to healing and wellness</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Qualifications & Certifications</h2>
            <p className="text-xl text-gray-600">Committed to professional excellence and continuous learning</p>
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
                      <p className="text-sm text-gray-500">Obtained: {qual.year}</p>
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
            <h2 className="text-3xl font-bold mb-4">My Philosophy & Mission</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              "I believe that healing happens when we create space for the body's natural ability to restore itself. My
              mission is to provide that space through skilled, compassionate touch and genuine care for each person's
              unique wellness journey."
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

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Begin Your Healing Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's work together to help you feel your best. Book your personalized massage therapy session today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/booking">Schedule Your Appointment</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent">
              <Link href="/contact">Ask a Question</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
