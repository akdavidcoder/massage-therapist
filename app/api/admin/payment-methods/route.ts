// app/api/admin/payment-methods/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export interface PaymentMethod {
  _id?: string
  name: string
  type: 'cashapp' | 'paypal' | 'crypto' | 'venmo' | 'zelle' | 'bank_transfer' | 'apple_pay' | 'google_pay' | 'stripe' | 'square'
  enabled: boolean
  details: {
    // For CashApp
    cashtag?: string
    // For PayPal
    paypalEmail?: string
    // For Crypto
    walletAddress?: string
    cryptoType?: string
    // For Venmo
    venmoHandle?: string
    // For Zelle
    zelleEmail?: string
    zellePhone?: string
    // For Bank Transfer
    bankName?: string
    accountNumber?: string
    routingNumber?: string
    accountHolderName?: string
    // For Apple Pay
    applePayEmail?: string
    applePayPhone?: string
    // For Google Pay
    googlePayEmail?: string
    googlePayPhone?: string
    // For Stripe
    stripeAccountId?: string
    stripePublishableKey?: string
    // For Square
    squareApplicationId?: string
    squareLocationId?: string
  }
  instructions?: string
  displayOrder: number
  createdAt?: Date
  updatedAt?: Date
}

// GET all payment methods
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const paymentMethods = await db
      .collection("payment_methods")
      .find({})
      .sort({ displayOrder: 1 })
      .toArray()

    return NextResponse.json({ success: true, paymentMethods })
  } catch (error) {
    console.error("Get Payment Methods Error:", error)
    return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 })
  }
})

// POST create new payment method
export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")

    // Get the highest display order
    const lastMethod = await db
      .collection("payment_methods")
      .findOne({}, { sort: { displayOrder: -1 } })
    
    const newDisplayOrder = lastMethod ? lastMethod.displayOrder + 1 : 0

    const newPaymentMethod: PaymentMethod = {
      name: body.name,
      type: body.type,
      enabled: body.enabled ?? true,
      details: body.details || {},
      instructions: body.instructions || '',
      displayOrder: newDisplayOrder,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("payment_methods").insertOne(newPaymentMethod)

    return NextResponse.json({ 
      success: true, 
      paymentMethod: { ...newPaymentMethod, _id: result.insertedId } 
    })
  } catch (error) {
    console.error("Create Payment Method Error:", error)
    return NextResponse.json({ error: "Failed to create payment method" }, { status: 500 })
  }
})

// PUT update all payment methods (for bulk updates like reordering)
export const PUT = requireAdmin(async (request: NextRequest) => {
  try {
    const { paymentMethods } = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")

    // Update each payment method
    const updatePromises = paymentMethods.map((method: PaymentMethod) => 
      db.collection("payment_methods").updateOne(
        { _id: method._id },
        { 
          $set: {
            ...method,
            updatedAt: new Date()
          }
        }
      )
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update Payment Methods Error:", error)
    return NextResponse.json({ error: "Failed to update payment methods" }, { status: 500 })
  }
})
