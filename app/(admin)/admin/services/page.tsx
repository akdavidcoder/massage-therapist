"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Clock, DollarSign, Eye, EyeOff, Search } from "lucide-react"
import type { Service } from "@/lib/types"

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    benefits: [""],
    duration: [60],
    prices: { 60: 120 },
    image: "",
    available: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services")
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else {
        throw new Error("Failed to fetch services")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingService ? `/api/admin/services/${editingService._id}` : "/api/admin/services"
      const method = editingService ? "PUT" : "POST"

      // Filter out empty benefits
      const cleanedBenefits = formData.benefits.filter((benefit) => benefit.trim() !== "")

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          benefits: cleanedBenefits,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Service ${editingService ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchServices()
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to save service")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save service",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      benefits: service.benefits.length > 0 ? service.benefits : [""],
      duration: service.duration,
      prices: service.prices,
      image: service.image || "",
      available: service.available,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Service deleted successfully",
        })
        fetchServices()
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete service")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete service",
        variant: "destructive",
      })
    }
  }

  const toggleAvailability = async (service: Service) => {
    try {
      const response = await fetch(`/api/admin/services/${service._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...service,
          available: !service.available,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Service ${!service.available ? "enabled" : "disabled"} successfully`,
        })
        fetchServices()
      } else {
        throw new Error("Failed to update service")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service availability",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      benefits: [""],
      duration: [60],
      prices: { 60: 120 },
      image: "",
      available: true,
    })
    setEditingService(null)
  }

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, ""],
    })
  }

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...formData.benefits]
    newBenefits[index] = value
    setFormData({
      ...formData,
      benefits: newBenefits,
    })
  }

  const removeBenefit = (index: number) => {
    if (formData.benefits.length > 1) {
      const newBenefits = formData.benefits.filter((_, i) => i !== index)
      setFormData({
        ...formData,
        benefits: newBenefits,
      })
    }
  }

  const addDuration = () => {
    const newDuration = 30
    if (!formData.duration.includes(newDuration)) {
      setFormData({
        ...formData,
        duration: [...formData.duration, newDuration].sort((a, b) => a - b),
        prices: {
          ...formData.prices,
          [newDuration]: 80,
        },
      })
    }
  }

  const removeDuration = (duration: number) => {
    if (formData.duration.length > 1) {
      const newDuration = formData.duration.filter((d) => d !== duration)
      const newPrices = { ...formData.prices }
      delete newPrices[duration]
      setFormData({
        ...formData,
        duration: newDuration,
        prices: newPrices,
      })
    }
  }

  const updatePrice = (duration: number, price: number) => {
    setFormData({
      ...formData,
      prices: {
        ...formData.prices,
        [duration]: price,
      },
    })
  }

  const filteredServices = services.filter((service) => service.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-muted-foreground">Manage your massage therapy services, pricing, and availability</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
              <DialogDescription>
                {editingService ? "Update the service details below." : "Create a new massage therapy service."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Swedish Massage"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the massage technique and its purpose..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image URL (Optional)</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Benefits */}
              <div>
                <Label>Benefits</Label>
                <div className="space-y-2 mt-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) => updateBenefit(index, e.target.value)}
                        placeholder="Enter a benefit..."
                      />
                      {formData.benefits.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeBenefit(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Benefit
                  </Button>
                </div>
              </div>

              {/* Duration & Pricing */}
              <div>
                <Label>Duration & Pricing</Label>
                <div className="space-y-3 mt-2">
                  {formData.duration.map((duration) => (
                    <div key={duration} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{duration} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={formData.prices[duration] || 0}
                          onChange={(e) => updatePrice(duration, Number.parseInt(e.target.value))}
                          className="w-24"
                          min="0"
                        />
                      </div>
                      {formData.duration.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeDuration(duration)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2">
                    {[30, 45, 60, 90, 120].map((duration) => (
                      <Button
                        key={duration}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!formData.duration.includes(duration)) {
                            setFormData({
                              ...formData,
                              duration: [...formData.duration, duration].sort((a, b) => a - b),
                              prices: {
                                ...formData.prices,
                                [duration]:
                                  duration === 30
                                    ? 80
                                    : duration === 45
                                      ? 100
                                      : duration === 60
                                        ? 120
                                        : duration === 90
                                          ? 180
                                          : 240,
                              },
                            })
                          }
                        }}
                        disabled={formData.duration.includes(duration)}
                      >
                        Add {duration}min
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
                <Label htmlFor="available">Service Available</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingService ? "Update Service" : "Create Service"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredServices.length} of {services.length} services
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service._id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={service.available ? "default" : "secondary"}>
                    {service.available ? "Available" : "Disabled"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAvailability(service)}
                    title={service.available ? "Disable service" : "Enable service"}
                  >
                    {service.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">{service.description}</p>

              {/* Benefits */}
              {service.benefits.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {service.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {benefit}
                      </li>
                    ))}
                    {service.benefits.length > 3 && (
                      <li className="text-xs text-muted-foreground">+{service.benefits.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Duration & Pricing */}
              <div>
                <h4 className="font-medium text-sm mb-2">Pricing:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.duration.map((duration) => (
                    <div key={duration} className="bg-muted rounded-md px-2 py-1 text-xs">
                      {duration}min - ${service.prices[duration]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Service</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{service.name}"? This action cannot be undone and will fail if
                        there are existing bookings for this service.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(service._id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Service
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchTerm ? "No services found matching your search." : "No services created yet."}
          </div>
          {!searchTerm && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Service
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
