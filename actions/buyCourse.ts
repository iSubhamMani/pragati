"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import sha256 from "crypto-js/sha256";
import { db } from "@/lib/firebase/config";
import { Course } from "@/lib/models/Course";
import { PurchasedCourse } from "@/lib/models/PurchasedCourse";
import axios from "axios";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getServerSession } from "next-auth";

export async function buyCourse(courseId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const courseRef = doc(db, "courses", courseId);
  const courseSnap = await getDoc(courseRef);
  const courseDetails = courseSnap.data() as Course;

  if (!courseSnap.exists()) {
    throw new Error("Course not found");
  }

  const purchasesRef = collection(db, "purchasedCourses");
  const purchaseQuery = query(
    purchasesRef,
    where("id", "==", courseId),
    where("purchasedBy", "==", session.user.email)
  );
  const isPurchased = await getDocs(purchaseQuery);

  if (isPurchased.docs.length !== 0) {
    throw new Error("Course already purchased");
  }

  // Add course to user's purchased courses

  const transactionId = "Tr-" + Date.now();

  const payload = {
    merchantId: process.env.MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: "MUID-" + Date.now(),
    amount: (parseInt(courseDetails.price) * 100).toString(),
    redirectUrl: `http://localhost:3000/api/status/${transactionId}`,
    redirectMode: "POST",
    callbackUrl: `http://localhost:3000/api/status/${transactionId}`,
    mobileNumber: "1234567890",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const dataPayload = JSON.stringify(payload);

  const dataBase64 = Buffer.from(dataPayload).toString("base64");

  const fullURL = dataBase64 + "/pg/v1/pay" + process.env.SALT_KEY;
  const dataSha256 = sha256(fullURL);

  const checksum = dataSha256 + "###" + process.env.SALT_INDEX;
  const UAT_PAY_API_URL =
    "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

  const purchasedCourse: PurchasedCourse = {
    ...courseDetails,
    purchasedBy: session.user.email!,
    purchasedByName: session.user.name!,
    purchasedAt: new Date().toISOString(),
    amount: courseDetails.price,
    videoSections: courseDetails.videoSections.map((section, index) => ({
      ...section,
      id: index + 1,
      isCompleted: false,
    })),
    isCompleted: false,
    isQuizAttempted: false,
    status: "PENDING",
    txnId: transactionId,
  };

  await addDoc(collection(db, "purchasedCourses"), purchasedCourse);
  const response = await axios.post(
    UAT_PAY_API_URL,
    {
      request: dataBase64,
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
    }
  );

  const redirect = response.data.data.instrumentResponse.redirectInfo.url;
  return { url: redirect };
}
