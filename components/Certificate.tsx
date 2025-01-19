/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useContext, useEffect, useRef, useState } from "react";
import { WalletContext } from "@/context/wallet";
import toast from "react-hot-toast";
import { BrowserProvider, ethers } from "ethers";
import { toPng } from "html-to-image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import marketplace from "@/app/marketplace.json";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/lib/pinata";
import { VirtualWalletContext } from "@/context/VirtualWallet";

declare global {
  interface Window {
    ethereum: any;
  }
}

const Certificate = ({
  name,
  courseTitle,
  coursePrice,
  courseDescription,
}: {
  name: string;
  courseTitle: string;
  coursePrice: string;
  courseDescription: string;
}) => {
  const {
    isConnected,
    setIsConnected,
    userAddress,
    setUserAddress,
    setSigner,
    signer,
  } = useContext(WalletContext);

  const { setBalance } = useContext(VirtualWalletContext);

  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>("");
  const nftPrice = "1000";
  const [certificateImage, setCertificateImage] = useState<File | null>(null);

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

  const downloadCertificate = async () => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${courseTitle}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!certificateImage) return;

    async function handleFileChange() {
      try {
        const fd = new FormData();
        fd.append("file", certificateImage as Blob);
        const uploadPromise = uploadFileToIPFS(fd);
        toast.promise(uploadPromise, {
          loading: "Uploading Image...",
          success: "Image Uploaded Successfully",
          error: "Error during file upload",
        });

        const response = await uploadPromise;
        if (response.success === true) {
          setFileUrl(response.pinataURL as string);
        }
      } catch (error) {
        console.log(error);
      }
    }

    handleFileChange();
  }, [certificateImage]);

  async function uploadMetadataToIPFS() {
    if (!name || !courseDescription || !nftPrice || !fileUrl) {
      return;
    }

    const nftJSON = {
      name,
      courseDescription,
      nftPrice,
      image: fileUrl,
    };

    try {
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        return response.pinataURL;
      }
    } catch (e) {
      console.log("Error uploading JSON metadata: ", e);
    }
  }

  async function listNFT() {
    try {
      const metadataURLPromise = uploadMetadataToIPFS();
      toast.promise(metadataURLPromise, {
        loading: "Uploading NFT...",
        success: "NFT Uploaded Successfully",
        error: "NFT Upload Failed",
      });

      const metadataURL = await metadataURLPromise;

      const contract = new ethers.Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      const price = ethers.parseEther(nftPrice);

      const transactionPromise = contract.createToken(metadataURL, price);
      toast.promise(transactionPromise, {
        loading: "Creating NFT...",
        error: "Error creating NFT",
      });

      const transaction = await transactionPromise;
      await transaction.wait();

      toast.success("NFT Listed Successfully");
      setOpen(false);
      setBalance((prev) => prev + Number(coursePrice) / 2);
    } catch (e) {
      toast.error("Failed to list NFT");
      console.log("Error listing NFT: ", e);
    }
  }

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
        <Card
          ref={ref}
          id="certificate"
          className="max-w-4xl relative overflow-hidden"
        >
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
            {isConnected && (
              <Dialog open={open} onOpenChange={setOpen}>
                <Button
                  onClick={() => {
                    setOpen(true);
                    downloadCertificate();
                  }}
                  className="mt-3 font-bold"
                >
                  Mint
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Mint your certificate</DialogTitle>
                  </DialogHeader>
                  <Label>Upload the downloaded certificate</Label>
                  <Input
                    onChange={(e) => {
                      if (e.target.files) {
                        const file = e.target.files[0];
                        setCertificateImage(file);
                      }
                    }}
                    type="file"
                    accept="image/*"
                  />
                  <DialogFooter>
                    <Button onClick={listNFT} className="font-bold">
                      Mint Certificate
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Certificate;
