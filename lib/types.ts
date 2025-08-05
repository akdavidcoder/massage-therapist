import { ObjectId } from 'mongodb'; // Import ObjectId

export interface User {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  gender: "male" | "female" | "other"
  createdAt: Date
  lastVisit?: Date
}

export type ServiceModel = {
  name: string;
  gender: 'male' | 'female';
  imageUrl: string;
};

export interface Service {
  _id?: ObjectId
  name: string
  description: string
  benefits: string[]
  duration: number[] // [30, 60, 90] minutes
  prices: { [key: number]: number } // {30: 80, 60: 120, 90: 180}
  image?: string
  available: boolean
  models: ServiceModel[]; // Add this line

  createdAt: Date
}

export interface Booking {
  _id: ObjectId
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientGender: "male" | "female" | "other"
  serviceId: string
  serviceName: string
  duration: number
  price: number
  date: Date
  time: string
  location: "studio" | "home"
  status: "pending" | "confirmed" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  paymentMethod: "crypto"
  walletAddress?: string
  cryptoAmount?: number
  model?: string // Added selected model
  notes?: string
  createdAt: Date
}

export interface Testimonial {
  _id: ObjectId
  clientName: string
  rating: number
  review: string
  serviceType: string
  verified: boolean
  createdAt: Date
}

export interface Admin {
  _id: ObjectId
  email: string
  password: string
  name: string
  createdAt: Date
}

export interface ContactMessage {
  _id: ObjectId
  name: string
  email: string
  message: string
  status: "unread" | "read" | "replied"
  createdAt: Date
}
