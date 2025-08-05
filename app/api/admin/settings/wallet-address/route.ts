// app/api/admin/settings/wallet-address/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth"; // Your admin authentication middleware
import clientPromise from "@/lib/mongodb";

const SETTING_KEY = "companyWalletAddress";

// GET handler for the admin to fetch the current address
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const client = await clientPromise;
    const db = client.db("massage_therapy");
    const settingsCollection = db.collection("settings");

    const walletSetting = await settingsCollection.findOne({ key: SETTING_KEY });

    return NextResponse.json({
      success: true,
      address: walletSetting?.value || "", // Return the address or an empty string
    });
  } catch (error) {
    console.error("Failed to fetch wallet address setting:", error);
    return NextResponse.json({ error: "Failed to fetch setting" }, { status: 500 });
  }
});

// PUT handler for the admin to update the address
export const PUT = requireAdmin(async (request: NextRequest) => {
  try {
    const { address } = await request.json();
    if (typeof address !== 'string') {
        return NextResponse.json({ error: "Invalid address format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("massage_therapy");
    const settingsCollection = db.collection("settings");

    // Use upsert to create the setting if it doesn't exist, or update it if it does
    await settingsCollection.updateOne(
        { key: SETTING_KEY },
        { $set: { key: SETTING_KEY, value: address.trim() } },
        { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Wallet address updated successfully." });
  } catch (error) {
    console.error("Failed to update wallet address setting:", error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
});