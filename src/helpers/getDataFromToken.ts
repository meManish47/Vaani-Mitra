import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export async function getCurrentUser(request: NextRequest) {
  try {
    const currentUserId = getDataFromToken(request);
    const user = await User.findById(currentUserId).select("-password"); // exclude password for security
    return user;
  } catch (error) {
    return null;
  }
}
