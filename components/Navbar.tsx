"use client";

import { VirtualWalletContext } from "@/context/VirtualWallet";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";

const Navbar = () => {
  const { balance } = useContext(VirtualWalletContext);

  return (
    <nav className="flex justify-between items-center p-6">
      <div>
        <Link className="flex items-center justify-center" href="/home">
          <div className="flex items-center gap-2">
            <Image src={"/logo.png"} width={28} height={28} alt="logo" />
            <span className="font-bold text-xl text-primary">Skillable</span>
          </div>
        </Link>
      </div>
      <div>
        <ul className="flex items-center gap-6">
          <li className="text-lg font-bold text-primary-foreground bg-primary px-4 py-1 rounded-md">
            Balance: ${balance}
          </li>
          <li>
            <Link
              className="hover:text-primary pb-1 border-b-2 border-primary text-lg font-medium text-secondary-foreground"
              href="/purchases"
            >
              Purchases
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-primary pb-1 border-b-2 border-primary text-lg font-medium text-secondary-foreground"
              href="/about"
            >
              About
            </Link>
          </li>

          <li>
            <span
              onClick={() => signOut({ callbackUrl: "/" })}
              className="cursor-pointer hover:text-primary pb-1 border-b-2 border-primary text-lg font-medium text-secondary-foreground"
            >
              Logout
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
