"use server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) return null;

    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    return decodedToken.id;
  } catch(e) {
    return null;
  }
};

export async function getCurrentUser(request: NextRequest) {
  try {
    const currentUserId = getDataFromToken(request);

    if (!currentUserId) return null;

    const user = await User.findById(currentUserId).select("-password");

    return user;
  } catch(e) {
    return null;
  }
}
