import { checkUser } from "@/lib/checkUser";
import { UserButton } from "@clerk/nextjs";
import { Show } from "@clerk/nextjs";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import React from "react";

type Props = {};

const Header = async (props: Props) => {
  await checkUser();
  return (
    <div className="w-full h-16 flex items-center justify-between px-10 border-b border-zinc-800">
      <h1 className="text-lg font-semibold text-cyan-400">Kyronyx AI</h1>

      <div className="flex items-center gap-4">
        <Show when="signed-in">
          <UserButton />
        </Show>

        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
      </div>
    </div>
  );
};

export default Header;
