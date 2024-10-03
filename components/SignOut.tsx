"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { UserRound } from "lucide-react";

function SignOut() {
  return (
    <div
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/sign-in`,
        })
      }
      className="text-gray-700 inline hover:text-green-600 cursor-pointer"
    >
      <UserRound className="inline" />
    </div>
  );
}

export default SignOut;
