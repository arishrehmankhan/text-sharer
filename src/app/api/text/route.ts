import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
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

  const id = nanoid(8);
  await store.set(id, text);

  return NextResponse.json({ id });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const text = await store.get(id);

  if (!text) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({ text });
}
