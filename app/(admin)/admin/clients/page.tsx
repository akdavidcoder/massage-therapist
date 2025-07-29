"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Users, Mail, Phone } from "lucide-react"
import { format } from "date-fns"

interface Client {
  _id: string
  name: string
  email: string
  phone: string
  gender: string
  lastVisit: string
  bookingCount: number
  totalSpent: number
  createdAt: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/admin/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data.clients)
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm),
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Badge variant="outline">{filteredClients.length} total clients</Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client._id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback>{client.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">{client.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-2" />
                      {client.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-2" />
                      {client.phone}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm">
                      <div className="font-medium">{client.bookingCount} bookings</div>
                      <div className="text-muted-foreground">${client.totalSpent} spent</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {client.gender}
                    </Badge>
                  </div>
                  {client.lastVisit && (
                    <div className="text-xs text-muted-foreground">
                      Last visit: {format(new Date(client.lastVisit), "MMM d, yyyy")}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No clients found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search criteria." : "No clients have been registered yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
