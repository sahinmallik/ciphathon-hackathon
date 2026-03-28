import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) return null;

  try {
    // FORCE THE FETCH ADAPTER HERE
    const loggedInUser = await axios.post(
      "http://localhost:8080/users",
      {
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        clerkId: user.id,
      },
      {
        adapter: "fetch", // <--- Add this line
      },
    );

    return loggedInUser.data;
  } catch (error: any) {
    console.error("Axios Error:", error.message);
    return null;
  }
};
