import Trade from "@/models/trade";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import { signInAndGetSession } from "@/utils/get-session";
import { NextResponse } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    await connectToDB();

    let profileId = params.profileId;
    let userToReturn;

    if (profileId === "current") {
      profileId = await signInAndGetSession();
      userToReturn = await User.findOne({
        _id: profileId,
      });
    } else {
      userToReturn = await User.findOne({
        public: true,
        _id: profileId,
      });
    }

    if (!userToReturn) {
      return new NextResponse("Profile ID not found or is not public", {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(userToReturn), { status: 201 });
  } catch (error) {
    console.log("[Profile GET]", error);
    return new NextResponse("Internal server while retrieving user", {
      status: 500,
    });
  }
}
