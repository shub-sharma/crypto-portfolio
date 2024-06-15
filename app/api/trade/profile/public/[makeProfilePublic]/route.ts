import User from "@/models/user";
import { NextResponse } from "next/server";
import { signInAndGetSession } from "@/utils/get-session";

export async function PATCH(
  req: Request,
  { params }: { params: { makeProfilePublic: boolean } }
) {
  try {
    console.log("make profile: ", params.makeProfilePublic);

    const dbUserId = await signInAndGetSession();
    const existingUser = await User.findById(dbUserId);

    if (!existingUser) {
      return new NextResponse("User ID not found", { status: 404 });
    }
    existingUser.public = params.makeProfilePublic;
    console.log("existing user detials: ", existingUser);
    await existingUser.save();

    return new NextResponse(JSON.stringify(existingUser), { status: 201 });
  } catch (error) {
    console.log("[USER PATCH]", error);
    return new NextResponse("Internal server while updating user information", {
      status: 500,
    });
  }
}
