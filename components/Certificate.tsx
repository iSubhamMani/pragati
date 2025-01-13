/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useContext } from "react";
import { WalletContext } from "@/context/wallet";
import toast from "react-hot-toast";
import { BrowserProvider } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

const Certificate = ({
  name,
  courseTitle,
}: {
  name: string;
  courseTitle: string;
}) => {
  const {
    isConnected,
    setIsConnected,
    userAddress,
    setUserAddress,
    setSigner,
  } = useContext(WalletContext);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("Wallet Not Found");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);

      const accounts = await provider.send("eth_requestAccounts", []);
      setUserAddress(accounts[0]);
      setIsConnected(true);

      const { chainId } = await provider.getNetwork();
      const sepoliaNetworkId = "43113";

      if (chainId.toString() !== sepoliaNetworkId) {
        toast.error("Please Switch To Fuji Network");
      } else {
        toast.success("Wallet Connected");
      }
    } catch (error) {
      toast.error("Error In Connecting Wallet");
      console.error("Connection error:", error);
    }
  };

  return (
    <div>
      <header className="mb-4 md:mb-6 flex justify-end">
        <Button
          onClick={connectWallet}
          className="flex items-center gap-2 font-bold"
        >
          <Image
            src={"/metamask-logo.svg"}
            alt="metamask"
            width={24}
            height={24}
          />
          {isConnected && userAddress
            ? `${userAddress.slice(0, 12)}...${userAddress.slice(-13)}`
            : "Connect with MetaMask"}
        </Button>
      </header>
      <main className="flex flex-col lg:flex-row gap-6">
        <Card id="certificate" className="max-w-4xl relative overflow-hidden">
          <Image
            src="/certificate-template.png"
            alt="Certificate Template"
            className="w-full h-auto"
            width={800}
            height={600}
          />
          <div className="absolute top-[40%] left-[65%] transform -translate-x-1/2 text-center w-full">
            <p className="text-base md:text-lg lg:text-xl font-bold text-primary">
              {name}
            </p>
          </div>
          {/* Course Title Position */}
          <div className="absolute top-[62%] left-[65%] transform -translate-x-1/2 text-center w-3/4">
            <p className="text-sm sm:text-base md:text-lg text-primary font-bold">
              {courseTitle}
            </p>
          </div>
        </Card>
        <Card className="h-max">
          <CardHeader>
            <CardTitle className="text-xl">Mint your certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-foreground font-medium">
              Mint your certificate on the blockchain to prove its authenticity.
            </p>
            <Button className="mt-3 font-bold">Mint</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Certificate;
