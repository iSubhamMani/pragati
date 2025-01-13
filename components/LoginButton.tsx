"use client";

import ShinyButton from "@/components/ui/shiny-button";
import { MoveRight } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";

const LoginButton = () => {
  return (
    <div>
      <ShinyButton onClick={() => signIn("google", { callbackUrl: "/home" })}>
        <span className="flex items-center font-bold gap-2 text-secondary-foreground">
          <Image src={"/google.png"} width={24} height={24} alt="Google" />
          Continue With Google
          <MoveRight />
        </span>
      </ShinyButton>
    </div>
  );
};

export default LoginButton;
