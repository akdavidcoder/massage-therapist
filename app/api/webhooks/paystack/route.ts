// app/api/webhooks/paystack/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    console.error("Paystack secret key is not set.");
    return new NextResponse("Configuration error", { status: 500 });
  }

  // 1. Get the request body as text (important for verification)
  const requestBody = await req.text();
  
  // 2. Get the signature from the headers
  const signature = req.headers.get('x-paystack-signature');

  if (!signature) {
    console.error("No Paystack signature found in headers.");
    return new NextResponse("No signature", { status: 400 });
  }

  // 3. Verify the webhook signature
  const hash = crypto
    .createHmac('sha512', secret)
    .update(requestBody)
    .digest('hex');

  if (hash !== signature) {
    console.error("Invalid Paystack signature.");
    return new NextResponse("Invalid signature", { status: 401 });
  }
  
  // 4. Parse the body as JSON now that it's verified
  const event = JSON.parse(requestBody);

  // 5. Handle the successful charge event
  if (event.event === 'charge.success') {
    const { reference, status } = event.data;

    if (status === 'success') {
      try {
        console.log(`Payment successful for reference: ${reference}. Updating booking...`);

        if (!ObjectId.isValid(reference)) {
          console.error("Invalid ObjectId format for reference:", reference);
          return new NextResponse("Invalid reference ID", { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("massage_therapy");

        const result = await db.collection("bookings").updateOne(
          { _id: new ObjectId(reference) },
          { $set: { 
              paymentStatus: 'paid', // Or 'success'
              paymentDetails: event.data, // Store the full payment details from Paystack
              updatedAt: new Date()
            } 
          }
        );

        if (result.matchedCount === 0) {
          console.error(`No booking found with reference ID: ${reference}`);
        } else {
          console.log(`Booking ${reference} successfully updated to 'paid'.`);
          // You could also trigger a confirmation email here
        }

      } catch (error) {
        console.error("Webhook database update error:", error);
        return new NextResponse("Internal server error during DB update", { status: 500 });
      }
    }
  }

  // 6. Acknowledge receipt to Paystack
  return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
}