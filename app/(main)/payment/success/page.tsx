import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Success = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center">Payment Successful</h1>
      <p className="text-center mt-4">Thank you for your purchase.</p>
      <Link href={"/purchases"}>
        <Button className="mt-8">Go to Purchases</Button>
      </Link>
    </div>
  );
};

export default Success;
