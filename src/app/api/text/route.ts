import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";

const store = getStore();

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  if (text.length > 100_000) {
    return NextResponse.json({ error: "text too long" }, { status: 400 });
  }

  await store.set(text);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const text = await store.get();
  if (!text) {
    return NextResponse.json({ text: "" });
  }
  return NextResponse.json({ text });
}
