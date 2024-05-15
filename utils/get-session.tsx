import { connectToDB } from "@/utils/database";
import User from "@/models/user";

import Trade from "@/models/user";

import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const signInAndGetSession = async () => {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // check if user already exists
    const userExists = await User.findOne({ userId: user.id });

    // if not, create a new document and save user in MongoDB
    if (!userExists) {
      const newUser = await User.create({
        userId: user.id,
        username: user.firstName,
      });
      console.log("new user", newUser);
      return newUser._id.toString();
    }
    console.log("User exists", userExists);

    return userExists._id.toString();
  } catch (error: any) {
    console.log("Error checking if user exists: ", error.message);
    return "";
  }
};

// async session({ session }) {
//     // store the user id from MongoDB to session
//     const sessionUser = await User.findOne({ email: session.user.email });
//     session.user.id = sessionUser._id.toString();

//     return session;
//   }
