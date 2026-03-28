import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) return null;

  try {
    const response = await fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        clerkId: user.id,
      }),
    });

    if (!response.ok) {
      // Log the status if the backend returns an error (e.g., 400, 500)
      const errorText = await response.text();
      console.error(`Backend Error (${response.status}):`, errorText);
      return null;
    }

    const loggedInUser = await response.json();
    return loggedInUser;
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    return null;
  }
};
