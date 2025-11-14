"use server";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ user });
}
