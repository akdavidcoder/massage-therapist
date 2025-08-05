// app/api/settings/wallet-address/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const SETTING_KEY = "companyWalletAddress";

// This is a public GET handler that anyone can access.
// The booking page will call this endpoint.
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("massage_therapy");
    const settingsCollection = db.collection("settings");

    // Find the one setting document using its key
    const walletSetting = await settingsCollection.findOne({ key: SETTING_KEY });

    // Return the address, or an empty string if it's not found
    return NextResponse.json({
      address: walletSetting?.value || "",
    });
  } catch (error) {
    console.error("Public API failed to fetch wallet address:", error);
    return NextResponse.json({ error: "Could not retrieve payment information" }, { status: 500 });
  }
}