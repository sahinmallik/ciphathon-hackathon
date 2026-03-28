import { Elysia, t } from "elysia";
import { prisma } from "../../../../../packages/db";

export const app = new Elysia().post(
  "/users",
  async ({ body, set }) => {
    try {
      const existing = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (existing) {
        return { message: "User Already Exist", existing };
      }
      const user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          clerkId: body.clerkId,
        },
      });
      if (user) {
        return {
          message: "User created successfully",
          user,
        };
      } else {
        return {
          message: "Error occured!!!",
        };
      }
    } catch (error) {
      set.status = 500;
      return { message: "Internal server error" };
    }
  },
  {
    body: t.Object({
      name: t.String({ minLength: 2 }),
      email: t.String({ format: "email" }),
      clerkId: t.String(),
    }),
  },
);
