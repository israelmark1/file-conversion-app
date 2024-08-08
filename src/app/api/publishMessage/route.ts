// app/api/publishMessage/route.ts
import { NextRequest, NextResponse } from "next/server";
import { publishMessage } from "@/lib/gcp"; // Ensure this path is correct

export async function POST(request: NextRequest) {
  const { fileName } = await request.json();

  try {
    await publishMessage("files-to-convert", { fileName });
    return NextResponse.json({ message: "Message published successfully!" });
  } catch (error) {
    console.error("Error publishing message: ", error);
    return NextResponse.json(
      { error: "Failed to publish message" },
      { status: 500 }
    );
  }
}
